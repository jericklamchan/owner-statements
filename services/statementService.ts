import { getCollection, readDb, writeDb } from '@/utils/store';
import { getPropertyInitials } from '@/utils/formatters';
import { 
  getHostawayReservationsByHostawayId, 
  getQuickBooksExpensesByClass, 
  getStripeAdjustmentsByHostawayId 
} from '@/utils/mockService';
import { MONTHS, Year, MonthValue } from '@/src/constants/dates';

export interface StatementAdjustment {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface StatementOptions {
  propertyId: string;
  year?: Year | string;
  month?: MonthValue | string;
}

export interface StatementPatchPayload {
  status?: string;
  adjustments?: StatementAdjustment[];
  year?: Year | string;
  month?: MonthValue | string;
}

/**
- Core domain service to generate or retrieve an aggregated statement snapshot.
 */
export function getOrComputeStatement(options: StatementOptions) {
  const { propertyId, year = '2026', month = '10' } = options;
  const snapshotKey = `${propertyId}_${year}_${month}`;

  const properties = getCollection('properties');
  const property = properties.find((p: any) => p.id === propertyId);

  if (!property) {
    return { error: 'Property not found', status: 404 };
  }

  const db = readDb();
  const statementsCache = db.statements || {};
  const savedSnapshot = statementsCache[snapshotKey];

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

  // Financial Calculations
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

  const monthObj = MONTHS.find((m) => m.value === parseInt(String(month), 10));
  const monthName = monthObj ? monthObj.label : 'October';
  const monthYear = `${monthName} ${year}`;

  // Build UI Line Items
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
    year: parseInt(String(year), 10),
    month: parseInt(String(month), 10),
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

  return { statement, snapshotKey };
}

/**
- Updates and persists a statement snapshot in the database.
 */
export function updateAndSaveStatement(propertyId: string, payload: StatementPatchPayload) {
  const { status, adjustments, year = '2026', month = '10' } = payload;
  
  // Re-run computation using the updated context
  const result = getOrComputeStatement({ propertyId, year, month });
  if ('error' in result) {
    return result;
  }

  const { statement, snapshotKey } = result;
  
  const currentAdjustments = adjustments !== undefined ? adjustments : statement.adjustments;
  const newStatus = status !== undefined ? status : statement.status;

  // If adjustments changed, recalculate totals with the new adjustments list
  if (adjustments !== undefined) {
    // Re-run computation with updated adjustments explicitly passed or cached
    const db = readDb();
    if (!db.statements) db.statements = {};

    // Update specific fields on the statement snapshot
    statement.status = newStatus;
    statement.adjustments = currentAdjustments;
    statement.totalAdjustments = currentAdjustments.reduce(
      (acc: number, adj: any) => acc + Number(adj.amount || 0),
      0
    );
    statement.totalPayout = statement.grossRevenue - statement.mgmtFee - statement.totalExpenses + statement.totalAdjustments;
    
    // Rebuild adjustment line items
    const adjustmentLineItems = currentAdjustments.map((adj: any) => ({
      id: adj.id,
      date: adj.date,
      description: adj.description,
      category: 'Manual Adjustment',
      amount: Math.abs(adj.amount),
      type: adj.amount >= 0 ? 'income' : 'expense',
      source: 'Manual Adjustment',
    }));

    // Filter out old adjustment line items and append new ones
    statement.lineItems = [
      ...statement.lineItems.filter((li: any) => li.source !== 'Manual Adjustment'),
      ...adjustmentLineItems,
    ];

    db.statements[snapshotKey] = statement;
    const success = writeDb(db);
    if (!success) {
      return { error: 'Failed to write statement snapshot to database.', status: 500 };
    }

    return { statement };
  } else {
    // Just update status if no adjustments changed
    const db = readDb();
    if (!db.statements) db.statements = {};
    statement.status = newStatus;
    db.statements[snapshotKey] = statement;
    const success = writeDb(db);
    if (!success) {
      return { error: 'Failed to write statement snapshot to database.', status: 500 };
    }
    return { statement };
  }
}