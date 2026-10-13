export interface PropertyItem {
  id: string;
  propertyName: string;
  ownerName: string;
  avatarInitials: string;
  status: 'not_generated' | 'draft' | 'published';
  date: string | null;
  ownerPayout: number | null;
  commission: number | null;
  year: number;
  month: number;
}