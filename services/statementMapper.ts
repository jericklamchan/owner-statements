import { PropertyStatement, StatementAdjustment } from '@/types/statement';
import { STATEMENT_STATUSES, SOURCE_TYPES, LINE_ITEM_TYPES } from '@/src/constants';
import { getPropertyInitials } from '@/utils/formatters';

export function normalizeStatementSnapshot(
  rawSnapshot: any, 
  property: { id: string; propertyName: string; ownerName: string },
  year: number | string,
  month: number | string,
  monthYearString: string
): PropertyStatement {
  // Safe extractions with centralized defaults at the boundary
  const reservations = Array.isArray(rawSnapshot?.reservations) ? rawSnapshot.reservations : [];
  const expenses = Array.isArray(rawSnapshot?.expenses) ? rawSnapshot.expenses : [];
  const adjustments: StatementAdjustment[] = Array.isArray(rawSnapshot?.adjustments) 
    ? rawSnapshot.adjustments 
    : [];

  const baseRentalIncome = reservations.reduce(
    (acc: number, r: any) => acc + (Number(r.totalPrice || 0) - Number(r.cleaningFee || 0)),
    0
  );
  
  const cleaningFees = reservations.reduce(
    (acc: number, r: any) => acc + Number(r.cleaningFee || 0),
    0
  );

  const grossRevenue = baseRentalIncome + cleaningFees;
  const mgmtFee = rawSnapshot?.mgmtFee ?? Math.round(baseRentalIncome * 0.18);
  const totalExpenses = expenses.reduce((acc: number, e: any) => acc + Number(e.amount || 0), 0);
  const totalAdjustments = adjustments.reduce((acc: number, adj: any) => acc + Number(adj.amount || 0), 0);

  const totalPayout = grossRevenue - mgmtFee - totalExpenses + totalAdjustments;

  const totalNights = 31;
  const occupiedNights = reservations.reduce((acc: number, r: any) => acc + Number(r.nights || 0), 0);
  const occupancyRate = Number(((occupiedNights / totalNights) * 100).toFixed(1));
  const avgDailyRate = occupiedNights > 0 ? Math.round(baseRentalIncome / occupiedNights) : 0;

  // Rebuild standard UI line items cleanly
  const reservationLineItems = reservations.map((r: any) => ({
    id: r.id,
    date: r.from,
    description: `Reservation Payout (${r.channel || 'Direct'}) - ${r.nights || 0} nights`,
    category: 'Rental Income',
    amount: Number(r.totalPrice || 0) - Number(r.cleaningFee || 0),
    type: LINE_ITEM_TYPES.INCOME,
    source: SOURCE_TYPES.HOSTAWAY,
  }));

  const cleaningLineItems = reservations.map((r: any) => ({
    id: `${r.id}-clean`,
    date: r.from,
    description: `Cleaning Fee Collected (${r.channel || 'Direct'})`,
    category: 'Cleaning Fee',
    amount: Number(r.cleaningFee || 0),
    type: LINE_ITEM_TYPES.INCOME,
    source: SOURCE_TYPES.HOSTAWAY,
  }));

  const mgmtFeeLineItem = mgmtFee > 0 ? [{
    id: `MGMT-${property.id}`,
    date: `${year}-${month}-01`,
    description: 'Management Fee (18% of Base Rental Income)',
    category: 'Management Fee',
    amount: mgmtFee,
    type: LINE_ITEM_TYPES.EXPENSE,
    source: SOURCE_TYPES.INTERNAL_SYSTEM,
  }] : [];

  const expenseLineItems = expenses.map((e: any) => ({
    id: e.id,
    date: e.date,
    description: e.description,
    category: e.id && e.id.startsWith('ADJ') ? 'Stripe Fee' : (e.category || 'Maintenance'),
    amount: Number(e.amount || 0),
    type: LINE_ITEM_TYPES.EXPENSE,
    source: e.id && e.id.startsWith('ADJ') ? SOURCE_TYPES.STRIPE : SOURCE_TYPES.QUICKBOOKS,
  }));

  const adjustmentLineItems = adjustments.map((adj: any) => ({
    id: adj.id,
    date: adj.date,
    description: adj.description,
    category: 'Manual Adjustment',
    amount: Math.abs(Number(adj.amount || 0)),
    type: Number(adj.amount || 0) >= 0 ? LINE_ITEM_TYPES.INCOME : LINE_ITEM_TYPES.EXPENSE,
    source: SOURCE_TYPES.MANUAL_ADJUSTMENT,
  }));

  const lineItems = [
    ...reservationLineItems,
    ...cleaningLineItems,
    ...mgmtFeeLineItem,
    ...expenseLineItems,
    ...adjustmentLineItems,
  ];

  return {
    id: rawSnapshot?.id || `${property.id}_${year}_${month}`,
    propertyId: property.id,
    propertyName: property.propertyName,
    ownerName: property.ownerName,
    avatarInitials: getPropertyInitials(property.propertyName),
    monthYear: monthYearString,
    year: Number(year),
    month: Number(month),
    status: rawSnapshot?.status ?? STATEMENT_STATUSES.NOT_GENERATED,
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
    quickbooksSync: rawSnapshot?.quickbooksSync ?? {
      syncStatus: 'Synced',
      journalEntryId: `JE-${year}-${property.id}`,
      lastSyncedAt: `${year}-${month}-03 11:45:00`,
    },
    stripePayout: rawSnapshot?.stripePayout ?? {
      transferId: `tr_prop_${property.id}`,
      payoutStatus: 'Processing',
      destinationAccount: `ba_acc_${property.id}`,
    },
  };
}