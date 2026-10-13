import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const propertyId = resolvedParams.id;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Fetch from internal mock API routes concurrently
    const [resRes, expRes, adjRes] = await Promise.all([
      fetch(`${baseUrl}/api/hostaway/reservations`).then((r) => r.json()),
      fetch(`${baseUrl}/api/quickbooks/expenses`).then((r) => r.json()),
      fetch(`${baseUrl}/api/stripe/adjustments`).then((r) => r.json()),
    ]);

    const reservations = resRes.data || [];
    const expenses = [...(expRes.data || []), ...(adjRes.data || [])];

    // Core Financial Calculations
    const baseRentalIncome = reservations.reduce(
      (acc: number, r: any) => acc + (r.totalPrice - r.cleaningFee),
      0
    );
    const cleaningFees = reservations.reduce(
      (acc: number, r: any) => acc + r.cleaningFee,
      0
    );
    
    // 20% Management fee on base rental income
    const mgmtFee = baseRentalIncome * 0.20;
    const totalExpenses = expenses.reduce((acc: number, e: any) => acc + e.amount, 0);
    const grossRevenue = baseRentalIncome + cleaningFees;
    const totalPayout = grossRevenue - mgmtFee - totalExpenses;

    // Performance Metrics
    const totalNights = 31;
    const occupiedNights = reservations.reduce((acc: number, r: any) => acc + r.nights, 0);
    const occupancyRate = Number(((occupiedNights / totalNights) * 100).toFixed(1));
    const avgDailyRate = occupiedNights > 0 ? baseRentalIncome / occupiedNights : 0;

    // 1. Build Rental Income Line Items
    const reservationLineItems = reservations.map((r: any) => ({
      id: r.id,
      date: r.from,
      description: `Reservation Payout (${r.channel}) - ${r.nights} nights`,
      category: 'Rental Income', // Matches LineItemsTab filter
      amount: r.totalPrice - r.cleaningFee,
      type: 'income',
      source: 'Hostaway',
    }));

    // 2. Build Cleaning Fee Line Items
    const cleaningLineItems = reservations.map((r: any) => ({
      id: `${r.id}-clean`,
      date: r.from,
      description: `Cleaning Fee Collected (${r.channel})`,
      category: 'Cleaning Fee', // Matches LineItemsTab filter
      amount: r.cleaningFee,
      type: 'income',
      source: 'Hostaway',
    }));

    // 3. Build Expense & Adjustment Line Items
    const expenseLineItems = expenses.map((e: any) => ({
      id: e.id,
      date: e.date,
      description: e.description,
      category: e.category || 'Maintenance', // Anything else goes to Fees & Deductions
      amount: e.amount,
      type: 'expense',
      source: e.id.startsWith('ADJ') ? 'Stripe' : 'QuickBooks',
    }));

    // Aggregated Statement Payload matching Frontend Type Definitions
    const statement = {
      propertyId,
      propertyName: propertyId === '2' ? 'Sunset Beach Villa' : 'Modern Alpine Loft',
      ownerName: propertyId === '2' ? 'Sarah Jenkins' : 'Michael Vance',
      monthYear: 'October 2026',
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
      lineItems: [
        ...reservationLineItems,
        ...cleaningLineItems,
        ...expenseLineItems,
      ],
    };

    return NextResponse.json({ success: true, statement });
  } catch (error) {
    console.error('Aggregator Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate statement data' },
      { status: 500 }
    );
  }
}