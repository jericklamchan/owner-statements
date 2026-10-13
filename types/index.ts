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

  // Location fields
  address?: string;
  city?: string;
  country?: string;

  // Integration Mappings
  hostaway_id: string;      // e.g., "HW-10842"
  qbo_class_name: string;   // e.g., "Property: Mountain Cabin"

  // Statement status & financial indicators
  status?: 'not_generated' | 'draft' | 'published';
  date?: string | null;
  ownerPayout?: number | null;
  commission?: number | null;
}