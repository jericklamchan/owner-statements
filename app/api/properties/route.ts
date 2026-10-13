import { NextResponse } from 'next/server';
import { getCollection, addToCollection } from '../store';

function getPropertyInitials(name: string): string {
  if (!name) return 'PR';
  return name
    .trim()
    .split(/\s+/)
    .map((w: string) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

// Helper to simulate realistic statement financials based on property ID, year, and month
function simulateStatementData(propertyId: string, year: number, month: number) {
  let hash = 0;
  const str = `${propertyId}-${year}-${month}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const ownerPayout = 1200 + (positiveHash % 3300);
  const commission = Math.round(ownerPayout * 0.18);
  const statuses: ('not_generated' | 'draft' | 'published')[] = ['published', 'published', 'draft', 'not_generated'];
  const status = statuses[positiveHash % statuses.length];

  return {
    year,
    month,
    ownerPayout,
    commission,
    status,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get('year');
  const monthParam = searchParams.get('month');

  const year = yearParam ? parseInt(yearParam, 10) : 2026;
  const month = monthParam ? parseInt(monthParam, 10) : 10;

  const rawProperties = getCollection('properties').filter((p: any) => p.status !== 'deleted');

  // Enrich base properties with computed 2-char initials and simulated monthly statement metrics
  const properties = rawProperties.map((p: any) => {
    const statement = simulateStatementData(p.id, year, month);
    return {
      ...p,
      avatarInitials: getPropertyInitials(p.propertyName),
      ...statement,
    };
  });

  return NextResponse.json({ success: true, properties });
}

export async function POST(request: Request) {
  const body = await request.json();
  const propertyName = body.propertyName || 'New Property';

  const newProperty = {
    id: Date.now().toString(),
    propertyName,
    ownerName: body.ownerName || 'Unknown Owner',
    address: body.address || '',
    city: body.city || '',
    country: body.country || '',
    avatarInitials: getPropertyInitials(propertyName),
    status: 'created' as const,
  };

  addToCollection('properties', newProperty);
  return NextResponse.json({ success: true, property: newProperty }, { status: 201 });
}