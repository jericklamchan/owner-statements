'use client';

import { PropertyStatement } from '@/types/statement';
import StatementSection from '@/components/ui/StatementSection';

export default function StatementSummaryCard({ statement }: { statement: PropertyStatement }) {
  const stripeFeesTotal = statement.stripeCharges?.reduce((acc, charge) => acc + charge.amount, 0) || 0;
  const hasStripeFees = stripeFeesTotal > 0;
  const regularExpenses = statement.totalExpenses - stripeFeesTotal;
  const totalAdjustments = statement.totalAdjustments || 0;
  const hasAdjustments = statement.adjustments && statement.adjustments.length > 0;

  return (
    <StatementSection title="Statement Summary">
      <div className="p-5">
        <dl className="space-y-3.5 text-xs">
          <div className="flex justify-between">
            <dt className="text-gray-500">Base Rental Income</dt>
            <dd className="font-medium text-gray-900">${statement.baseRentalIncome.toFixed(2)}</dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-500">Total Commission (18% excl. cleaning)</dt>
            <dd className="font-medium text-red-600">-${statement.mgmtFee.toFixed(2)}</dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-500">Cleaning Fees</dt>
            <dd className="font-medium text-emerald-700">+${statement.cleaningFees.toFixed(2)}</dd>
          </div>

          {hasStripeFees && (
            <div className="flex justify-between">
              <dt className="text-gray-500 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Stripe Payout Fees
              </dt>
              <dd className="font-medium text-red-600">-${stripeFeesTotal.toFixed(2)}</dd>
            </div>
          )}

          <div className="flex justify-between">
            <dt className="text-gray-500">Other Expenses (QuickBooks)</dt>
            <dd className="font-medium text-red-600">-${regularExpenses.toFixed(2)}</dd>
          </div>

          {(totalAdjustments !== 0 || hasAdjustments) && (
            <div className="flex justify-between border-t border-dashed border-gray-200 pt-2.5">
              <dt className="text-gray-500">Adjustments</dt>
              <dd className={`font-medium ${totalAdjustments >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {totalAdjustments >= 0 ? `+$${totalAdjustments.toFixed(2)}` : `-$${Math.abs(totalAdjustments).toFixed(2)}`}
              </dd>
            </div>
          )}

          <div className="flex justify-between pt-3.5 border-t border-gray-100">
            <dt className="font-bold text-gray-900 text-sm">Total Client Payout</dt>
            <dd className="font-bold text-blue-700 text-sm">${statement.totalPayout.toFixed(2)}</dd>
          </div>
        </dl>
      </div>
    </StatementSection>
  );
}