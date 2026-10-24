import { StatementStatus, Channel, ReservationStatus, DataSource, LineItemType } from '@/src/constants';

export type ReservationItem = {
  id: string;
  channel: Channel | 'VRBO';
  from: string;
  to: string;
  nights: number;
  status: ReservationStatus;
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
  type?: LineItemType;
  source?: DataSource;
};

export type StatementAdjustment = {
  id: string;
  date: string;
  description: string;
  amount: number;
};

export type LineItem = {
  id: string;
  date: string;
  description: string;
  category: string;
  source: DataSource;
  amount: number;
  type: LineItemType;
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
  status: StatementStatus;
  totalPayout: number;
  grossRevenue: number;
  mgmtFee: number;
  totalExpenses: number;
  totalAdjustments: number;
  baseRentalIncome: number;
  cleaningFees: number;
  occupancyRate: number;
  occupiedNights: number;
  totalNights: number;
  avgDailyRate: number;
  reservations: ReservationItem[];
  expenses: ExpenseItem[];
  adjustments: StatementAdjustment[];
  lineItems: LineItem[];
  statementNote?: string;
  quickbooksSync: QuickbooksSyncInfo;
  stripePayout: StripePayoutInfo;
  apiError?: string;
  commissionRate?: number;
  includeCleaningInCommission?: boolean;
};