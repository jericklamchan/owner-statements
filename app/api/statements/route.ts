import { NextResponse } from 'next/server';
import { getCollection, readDb } from '@/utils/store';
import { 
  getHostawayReservationsByHostawayId, 
  getQuickBooksExpensesByClass, 
  getStripeAdjustmentsByHostawayId 
} from '@/utils/mockService';
import { STATEMENT_STATUSES, CHANNELS, YEARS, MONTHS } from '@/src/constants';
import { ReservationItem, ExpenseItem, PropertyStatement } from '@/types/statement';
import { PropertyRecord } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const defaultYear = YEARS[0] || 2026;
    const defaultMonth = MONTHS[0]?.value || 10;

    const year = searchParams.get('year') || String(defaultYear);
    const month = searchParams.get('month') || String(defaultMonth);

    const properties = getCollection('properties') as PropertyRecord[];
    const db = readDb() as { statements?: Record<string, PropertyStatement> };
    const statementsCache = db.statements || {};

    const statementsWithStatus = properties.map((property: PropertyRecord) => {
      const snapshotKey = `${property.id}_${year}_${month}`;
      const savedSnapshot = statementsCache[snapshotKey];

      if (savedSnapshot) {
        return {
          ...property,
          status: savedSnapshot.status,
          ownerPayout: savedSnapshot.totalPayout,
          commission: savedSnapshot.mgmtFee,
          year: savedSnapshot.year,
          month: savedSnapshot.month,
        };
      }

      // Fallback live calculation for properties without a saved snapshot yet
      const reservations = getHostawayReservationsByHostawayId(property.hostaway_id) as ReservationItem[];
      const baseRentalIncome = reservations.reduce(
        (acc: number, r: ReservationItem) => acc + (r.totalPrice - (r.cleaningFee || 0)),
        0
      );
      const cleaningFees = reservations.reduce(
        (acc: number, r: ReservationItem) => acc + (r.cleaningFee || 0),
        0
      );
      const grossRevenue = baseRentalIncome + cleaningFees;
      const mgmtFee = Math.round(baseRentalIncome * 0.18);
      
      const hasVrboBooking = reservations.some((r: ReservationItem) => r.channel && r.channel.toLowerCase() === CHANNELS.VRBO.toLowerCase());
      const qboExpenses = getQuickBooksExpensesByClass(property.qbo_class_name) as ExpenseItem[];
      const stripeCharges = hasVrboBooking ? (getStripeAdjustmentsByHostawayId(property.hostaway_id) as ExpenseItem[]) : [];
      const totalExpenses = [...qboExpenses, ...stripeCharges].reduce((acc: number, e: ExpenseItem) => acc + (Number(e.amount) || 0), 0);

      const totalPayout = grossRevenue - mgmtFee - totalExpenses;

      return {
        ...property,
        status: STATEMENT_STATUSES.NOT_GENERATED,
        ownerPayout: totalPayout,
        commission: mgmtFee,
        year: parseInt(year, 10),
        month: parseInt(month, 10),
      };
    });

    return NextResponse.json({ success: true, statements: statementsWithStatus }, { status: 200 });
  } catch (error) {
    console.error('[API Error - GET /api/statements]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statements list' },
      { status: 500 }
    );
  }
}