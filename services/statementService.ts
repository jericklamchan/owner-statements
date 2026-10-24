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
  const defaultMonth = String(MONTHS[0]?.value || 10);

  const { propertyId, year = defaultYear, month = defaultMonth } = options;
  const snapshotKey = `${propertyId}_${year}_${month}`;

  const properties = getCollection('properties');
  const property = properties.find((p: any) => p.id === propertyId);

  if (!property) {
    return { error: 'Property not found', status: 404 };
  }

  const db = readDb();
  const statementsCache = db.statements || {};
  const savedSnapshot = statementsCache[snapshotKey];

  let rawData = savedSnapshot;

  if (!rawData) {
    const reservations = getHostawayReservationsByHostawayId(property.hostaway_id);
    const hasVrboBooking = reservations.some(
      (r: any) => r.channel && r.channel.toLowerCase() === CHANNELS.VRBO.toLowerCase()
    );
    const qboExpenses = getQuickBooksExpensesByClass(property.qbo_class_name);
    const stripeCharges = hasVrboBooking ? getStripeAdjustmentsByHostawayId(property.hostaway_id) : [];

    rawData = {
      id: snapshotKey,
      status: STATEMENT_STATUSES.NOT_GENERATED,
      reservations,
      expenses: [...qboExpenses, ...stripeCharges],
      adjustments: [],
    };
  }

  const monthObj = MONTHS.find((m) => m.value === parseInt(String(month), 10));
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
  const defaultMonth = String(MONTHS[0]?.value || 10);

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

  // Build updated raw structure and re-normalize through mapper
  const updatedRaw = {
    ...statement,
    status: newStatus,
    adjustments: currentAdjustments,
  };

  const recomputedStatement = normalizeStatementSnapshot(
    updatedRaw, 
    { id: statement.propertyId, propertyName: statement.propertyName, ownerName: statement.ownerName },
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