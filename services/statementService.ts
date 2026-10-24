import { getCollection, readDb, writeDb } from '@/utils/store';
import { 
  getHostawayReservationsByHostawayId, 
  getQuickBooksExpensesByClass, 
  getStripeAdjustmentsByHostawayId 
} from '@/utils/mockService';
import { 
  MONTHS, 
  YEARS,
  Year, 
  MonthValue, 
  CHANNELS, 
  STATEMENT_STATUSES, 
  StatementStatus
} from '@/src/constants';
import { normalizeStatementSnapshot } from './statementMapper';
import { ReservationItem, ExpenseItem } from '@/types/statement';

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
  status?: StatementStatus | string;
  adjustments?: StatementAdjustment[];
  year?: Year | string;
  month?: MonthValue | string;
}

/**
 * Core domain service to generate or retrieve an aggregated statement snapshot.
 */
export function getOrComputeStatement(options: StatementOptions) {
  const defaultYear = String(YEARS[0] || 2026);
  const defaultMonth = String(MONTHS.find((m) => m.value === 10)?.value || 10);

  const { propertyId, year = defaultYear, month = defaultMonth } = options;
  const snapshotKey = `${propertyId}_${year}_${month}`;

  const properties = getCollection('properties');
  const property = properties.find((p) => p.id === propertyId);

  if (!property) {
    return { error: 'Property not found', status: 404 };
  }

  const db = readDb();
  const statementsCache = db.statements || {};
  const savedSnapshot = statementsCache[snapshotKey];

  const targetYear = parseInt(String(year), 10);
  const targetMonth = parseInt(String(month), 10);

  // 1. Always fetch all raw source items from mock storage
  const allReservations = getHostawayReservationsByHostawayId(property.hostaway_id) as ReservationItem[];
  const allQboExpenses = getQuickBooksExpensesByClass(property.qbo_class_name) as ExpenseItem[];
  const allStripeCharges = getStripeAdjustmentsByHostawayId(property.hostaway_id) as ExpenseItem[];

  // 2. Filter reservations strictly by date-range overlap for the target month/year
  const reservations = allReservations.filter((r: ReservationItem & { checkIn?: string; arrivalDate?: string; date?: string; checkOut?: string; departureDate?: string }) => {
    // Target 'from' and 'to' (used by Hostaway mapper) with fallbacks for alternative naming
    const startStr = r.from || r.checkIn || r.arrivalDate || r.date;
    const endStr = r.to || r.checkOut || r.departureDate || startStr;

    // Strict check: reject items without date fields rather than letting them pass
    if (!startStr) return false;

    const startDate = new Date(startStr);
    const endDate = endStr ? new Date(endStr) : startDate;

    const monthStart = new Date(targetYear, targetMonth - 1, 1);
    const monthEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    return startDate <= monthEnd && endDate >= monthStart;
  });

  // 3. Filter expenses strictly by target month/year
  const qboExpenses = allQboExpenses.filter((e: ExpenseItem & { createdAt?: string }) => {
    const dateStr = e.date || e.createdAt;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getFullYear() === targetYear && (d.getMonth() + 1) === targetMonth;
  });

  const stripeCharges = allStripeCharges.filter((e: ExpenseItem & { createdAt?: string }) => {
    const dateStr = e.date || e.createdAt;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getFullYear() === targetYear && (d.getMonth() + 1) === targetMonth;
  });

  const hasVrboBooking = reservations.some(
    (r: ReservationItem) => r.channel && r.channel.toLowerCase() === CHANNELS.VRBO.toLowerCase()
  );
  const activeStripeCharges = hasVrboBooking ? stripeCharges : [];

  // 4. Construct rawData preserving user status & manual adjustments if previously saved
  const rawData = {
    id: snapshotKey,
    status: savedSnapshot?.status || STATEMENT_STATUSES.NOT_GENERATED,
    reservations,
    expenses: [...qboExpenses, ...activeStripeCharges],
    adjustments: savedSnapshot?.adjustments || [],
  };

  const monthObj = MONTHS.find((m) => m.value === targetMonth);
  const monthName = monthObj ? monthObj.label : 'October';
  const monthYear = `${monthName} ${year}`;

  const statement = normalizeStatementSnapshot(rawData, property, year, month, monthYear);

  return { statement, snapshotKey };
}

/**
 * Updates and persists a statement snapshot in the database.
 */
export function updateAndSaveStatement(propertyId: string, payload: StatementPatchPayload) {
  const defaultYear = String(YEARS[0] || 2026);
  const defaultMonth = String(MONTHS.find((m) => m.value === 10)?.value || 10);

  const { status, adjustments, year = defaultYear, month = defaultMonth } = payload;
  
  const result = getOrComputeStatement({ propertyId, year, month });
  if ('error' in result) {
    return result;
  }

  const { statement, snapshotKey } = result;
  
  const currentAdjustments = adjustments !== undefined ? adjustments : statement.adjustments;
  const newStatus = status !== undefined ? status : statement.status;

  const db = readDb();
  if (!db.statements) db.statements = {};

  const properties = getCollection('properties');
  const property = properties.find((p) => p.id === propertyId);

  if (!property) {
    return { error: 'Property not found', status: 404 };
  }

  const updatedRaw = {
    ...statement,
    status: newStatus,
    adjustments: currentAdjustments,
  };

  const recomputedStatement = normalizeStatementSnapshot(
    updatedRaw, 
    property,
    statement.year,
    statement.month,
    statement.monthYear
  );

  db.statements[snapshotKey] = recomputedStatement;
  const success = writeDb(db);
  if (!success) {
    return { error: 'Failed to write statement snapshot to database.', status: 500 };
  }

  return { statement: recomputedStatement };
}