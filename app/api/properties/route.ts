import { NextResponse } from 'next/server';
import { getCollection, addToCollection } from '@/utils/store';
import { getPropertyInitials } from '@/utils/formatters';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    // Reserved for future date-filtered property metrics if needed
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

    return NextResponse.json({ success: true, properties }, { status: 200 });
  } catch (error) {
    console.error('[API Error - GET /api/properties]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing JSON request body.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Payload must be a valid object.' },
        { status: 400 }
      );
    }

    const propertyName = body.propertyName || 'New Property';

    const newProperty = {
      id: body.id || Date.now().toString(), // Allows specifying '2' for Sunset Villa during demos
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

    const savedItem = addToCollection('properties', newProperty);

    if (!savedItem) {
      return NextResponse.json(
        { success: false, error: 'Failed to save property to database store.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, property: savedItem }, { status: 201 });
  } catch (error) {
    console.error('[API Error - POST /api/properties]:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}