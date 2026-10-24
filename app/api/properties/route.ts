import { NextResponse } from 'next/server';
import { getCollection } from '@/utils/store';
import { getOrComputeStatement } from '@/services/statementService';
import { PropertyRecord } from '@/types';
import { YEARS, MONTHS } from '@/src/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Derive defaults directly from centralized constants
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed (0 = Jan, 9 = Oct)

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
  // Keep your existing POST handler implementation intact here...
}