import { NextResponse } from 'next/server';
import { getCollection, addToCollection } from '../../../utils/store';
import { getPropertyInitials } from '@/utils/formatters';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get('year');
  const monthParam = searchParams.get('month');

  const year = yearParam ? parseInt(yearParam, 10) : 2026;
  const month = monthParam ? parseInt(monthParam, 10) : 10;

  const rawProperties = getCollection('properties').filter((p: any) => p.status !== 'deleted');

  // Normalize properties with safe default financial fields to prevent UI crashes
  const properties = rawProperties.map((p: any) => ({
    ...p,
    avatarInitials: p.avatarInitials || getPropertyInitials(p.propertyName),
    status: p.status || 'created',
    ownerPayout: p.ownerPayout ?? 0,
    commission: p.commission ?? 0,
    grossRevenue: p.grossRevenue ?? 0,
  }));

  return NextResponse.json({ success: true, properties });
}

export async function POST(request: Request) {
  const body = await request.json();
  const propertyName = body.propertyName || 'New Property';

  const newProperty = {
    id: body.id || Date.now().toString(), // Allows specifying '2' for Sunset Villa during your demo if desired
    propertyName,
    ownerName: body.ownerName || 'Unknown Owner',
    address: body.address || '',
    city: body.city || '',
    country: body.country || '',
    avatarInitials: getPropertyInitials(propertyName),
    status: 'created' as const,
    ownerPayout: 0,
    commission: 0,
    grossRevenue: 0,
  };

  addToCollection('properties', newProperty);
  return NextResponse.json({ success: true, property: newProperty }, { status: 201 });
}