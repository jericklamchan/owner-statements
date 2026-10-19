import { NextResponse } from 'next/server';
import { getOrComputeStatement, updateAndSaveStatement } from '@/services/statementService';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const propertyId = resolvedParams?.id;

    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'Property ID is required.' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || '2026';
    const month = searchParams.get('month') || '10';

    const result = getOrComputeStatement({ propertyId, year, month });

    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true, statement: result.statement }, { status: 200 });
  } catch (error) {
    console.error('[API Error - GET /api/statements/[id]]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate statement data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const propertyId = resolvedParams?.id;

    if (!propertyId) {
      return NextResponse.json({ success: false, error: 'Property ID is required.' }, { status: 400 });
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

    const result = updateAndSaveStatement(propertyId, body);

    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true, statement: result.statement }, { status: 200 });
  } catch (error) {
    console.error('[API Error - PATCH /api/statements/[id]]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save statement snapshot' },
      { status: 500 }
    );
  }
}