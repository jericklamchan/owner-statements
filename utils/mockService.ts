import { 
  ReservationItem, 
  ExpenseItem, 
  StatementAdjustment 
} from '@/types/statement';
import { 
  CHANNELS, 
  RESERVATION_STATUSES, 
  SOURCE_TYPES 
} from '@/src/constants';

// Map reservations by Hostaway Property ID (e.g., 'HW-10842')
const hostawayReservationsMap: Record<string, ReservationItem[]> = {
  'HW-10842': [
    { id: 'RES-94812', channel: CHANNELS.AIRBNB, totalPrice: 1200.00, cleaningFee: 150.00, nights: 4, from: '2026-10-01', to: '2026-10-05', status: RESERVATION_STATUSES.CONFIRMED }
  ],
  'HW-10845': [
    { id: 'RES-84925', channel: CHANNELS.VRBO, totalPrice: 1800.00, cleaningFee: 200.00, nights: 6, from: '2026-10-10', to: '2026-10-16', status: RESERVATION_STATUSES.CONFIRMED },
    { id: 'RES-84926', channel: CHANNELS.AIRBNB, totalPrice: 950.00, cleaningFee: 120.00, nights: 3, from: '2026-10-20', to: '2026-10-23', status: RESERVATION_STATUSES.CONFIRMED },
    { id: 'RES-84927', channel: CHANNELS.DIRECT, totalPrice: 620.00, cleaningFee: 100.00, nights: 2, from: '2026-10-01', to: '2026-10-03', status: RESERVATION_STATUSES.CONFIRMED },
    { id: 'RES-84928', channel: CHANNELS.AIRBNB, totalPrice: 1250.00, cleaningFee: 150.00, nights: 4, from: '2026-10-05', to: '2026-10-09', status: RESERVATION_STATUSES.CONFIRMED },
    { id: 'RES-84929', channel: CHANNELS.AIRBNB, totalPrice: 1100.00, cleaningFee: 120.00, nights: 3, from: '2026-10-16', to: '2026-10-19', status: RESERVATION_STATUSES.CONFIRMED },
    { id: 'RES-84930', channel: CHANNELS.VRBO, totalPrice: 2100.00, cleaningFee: 200.00, nights: 7, from: '2026-10-24', to: '2026-10-31', status: RESERVATION_STATUSES.CONFIRMED }
  ]
};

// Map expenses by QuickBooks Class Name (e.g., 'Property: Mountain Cabin')
const qboExpensesMap: Record<string, ExpenseItem[]> = {
  'SMC-BAG': [
    { id: 'EXP-01', date: '2026-10-03', description: 'Plumbing repair', category: 'Maintenance', amount: 150.00, source: SOURCE_TYPES.QUICKBOOKS }
  ],
  'SBV-MLB': [
    { id: 'EXP-02', date: '2026-10-04', description: 'HVAC filter replacement', category: 'Maintenance', amount: 85.00, source: SOURCE_TYPES.QUICKBOOKS }
  ]
};

// Map Stripe adjustments by Hostaway or QBO identifier
const stripeAdjustmentsMap: Record<string, StatementAdjustment[]> = {
  'HW-10842': [],
  'HW-10845': [
    { id: 'ADJ-101', date: '2026-10-06', description: 'VRBO instant payout transfer fee', amount: 15.00 }
  ]
};

export function getHostawayReservationsByHostawayId(hostawayId: string): ReservationItem[] {
  return hostawayReservationsMap[hostawayId] || [];
}

export function getQuickBooksExpensesByClass(qboClassName: string): ExpenseItem[] {
  return qboExpensesMap[qboClassName] || [];
}

export function getStripeAdjustmentsByHostawayId(hostawayId: string): StatementAdjustment[] {
  return stripeAdjustmentsMap[hostawayId] || [];
}