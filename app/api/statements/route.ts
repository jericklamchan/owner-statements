import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In production, this would query your database or aggregate properties list from Hostaway
    const properties = [
      {
        id: '1',
        propertyName: 'Modern Alpine Loft',
        ownerName: 'Michael Vance',
        year: 2026,
        month: 10,
        status: 'draft',
        ownerPayout: 2340.50,
        commission: 468.10,
      },
      {
        id: '2',
        propertyName: 'Sunset Beach Villa',
        ownerName: 'Sarah Jenkins',
        year: 2026,
        month: 10,
        status: 'published',
        ownerPayout: 4120.00,
        commission: 824.00,
      },
    ];

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch properties list' }, { status: 500 });
  }
}