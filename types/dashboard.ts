import { StatementStatus } from '@/src/constants';

export interface PropertyItem {
  id: string;
  propertyName: string;
  ownerName: string;
  avatarInitials: string;
  status: StatementStatus;
  date: string | null;
  ownerPayout: number | null;
  commission: number | null;
  year: number;
  month: number;
}