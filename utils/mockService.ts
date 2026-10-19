export interface HostawayReservation {
  id: string;
  channel: string;
  totalPrice: number;
  cleaningFee: number;
  nights: number;
  from: string;
  to: string;
  status: string;
}

export interface QuickBooksExpense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

export interface StripeAdjustment {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
}

// Map reservations by Hostaway Property ID (e.g., 'HW-10842')
const hostawayReservationsMap: Record<string, HostawayReservation[]> = {
  'HW-10842': [
    { id: 'RES-94812', channel: 'Airbnb', totalPrice: 1200.00, cleaningFee: 150.00, nights: 4, from: '2026-10-01', to: '2026-10-05', status: 'Confirmed' }
  ],
  'HW-10845': [
    { id: 'RES-84925', channel: 'Vrbo', totalPrice: 1800.00, cleaningFee: 200.00, nights: 6, from: '2026-10-10', to: '2026-10-16', status: 'Confirmed' },
  { id: 'RES-84926', channel: 'Airbnb', totalPrice: 950.00, cleaningFee: 120.00, nights: 3, from: '2026-10-20', to: '2026-10-23', status: 'Confirmed' },
  { id: 'RES-84927', channel: 'Direct', totalPrice: 620.00, cleaningFee: 100.00, nights: 2, from: '2026-10-01', to: '2026-10-03', status: 'Confirmed' },
  { id: 'RES-84928', channel: 'Airbnb', totalPrice: 1250.00, cleaningFee: 150.00, nights: 4, from: '2026-10-05', to: '2026-10-09', status: 'Confirmed' },
  { id: 'RES-84929', channel: 'Airbnb', totalPrice: 1100.00, cleaningFee: 120.00, nights: 3, from: '2026-10-16', to: '2026-10-19', status: 'Confirmed' },
  { id: 'RES-84930', channel: 'Vrbo', totalPrice: 2100.00, cleaningFee: 200.00, nights: 7, from: '2026-10-24', to: '2026-10-31', status: 'Confirmed' }
  ]
};

// Map expenses by QuickBooks Class Name (e.g., 'Property: Mountain Cabin')
const qboExpensesMap: Record<string, QuickBooksExpense[]> = {
  'SMC-BAG': [
    { id: 'EXP-01', date: '2026-10-03', description: 'Plumbing repair', category: 'Maintenance', amount: 150.00 }
  ],
  'SBV-MLB': [
    { id: 'EXP-02', date: '2026-10-04', description: 'HVAC filter replacement', category: 'Maintenance', amount: 85.00 }
  ]
};

// Map Stripe adjustments by Hostaway or QBO identifier
const stripeAdjustmentsMap: Record<string, StripeAdjustment[]> = {
  'HW-10842': [],
  'HW-10845': [
    { id: 'ADJ-101', type: 'payout_fee', description: 'VRBO instant payout transfer fee', amount: 15.00, date: '2026-10-06' }
  ]
};

export function getHostawayReservationsByHostawayId(hostawayId: string): HostawayReservation[] {
  return hostawayReservationsMap[hostawayId] || [];
}

export function getQuickBooksExpensesByClass(qboClassName: string): QuickBooksExpense[] {
  return qboExpensesMap[qboClassName] || [];
}

export function getStripeAdjustmentsByHostawayId(hostawayId: string): StripeAdjustment[] {
  return stripeAdjustmentsMap[hostawayId] || [];
}