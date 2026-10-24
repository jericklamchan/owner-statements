import { PropertyStatement, ReservationItem, ExpenseItem, StatementAdjustment } from '@/types/statement';
import { PropertyPolicy } from '@/types';
import { STATEMENT_STATUSES, SOURCE_TYPES, LINE_ITEM_TYPES } from '@/src/constants';
import { getPropertyInitials } from '@/utils/formatters';
import { getEffectivePolicy } from '@/utils/policyUtils';

type StatementStatus = typeof STATEMENT_STATUSES[keyof typeof STATEMENT_STATUSES];

type PropertyInput = {
  id: string;
  propertyName: string;
  ownerName: string;
  policy?: PropertyPolicy;
};

export function normalizeStatementSnapshot(
  rawSnapshot: Partial<Omit<PropertyStatement, 'status'>> & { status?: string } & Record<string, unknown>, 
  property: PropertyInput,
  year: number | string,
  month: number | string,
  monthYearString: string
): PropertyStatement {
  // 1. Resolve effective policy (merging custom property policy with system defaults)
  const policy = getEffectivePolicy(property.policy);

  // Safe extractions with centralized defaults at the boundary
  const reservations: ReservationItem[] = Array.isArray(rawSnapshot?.reservations) ? (rawSnapshot.reservations as ReservationItem[]) : [];
  const rawExpenses: ExpenseItem[] = Array.isArray(rawSnapshot?.expenses) ? (rawSnapshot.expenses as ExpenseItem[]) : [];
  const adjustments: StatementAdjustment[] = Array.isArray(rawSnapshot?.adjustments) 
    ? (rawSnapshot.adjustments as StatementAdjustment[]) 
    : [];

  const baseRentalIncome = reservations.reduce(
    (acc: number, r: ReservationItem) => acc + (Number(r.totalPrice || 0) - Number(r.cleaningFee || 0)),
    0
  );
  
  const totalCleaningFeesCollected = reservations.reduce(
    (acc: number, r: ReservationItem) => acc + Number(r.cleaningFee || 0),
    0
  );

  // 2. Apply Cleaning Fee Handling Rule
  let ownerCleaningIncome = totalCleaningFeesCollected;
  if (policy.cleaningHandling === 'retained') {
    ownerCleaningIncome = 0; // Manager retains 100%
  } else if (policy.cleaningHandling === 'split_50_50') {
    ownerCleaningIncome = totalCleaningFeesCollected * 0.5;
  }

  const grossRevenue = baseRentalIncome + ownerCleaningIncome;

  // 3. Compute Management Fee using Policy Commission Rate & Base
  const commissionBase = policy.includeCleaningInCommission
    ? baseRentalIncome + totalCleaningFeesCollected
    : baseRentalIncome;

  const mgmtFee = typeof rawSnapshot?.mgmtFee === 'number' 
    ? rawSnapshot.mgmtFee 
    : Math.round(commissionBase * (policy.commissionRate / 100));

  // 4. Filter Expenses (Exclude QBO Categories & Bills if disabled)
  const expenses = rawExpenses.filter((e: ExpenseItem & { type?: string }) => {
    const category = e.category || '';
    if (policy.excludedCategories.includes(category)) {
      return false;
    }
    const isBill = e.id?.startsWith('BILL');
    if (!policy.includeBills && isBill) {
      return false;
    }
    return true;
  });

  const totalExpenses = expenses.reduce((acc: number, e: ExpenseItem) => acc + Number(e.amount || 0), 0);

  // 5. Calculate Additional Fixed Fees from Policy
  const additionalFeesTotal = policy.additionalFees.reduce(
    (acc: number, fee) => acc + (Number(fee.amount) || 0),
    0
  );

  const totalAdjustments = adjustments.reduce((acc: number, adj: StatementAdjustment) => acc + Number(adj.amount || 0), 0);

  const totalPayout = grossRevenue - mgmtFee - totalExpenses - additionalFeesTotal + totalAdjustments;

  // 6. Occupancy Statistics (respecting includeOccupancy policy)
  const totalNights = 31;
  const occupiedNights = policy.includeOccupancy 
    ? reservations.reduce((acc: number, r: ReservationItem) => acc + Number(r.nights || 0), 0) 
    : 0;
  const occupancyRate = policy.includeOccupancy ? Number(((occupiedNights / totalNights) * 100).toFixed(1)) : 0;
  const avgDailyRate = policy.includeOccupancy && occupiedNights > 0 ? Math.round(baseRentalIncome / occupiedNights) : 0;

  // 7. Rebuild Standard UI Line Items Cleanly
  const reservationLineItems = reservations.map((r: ReservationItem) => ({
    id: r.id,
    date: policy.dateBasis === 'checkout' ? r.to : r.from,
    description: `Reservation Payout (${r.channel || 'Direct'}) - ${r.nights || 0} nights`,
    category: 'Rental Income',
    amount: Number(r.totalPrice || 0) - Number(r.cleaningFee || 0),
    type: LINE_ITEM_TYPES.INCOME,
    source: SOURCE_TYPES.HOSTAWAY,
  }));

  const cleaningLineItems = ownerCleaningIncome > 0 ? reservations.map((r: ReservationItem) => ({
    id: `${r.id}-clean`,
    date: r.from,
    description: `Cleaning Fee Collected (${policy.cleaningHandling === 'split_50_50' ? '50% Split' : 'Pass Through'})`,
    category: 'Cleaning Fee',
    amount: policy.cleaningHandling === 'split_50_50' ? Number(r.cleaningFee || 0) * 0.5 : Number(r.cleaningFee || 0),
    type: LINE_ITEM_TYPES.INCOME,
    source: SOURCE_TYPES.HOSTAWAY,
  })) : [];

  const mgmtFeeLineItem = mgmtFee > 0 ? [{
    id: `MGMT-${property.id}`,
    date: `${year}-${month}-01`,
    description: `Management Fee (${policy.commissionRate}% of ${policy.includeCleaningInCommission ? 'Gross Revenue' : 'Base Rental Income'})`,
    category: 'Management Fee',
    amount: mgmtFee,
    type: LINE_ITEM_TYPES.EXPENSE,
    source: SOURCE_TYPES.INTERNAL_SYSTEM,
  }] : [];

  const expenseLineItems = expenses.map((e: ExpenseItem) => ({
    id: e.id,
    date: e.date,
    description: e.description || 'Expense item',
    category: e.id && e.id.startsWith('ADJ') ? 'Stripe Fee' : (e.category || 'Maintenance'),
    amount: Number(e.amount || 0),
    type: LINE_ITEM_TYPES.EXPENSE,
    source: e.id && e.id.startsWith('ADJ') ? SOURCE_TYPES.STRIPE : SOURCE_TYPES.QUICKBOOKS,
  }));

  const additionalFeeLineItems = policy.additionalFees.map((fee, idx) => ({
    id: `ADD-FEE-${idx}`,
    date: `${year}-${month}-01`,
    description: fee.name,
    category: 'Additional Fee',
    amount: Number(fee.amount || 0),
    type: LINE_ITEM_TYPES.EXPENSE,
    source: SOURCE_TYPES.INTERNAL_SYSTEM,
  }));

  const adjustmentLineItems = adjustments.map((adj: StatementAdjustment) => ({
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
    ...additionalFeeLineItems,
    ...adjustmentLineItems,
  ];

  const rawStatus = rawSnapshot?.status;
  const status: StatementStatus = 
    rawStatus === STATEMENT_STATUSES.DRAFT || 
    rawStatus === STATEMENT_STATUSES.PUBLISHED || 
    rawStatus === STATEMENT_STATUSES.NOT_GENERATED 
      ? rawStatus 
      : STATEMENT_STATUSES.NOT_GENERATED;

  return {
    id: typeof rawSnapshot?.id === 'string' ? rawSnapshot.id : `${property.id}_${year}_${month}`,
    propertyId: property.id,
    propertyName: property.propertyName,
    ownerName: property.ownerName,
    avatarInitials: getPropertyInitials(property.propertyName),
    monthYear: monthYearString,
    year: Number(year),
    month: Number(month),
    status,
    baseRentalIncome,
    cleaningFees: ownerCleaningIncome,
    grossRevenue,
    mgmtFee,
    totalExpenses: totalExpenses + additionalFeesTotal,
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
    statementNote: policy.statementNote || (rawSnapshot?.statementNote as string) || '',
    quickbooksSync: rawSnapshot?.quickbooksSync ? (rawSnapshot.quickbooksSync as PropertyStatement['quickbooksSync']) : {
      syncStatus: 'Synced',
      journalEntryId: `JE-${year}-${property.id}`,
      lastSyncedAt: `${year}-${month}-03 11:45:00`,
    },
    stripePayout: rawSnapshot?.stripePayout ? (rawSnapshot.stripePayout as PropertyStatement['stripePayout']) : {
      transferId: `tr_prop_${property.id}`,
      payoutStatus: 'Processing',
      destinationAccount: `ba_acc_${property.id}`,
    },
    commissionRate: policy.commissionRate,
    includeCleaningInCommission: policy.includeCleaningInCommission
  };
}