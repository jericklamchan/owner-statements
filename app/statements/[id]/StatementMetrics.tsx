'use client';

import { PropertyStatement } from '@/types/statement';

export default function StatementMetrics({ statement }: { statement: PropertyStatement }) {
  const totalExpensesMinusAdjustments = statement.totalExpenses - (statement.totalAdjustments || 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 border border-blue-200/80 rounded-xl shadow-2xs p-4">
        <p className="text-[11px] font-semibold text-blue-900/60 uppercase tracking-wider">Total Client Payout</p>
        <p className="text-xl font-bold tracking-tight text-blue-700 mt-1">${statement.totalPayout.toLocaleString()}</p>
      </div>
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Gross Revenue</p>
        <p className="text-lg font-bold tracking-tight text-emerald-700 mt-1">${statement.grossRevenue.toLocaleString()}</p>
      </div>
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mgmt Fee</p>
        <p className="text-lg font-bold tracking-tight text-red-600 mt-1">${statement.mgmtFee.toLocaleString()}</p>
      </div>
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Expenses & Adjustments</p>
        <p className="text-lg font-bold tracking-tight text-gray-900 mt-1">${totalExpensesMinusAdjustments.toLocaleString()}</p>
      </div>
    </div>
  );
}