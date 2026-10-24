import { NextResponse } from 'next/server';
import { getCollection, updateInCollection } from '@/utils/store';
import { PropertyRecord, PropertyPolicy } from '@/types';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required.' },
        { status: 400 }
      );
    }

    const properties = (getCollection('properties') || []) as PropertyRecord[];
    const property = properties.find((p) => p.id === id);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, policy: property.policy || {} },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API Error - GET /api/properties/[id]/policy]:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required.' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing JSON request body.' },
        { status: 400 }
      );
    }

    const properties = (getCollection('properties') || []) as PropertyRecord[];
    const existingProperty = properties.find((p) => p.id === id);

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: 'Property not found.' },
        { status: 404 }
      );
    }

    const policyPayload: PropertyPolicy = body.policy || body;

    const updated = updateInCollection('properties', id, {
      policy: policyPayload,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update property policy.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, property: updated }, { status: 200 });
  } catch (error) {
    console.error('[API Error - PUT /api/properties/[id]/policy]:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}