// data/statementData.ts
import { PropertyStatement } from '@/types/statement';

export const MOCK_STATEMENTS: Record<string, PropertyStatement> = {
  '1': {
    id: '1',
    propertyName: 'Sample Mountain Cabin',
    ownerName: 'John Doe',
    monthYear: 'September 2026',
    status: 'Not Generated',
    totalPayout: 2424.40,
    grossRevenue: 2943.00,
    mgmtFee: 518.60,
    totalExpenses: 0.00,
    baseRentalIncome: 2593.00,
    cleaningFees: 350.00,
    occupancyRate: 0,
    occupiedNights: 0,
    totalNights: 30,
    avgDailyRate: 0.00,
    reservations: [
      {
        id: '1001',
        channel: 'Airbnb',
        from: '8/1/2026',
        to: '8/5/2026',
        nights: 4,
        status: 'new',
        totalPrice: 1070.00,
        cleaningFee: 150.00,
      },
      {
        id: '1002',
        channel: 'VRBO',
        from: '8/8/2026',
        to: '8/12/2026',
        nights: 4,
        status: 'modified',
        totalPrice: 1523.00,
        cleaningFee: 200.00,
      },
    ],
    expenses: [],
  },
};