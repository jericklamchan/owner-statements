import { NextResponse } from 'next/server';
import { getCollection, readDb, writeDb } from '@/utils/store';
import { getOrComputeStatement } from '@/services/statementService';
import { PropertyRecord } from '@/types';
import { STATEMENT_STATUSES } from '@/src/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Derive defaults directly from centralized constants or current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed (9 = Oct)

    const year = searchParams.get('year') || String(currentYear);
    const month = searchParams.get('month') || String(currentMonth);

    // Fetch all active properties from the store
    const rawProperties = getCollection('properties') as PropertyRecord[];

    // Compute or retrieve the full statement snapshot for every property for the given month/year
    const properties = rawProperties.map((p) => {
      const result = getOrComputeStatement({ propertyId: p.id, year, month });
      if ('error' in result) {
        // Fallback structure if statement generation fails
        return {
          id: p.id,
          propertyId: p.id,
          propertyName: p.propertyName,
          ownerName: p.ownerName,
          avatarInitials: p.avatarInitials || '',
          status: 'NOT_GENERATED',
          totalPayout: 0,
        };
      }
      return result.statement;
    });

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
    const body = await request.json().catch(() => null);

    if (!body || !body.propertyName) {
      return NextResponse.json(
        { success: false, error: 'propertyName is required' },
        { status: 400 }
      );
    }

    const db = readDb() || {};
    if (!db.properties) db.properties = [];

    const newProperty = {
      id: `prop_${Date.now()}`,
      propertyName: body.propertyName,
      ownerName: body.ownerName || '',
      hostaway_id: body.hostaway_id || '',
      qbo_class_name: body.qbo_class_name || '',
      status: STATEMENT_STATUSES.NOT_GENERATED,
    };

    db.properties.push(newProperty);
    const success = writeDb(db);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to save property to database.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, property: newProperty }, { status: 201 });
  } catch (error) {
    console.error('[API Error - POST /api/properties]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    );
  }
}