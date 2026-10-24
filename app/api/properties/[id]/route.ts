import { NextResponse } from 'next/server';
import { updateInCollection, deleteFromCollection } from '@/utils/store';
import { STATEMENT_STATUSES } from '@/src/constants';

type RouteParams = { params: Promise<{ id: string }> };

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

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Payload must be a valid object.' },
        { status: 400 }
      );
    }

    // Validate status if provided in payload
    if (body.status && !Object.values(STATEMENT_STATUSES).includes(body.status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status value. Must be one of: ${Object.values(STATEMENT_STATUSES).join(', ')}` },
        { status: 400 }
      );
    }

    const updated = updateInCollection('properties', id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Property not found or update failed.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, property: updated }, { status: 200 });
  } catch (error) {
    console.error('[API Error - PUT /api/properties/[id]]:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required.' },
        { status: 400 }
      );
    }

    const success = deleteFromCollection('properties', id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Property not found or deletion failed.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API Error - DELETE /api/properties/[id]]:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}