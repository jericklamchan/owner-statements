export const STATEMENT_STATUSES = {
  NOT_GENERATED: 'not_generated',
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

export const CHANNELS = {
  AIRBNB: 'Airbnb',
  VRBO: 'Vrbo',
  DIRECT: 'Direct',
} as const;

export const RESERVATION_STATUSES = {
  NEW: 'new',
  MODIFIED: 'modified',
  CANCELLED: 'cancelled',
  CONFIRMED: 'confirmed',
} as const;

export const SOURCE_TYPES = {
  HOSTAWAY: 'Hostaway',
  QUICKBOOKS: 'QuickBooks',
  STRIPE: 'Stripe',
  INTERNAL_SYSTEM: 'Internal System',
  MANUAL_ADJUSTMENT: 'Manual Adjustment',
} as const;

export const LINE_ITEM_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

// Derived Union Types
export type StatementStatus = typeof STATEMENT_STATUSES[keyof typeof STATEMENT_STATUSES];
export type Channel = typeof CHANNELS[keyof typeof CHANNELS];
export type ReservationStatus = typeof RESERVATION_STATUSES[keyof typeof RESERVATION_STATUSES];
export type DataSource = typeof SOURCE_TYPES[keyof typeof SOURCE_TYPES];
export type LineItemType = typeof LINE_ITEM_TYPES[keyof typeof LINE_ITEM_TYPES];