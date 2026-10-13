export type ReservationItem = {
  id: string;
  channel: 'Airbnb' | 'Vrbo' | 'VRBO' | 'Direct';
  from: string;
  to: string;
  nights: number;
  status: 'new' | 'modified' | 'cancelled' | 'Confirmed';
  totalPrice: number;
  cleaningFee: number;
  channelFee?: number;
  stripeFee?: number;
};

export type ExpenseItem = {
  id: string;
  date: string;
  description?: string;
  vendor?: string;
  category: string;
  amount: number;
  type?: 'expense';
  source?: 'QuickBooks' | 'Stripe' | 'Internal System';
};

export type StatementAdjustment = {
  id: string;
  date: string;
  description: string;
  amount: number; // positive for addition, negative for deduction
};

export type LineItem = {
  id: string;
  date: string;
  description: string;
  category: string;
  source: 'Hostaway' | 'QuickBooks' | 'Stripe' | 'Internal System' | 'Manual Adjustment';
  amount: number;
  type: 'income' | 'expense';
};

export type QuickbooksSyncInfo = {
  syncStatus: string;
  journalEntryId: string;
  lastSyncedAt: string;
};

export type StripePayoutInfo = {
  transferId: string;
  payoutStatus: string;
  destinationAccount: string;
};

export type PropertyStatement = {
  id: string;
  propertyId: string;
  propertyName: string;
  ownerName: string;
  avatarInitials?: string;
  monthYear: string;
  year: number;
  month: number;
  status: 'not_generated' | 'draft' | 'published';
  totalPayout: number;
  grossRevenue: number;
  mgmtFee: number;
  totalExpenses: number;
  totalAdjustments?: number;
  baseRentalIncome: number;
  cleaningFees: number;
  occupancyRate: number;
  occupiedNights: number;
  totalNights: number;
  avgDailyRate: number;
  reservations: ReservationItem[];
  expenses: ExpenseItem[];
  adjustments?: StatementAdjustment[];
  qboExpenses?: ExpenseItem[];
  stripeCharges?: ExpenseItem[];
  lineItems?: LineItem[];
  quickbooksSync?: QuickbooksSyncInfo;
  stripePayout?: StripePayoutInfo;
  apiError?: string;
};