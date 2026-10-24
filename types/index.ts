import { StatementStatus } from '@/src/constants';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export type PropertyPolicy = {
  commissionRate?: number;
  includeCleaningInCommission?: boolean;
  cleaningHandling?: string;
  otaFees?: string;
  ccFees?: string;
  taxes?: string;
  expenseReimbursement?: string;
  includeBills?: boolean;
  excludedCategories?: string[];
  additionalFees?: Array<{ name: string; amount: string }>;
  dateBasis?: string;
  includeOccupancy?: boolean;
  statementNote?: string;
};

export interface PropertyRecord {
  id: string;
  propertyName: string;
  ownerName: string;
  avatarInitials?: string;
  address?: string;
  city?: string;
  country?: string;
  hostaway_id: string;      
  qbo_class_name: string;   
  status?: StatementStatus;
  date?: string | null;
  ownerPayout?: number | null;
  commission?: number | null;
  policy?: PropertyPolicy; // <--- Add this
}

export interface AdditionalFee {
  name: string;
  amount: string;
}