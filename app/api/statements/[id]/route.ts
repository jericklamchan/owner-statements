import { NextResponse } from 'next/server';
import { getCollection, readDb, writeDb } from '../../store';
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
    const snapshotKey = `${propertyId}_${year}_${month}`;

    const properties = getCollection('properties');
    const property = properties.find((p: any) => p.id === propertyId);

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const db = readDb();
    const statementsCache = db.statements || {};
    const savedSnapshot = statementsCache[snapshotKey];

    // Use snapshot data if available (historical backtrack), otherwise fetch live source data
    let reservations, expenses, adjustments, status;

    if (savedSnapshot) {
      status = savedSnapshot.status;
      adjustments = savedSnapshot.adjustments || [];
      reservations = savedSnapshot.reservations || [];
      expenses = savedSnapshot.expenses || [];
    } else {
      status = 'not_generated';
      adjustments = [];
      reservations = getHostawayReservationsByHostawayId(property.hostaway_id);
      
      const hasVrboBooking = reservations.some(
        (r: any) => r.channel && r.channel.toLowerCase() === 'vrbo'
      );
      const qboExpenses = getQuickBooksExpensesByClass(property.qbo_class_name);
      const stripeCharges = hasVrboBooking ? getStripeAdjustmentsByHostawayId(property.hostaway_id) : [];
      expenses = [...qboExpenses, ...stripeCharges];
    }

    // Core Financial Calculations
    const baseRentalIncome = reservations.reduce(
      (acc: number, r: any) => acc + (r.totalPrice - (r.cleaningFee || 0)),
      0
    );
    const cleaningFees = reservations.reduce(
      (acc: number, r: any) => acc + (r.cleaningFee || 0),
      0
    );
    
    const mgmtFee = Math.round(baseRentalIncome * 0.18);
    const totalExpenses = expenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const grossRevenue = baseRentalIncome + cleaningFees;

    const totalAdjustments = adjustments.reduce(
      (acc: number, adj: any) => acc + Number(adj.amount || 0),
      0
    );

    const totalPayout = grossRevenue - mgmtFee - totalExpenses + totalAdjustments;

    const totalNights = 31;
    const occupiedNights = reservations.reduce((acc: number, r: any) => acc + (r.nights || 0), 0);
    const occupancyRate = Number(((occupiedNights / totalNights) * 100).toFixed(1));
    const avgDailyRate = occupiedNights > 0 ? Math.round(baseRentalIncome / occupiedNights) : 0;

    const monthObj = MONTHS.find((m) => m.value === parseInt(month, 10));
    const monthName = monthObj ? monthObj.label : 'October';
    const monthYear = `${monthName} ${year}`;

    // Build Complete UI Line Items
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
      category: e.id && e.id.startsWith('ADJ') ? 'Stripe Fee' : (e.category || 'Maintenance'),
      amount: e.amount,
      type: 'expense',
      source: e.id && e.id.startsWith('ADJ') ? 'Stripe' : 'QuickBooks',
    }));

    const adjustmentLineItems = adjustments.map((adj: any) => ({
      id: adj.id,
      date: adj.date,
      description: adj.description,
      category: 'Manual Adjustment',
      amount: Math.abs(adj.amount),
      type: adj.amount >= 0 ? 'income' : 'expense',
      source: 'Manual Adjustment',
    }));

    const lineItems = [
      ...reservationLineItems,
      ...cleaningLineItems,
      ...mgmtFeeLineItem,
      ...expenseLineItems,
      ...adjustmentLineItems,
    ];

    const statement = {
      propertyId: property.id,
      propertyName: property.propertyName,
      ownerName: property.ownerName,
      avatarInitials: getPropertyInitials(property.propertyName),
      monthYear,
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      status,
      baseRentalIncome,
      cleaningFees,
      grossRevenue,
      mgmtFee,
      totalExpenses,
      totalAdjustments,
      totalPayout,
      occupancyRate,
      occupiedNights,
      totalNights,
      avgDailyRate,
      reservations,
      expenses,
      adjustments,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const propertyId = resolvedParams.id;
    const body = await request.json();
    const { status, adjustments, year = '2026', month = '10' } = body;
    const snapshotKey = `${propertyId}_${year}_${month}`;

    const properties = getCollection('properties');
    const property = properties.find((p: any) => p.id === propertyId);
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const db = readDb();
    if (!db.statements) {
      db.statements = {};
    }

    const existingSnapshot = db.statements[snapshotKey] || {};

    let reservations = existingSnapshot.reservations;
    let expenses = existingSnapshot.expenses;

    if (!reservations) {
      reservations = getHostawayReservationsByHostawayId(property.hostaway_id);
      const hasVrboBooking = reservations.some((r: any) => r.channel && r.channel.toLowerCase() === 'vrbo');
      const qboExpenses = getQuickBooksExpensesByClass(property.qbo_class_name);
      const stripeCharges = hasVrboBooking ? getStripeAdjustmentsByHostawayId(property.hostaway_id) : [];
      expenses = [...qboExpenses, ...stripeCharges];
    }

    const currentAdjustments = adjustments !== undefined ? adjustments : (existingSnapshot.adjustments || []);
    const newStatus = status !== undefined ? status : (existingSnapshot.status || 'draft');

    const baseRentalIncome = reservations.reduce(
      (acc: number, r: any) => acc + (r.totalPrice - (r.cleaningFee || 0)),
      0
    );
    const cleaningFees = reservations.reduce(
      (acc: number, r: any) => acc + (r.cleaningFee || 0),
      0
    );
    const grossRevenue = baseRentalIncome + cleaningFees;
    const mgmtFee = Math.round(baseRentalIncome * 0.18);
    const totalExpenses = expenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const totalAdjustments = currentAdjustments.reduce(
      (acc: number, adj: any) => acc + Number(adj.amount || 0),
      0
    );
    const totalPayout = grossRevenue - mgmtFee - totalExpenses + totalAdjustments;

    const totalNights = 31;
    const occupiedNights = reservations.reduce((acc: number, r: any) => acc + (r.nights || 0), 0);
    const occupancyRate = Number(((occupiedNights / totalNights) * 100).toFixed(1));
    const avgDailyRate = occupiedNights > 0 ? Math.round(baseRentalIncome / occupiedNights) : 0;

    const monthObj = MONTHS.find((m) => m.value === parseInt(month, 10));
    const monthName = monthObj ? monthObj.label : 'October';
    const monthYear = `${monthName} ${year}`;

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
      category: e.id && e.id.startsWith('ADJ') ? 'Stripe Fee' : (e.category || 'Maintenance'),
      amount: e.amount,
      type: 'expense',
      source: e.id && e.id.startsWith('ADJ') ? 'Stripe' : 'QuickBooks',
    }));

    const adjustmentLineItems = currentAdjustments.map((adj: any) => ({
      id: adj.id,
      date: adj.date,
      description: adj.description,
      category: 'Manual Adjustment',
      amount: Math.abs(adj.amount),
      type: adj.amount >= 0 ? 'income' : 'expense',
      source: 'Manual Adjustment',
    }));

    const lineItems = [
      ...reservationLineItems,
      ...cleaningLineItems,
      ...mgmtFeeLineItem,
      ...expenseLineItems,
      ...adjustmentLineItems,
    ];

    const statementSnapshot = {
      propertyId: property.id,
      propertyName: property.propertyName,
      ownerName: property.ownerName,
      avatarInitials: getPropertyInitials(property.propertyName),
      monthYear,
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      status: newStatus,
      baseRentalIncome,
      cleaningFees,
      grossRevenue,
      mgmtFee,
      totalExpenses,
      totalAdjustments,
      totalPayout,
      occupancyRate,
      occupiedNights,
      totalNights,
      avgDailyRate,
      reservations,
      expenses,
      adjustments: currentAdjustments,
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

    db.statements[snapshotKey] = statementSnapshot;
    writeDb(db);

    return NextResponse.json({ success: true, statement: statementSnapshot });
  } catch (error) {
    console.error('Statement Snapshot Update Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save statement snapshot' },
      { status: 500 }
    );
  }
}