import { NextResponse } from 'next/server';
import { getCollection } from '../../store';
import { getPropertyInitials } from '@/utils/formatters';
import { 
  getHostawayReservationsByHostawayId, 
  getQuickBooksExpensesByClass, 
  getStripeAdjustmentsByHostawayId 
} from '@/utils/mockService';
import { MONTHS } from '@/utils/constants';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const propertyId = resolvedParams.id;

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || '2026';
    const month = searchParams.get('month') || '10';

    // 1. Get base property details from store (db.json)
    const properties = getCollection('properties');
    const property = properties.find((p: any) => p.id === propertyId);

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    // 2. Fetch data via service functions using external integration identifiers
    const reservations = getHostawayReservationsByHostawayId(property.hostaway_id);

    // Check if any reservation is from VRBO
    const hasVrboBooking = reservations.some(
      (r: any) => r.channel && r.channel.toLowerCase() === 'vrbo'
    );

    const qboExpenses = getQuickBooksExpensesByClass(property.qbo_class_name);
    const stripeCharges = hasVrboBooking ? getStripeAdjustmentsByHostawayId(property.hostaway_id) : [];
    const expenses = [...qboExpenses, ...stripeCharges];

    // 3. Core Financial Calculations
    const baseRentalIncome = reservations.reduce(
      (acc: number, r: any) => acc + (r.totalPrice - (r.cleaningFee || 0)),
      0
    );
    const cleaningFees = reservations.reduce(
      (acc: number, r: any) => acc + (r.cleaningFee || 0),
      0
    );
    
    const mgmtFee = Math.round(baseRentalIncome * 0.18); // 18% management fee
    const totalExpenses = expenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const grossRevenue = baseRentalIncome + cleaningFees;
    const totalPayout = grossRevenue - mgmtFee - totalExpenses;

    // Performance Metrics
    const totalNights = 31;
    const occupiedNights = reservations.reduce((acc: number, r: any) => acc + (r.nights || 0), 0);
    const occupancyRate = Number(((occupiedNights / totalNights) * 100).toFixed(1));
    const avgDailyRate = occupiedNights > 0 ? Math.round(baseRentalIncome / occupiedNights) : 0;

    // Use centralized MONTHS constant instead of a hardcoded array
    const monthObj = MONTHS.find((m) => m.value === parseInt(month, 10));
    const monthName = monthObj ? monthObj.label : 'October';
    const monthYear = `${monthName} ${year}`;

    // 4. Build Complete UI Line Items
    const reservationLineItems = reservations.map((r: any) => ({
      id: r.id,
      date: r.from,
      description: `Reservation Payout (${r.channel}) - ${r.nights} nights`,
      category: 'Rental Income',
      amount: r.totalPrice - (r.cleaningFee || 0),
      type: 'income',
      source: 'Hostaway',
    }));

    const cleaningLineItems = reservations.map((r: any) => ({
      id: `${r.id}-clean`,
      date: r.from,
      description: `Cleaning Fee Collected (${r.channel})`,
      category: 'Cleaning Fee',
      amount: r.cleaningFee || 0,
      type: 'income',
      source: 'Hostaway',
    }));

    const mgmtFeeLineItem = mgmtFee > 0 ? [{
      id: `MGMT-${property.id}`,
      date: `${year}-${month}-01`,
      description: 'Management Fee (18% of Base Rental Income)',
      category: 'Management Fee',
      amount: mgmtFee,
      type: 'expense',
      source: 'Internal System',
    }] : [];

    const expenseLineItems = expenses.map((e: any) => ({
      id: e.id,
      date: e.date,
      description: e.description,
      category: e.id.startsWith('ADJ') ? 'Stripe Fee' : (e.category || 'Maintenance'),
      amount: e.amount,
      type: 'expense',
      source: e.id.startsWith('ADJ') ? 'Stripe' : 'QuickBooks',
    }));

    const lineItems = [
      ...reservationLineItems,
      ...cleaningLineItems,
      ...mgmtFeeLineItem,
      ...expenseLineItems,
    ];

    const statement = {
      propertyId: property.id,
      propertyName: property.propertyName,
      ownerName: property.ownerName,
      avatarInitials: getPropertyInitials(property.propertyName),
      monthYear,
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      status: 'Draft',
      baseRentalIncome,
      cleaningFees,
      grossRevenue,
      mgmtFee,
      totalExpenses,
      totalPayout,
      occupancyRate,
      occupiedNights,
      totalNights,
      avgDailyRate,
      reservations,
      expenses,
      qboExpenses,
      stripeCharges,
      lineItems,
      quickbooksSync: {
        syncStatus: 'Synced',
        journalEntryId: `JE-${year}-${property.id}`,
        lastSyncedAt: `${year}-${month}-03 11:45:00`,
      },
      stripePayout: {
        transferId: `tr_prop_${property.id}`,
        payoutStatus: 'Processing',
        destinationAccount: `ba_acc_${property.id}`,
      },
    };

    return NextResponse.json({ success: true, statement });
  } catch (error) {
    console.error('Statement Aggregator Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate statement data' },
      { status: 500 }
    );
  }
}