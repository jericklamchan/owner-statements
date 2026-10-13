import { PropertyItem } from '@/types/dashboard';

export const DUMMY_PROPERTIES: PropertyItem[] = [
  {
    id: '1',
    propertyName: 'Sample Mountain Cabin',
    ownerName: 'John Doe',
    avatarInitials: 'SM',
    status: 'not_generated',
    date: null,
    ownerPayout: null,
    commission: null,
    year: 2026,
    month: 9, // September
  },
  {
    id: '2',
    propertyName: 'Downtown Luxury Suite',
    ownerName: 'Jane Smith',
    avatarInitials: 'DL',
    status: 'published',
    date: 'Sep 12, 2026',
    ownerPayout: 2450.00,
    commission: 450.00,
    year: 2026,
    month: 9,
  },
  {
    id: '3',
    propertyName: 'Seaside Villa',
    ownerName: 'Michael Brown',
    avatarInitials: 'SV',
    status: 'draft',
    date: 'Sep 14, 2026',
    ownerPayout: 1800.00,
    commission: 320.00,
    year: 2026,
    month: 9,
  },
];