import test from 'node:test';
import assert from 'node:assert';

// Core Financial Calculator (Refactored directly from Statement API logic)
function calculateStatementFinancials({ reservations = [], expenses = [], adjustments = [] }) {
  // 1. Base Rental Income = Total Price minus Cleaning Fee
  const baseRentalIncome = reservations.reduce(
    (acc, r) => acc + (r.totalPrice - (r.cleaningFee || 0)),
    0
  );

  // 2. Cleaning Fees Collected
  const cleaningFees = reservations.reduce(
    (acc, r) => acc + (r.cleaningFee || 0),
    0
  );

  // 3. Gross Revenue = Base Rental Income + Cleaning Fees
  const grossRevenue = baseRentalIncome + cleaningFees;

  // 4. Management Fee = 18% of Base Rental Income (rounded)
  const mgmtFee = Math.round(baseRentalIncome * 0.18);

  // 5. Operational Expenses & Manual Adjustments
  const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalAdjustments = adjustments.reduce(
    (acc, adj) => acc + Number(adj.amount || 0),
    0
  );

  // 6. Net Payout Formula: Gross Revenue - Management Fee - Expenses + Adjustments
  const totalPayout = grossRevenue - mgmtFee - totalExpenses + totalAdjustments;

  // 7. Operational Metrics
  const totalNights = 31;
  const occupiedNights = reservations.reduce((acc, r) => acc + (r.nights || 0), 0);
  const occupancyRate = Number(((occupiedNights / totalNights) * 100).toFixed(1));
  const avgDailyRate = occupiedNights > 0 ? Math.round(baseRentalIncome / occupiedNights) : 0;

  return {
    baseRentalIncome,
    cleaningFees,
    grossRevenue,
    mgmtFee,
    totalExpenses,
    totalAdjustments,
    totalPayout,
    occupancyRate,
    avgDailyRate,
  };
}

// ==========================================
// TEST SUITE: Statement Financial Engine
// ==========================================

test('1. Management Fee Rule: Applies exactly 18% on base rental income excluding cleaning fees', () => {
  const mockReservations = [
    { id: 'res-1', totalPrice: 1200, cleaningFee: 200, nights: 4 }, // Base: 1000
    { id: 'res-2', totalPrice: 2300, cleaningFee: 300, nights: 5 }, // Base: 2000
  ];

  const result = calculateStatementFinancials({ reservations: mockReservations });

  assert.strictEqual(result.baseRentalIncome, 3000, 'Base income should be 3000');
  assert.strictEqual(result.cleaningFees, 500, 'Cleaning fees should be 500');
  assert.strictEqual(result.grossRevenue, 3500, 'Gross revenue should be 3500');
  
  // 18% of 3000 = 540
  assert.strictEqual(result.mgmtFee, 540, 'Management fee must be 18% of base rental income (540)');
});

test('2. Net Payout Formula: Accurately subtracts mgmt fees & expenses, and adds positive adjustments', () => {
  const mockReservations = [{ id: 'res-1', totalPrice: 1200, cleaningFee: 200, nights: 4 }]; // Base: 1000, Gross: 1200, Mgmt: 180
  const mockExpenses = [{ id: 'exp-1', amount: 150, description: 'Plumbing Repair' }];
  const mockAdjustments = [{ id: 'adj-1', amount: 50, description: 'Utility Credit' }];

  const result = calculateStatementFinancials({
    reservations: mockReservations,
    expenses: mockExpenses,
    adjustments: mockAdjustments,
  });

  // Net Payout = 1200 (Gross) - 180 (Mgmt) - 150 (Expenses) + 50 (Adjustments) = 920
  assert.strictEqual(result.totalPayout, 920, 'Net payout must equal 920');
});

test('3. Operational Metrics: Calculates occupancy rate and ADR accurately', () => {
  const mockReservations = [
    { id: 'res-1', totalPrice: 1500, cleaningFee: 200, nights: 5 }, // Base: 1300
    { id: 'res-2', totalPrice: 1100, cleaningFee: 100, nights: 4 }, // Base: 1000
  ];

  const result = calculateStatementFinancials({ reservations: mockReservations });

  // Total occupied nights = 9 / 31 = 29.0%
  assert.strictEqual(result.occupancyRate, 29.0, 'Occupancy rate should be 29.0%');
  
  // ADR = 2300 Base / 9 nights = 256
  assert.strictEqual(result.avgDailyRate, 256, 'ADR should be 256');
});