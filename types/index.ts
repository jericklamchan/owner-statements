import { StatementStatus } from '@/src/constants';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

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
}