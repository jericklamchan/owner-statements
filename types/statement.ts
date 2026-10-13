export type ReservationItem = {
  id: string;
  channel: 'Airbnb' | 'VRBO' | 'Direct';
  from: string;
  to: string;
  nights: number;
  status: 'new' | 'modified' | 'cancelled';
  totalPrice: number;
  cleaningFee: number;
  channelFee?: number;
  stripeFee?: number;
};

export type ExpenseItem = {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
};

export type PropertyStatement = {
  id: string;
  propertyName: string;
  ownerName: string;
  monthYear: string;
  status: 'Not Generated' | 'Draft' | 'Published';
  totalPayout: number;
  grossRevenue: number;
  mgmtFee: number;
  totalExpenses: number;
  baseRentalIncome: number;
  cleaningFees: number;
  occupancyRate: number;
  occupiedNights: number;
  totalNights: number;
  avgDailyRate: number;
  reservations: ReservationItem[];
  expenses: ExpenseItem[];
  apiError?: string;
};