import { NextResponse } from 'next/server';
import { getCollection, addToCollection } from '../store';

export async function GET() {
  return NextResponse.json({ success: true, properties: getCollection('properties') });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProperty = {
    id: Date.now().toString(),
    propertyName: body.propertyName || 'New Property',
    ownerName: body.ownerName || 'Unknown Owner',
    avatarInitials: body.propertyName ? body.propertyName.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase() : 'NP',
    status: 'not_generated',
    date: null,
    ownerPayout: null,
    commission: null,
    year: 2026,
    month: 10,
  };
  addToCollection('properties', newProperty);
  return NextResponse.json({ success: true, property: newProperty }, { status: 201 });
}