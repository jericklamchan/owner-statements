'use client';

import { LineItem } from '@/types/statement';
import StatementSection from '@/components/statements/StatementSection';
import { LINE_ITEM_TYPES, SOURCE_TYPES } from '@/src/constants';

type LineItemsTabProps = {
  lineItems?: LineItem[];
};

export default function LineItemsTab({ lineItems = [] }: LineItemsTabProps) {
  // Separate items into Income vs. Deductions (including manual adjustments)
  const rentalItems = lineItems.filter(
    (item) =>
      item.category === 'Rental Income' ||
      item.category === 'Cleaning Fee' ||
      (item.category === 'Manual Adjustment' && item.type === LINE_ITEM_TYPES.INCOME)
  );

  const feeItems = lineItems.filter(
    (item) =>
      (item.category !== 'Rental Income' &&
        item.category !== 'Cleaning Fee' &&
        item.category !== 'Manual Adjustment') ||
      (item.category === 'Manual Adjustment' && item.type === LINE_ITEM_TYPES.EXPENSE)
  );

  const rentalTotal = rentalItems.reduce((acc, item) => acc + item.amount, 0);
  const feeTotal = feeItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Rental Income & Additions Section */}
      <StatementSection title="Rental Income & Additions">
        <table className="w-full text-xs table-fixed">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
              <th className="w-1/2 px-5 py-3 text-left">Description</th>
              <th className="w-1/4 px-5 py-3 text-left">Type</th>
              <th className="w-1/4 px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rentalItems.map((item, index) => {
              const isAdjustment = item.category === 'Manual Adjustment';
              const isCleaning = item.category === 'Cleaning Fee';

              return (
                <tr key={item.id || index} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900 truncate">
                    {item.description}
                    <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                      Date: {item.date} &middot; Source: {item.source}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        isAdjustment
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : isCleaning
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {isAdjustment ? 'Adjustment' : isCleaning ? 'Cleaning' : 'Rental'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-emerald-700">
                    +${item.amount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
              <td colSpan={2} className="px-5 py-3 text-right">Total Income</td>
              <td className="px-5 py-3 text-right text-emerald-700">${rentalTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </StatementSection>

      {/* Fees & Deductions Section */}
      <StatementSection
        title="Fees & Deductions"
        isEmpty={feeItems.length === 0}
        emptyMessage="No fee deductions recorded for this period."
      >
        <table className="w-full text-xs table-fixed">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
              <th className="w-1/2 px-5 py-3 text-left">Description</th>
              <th className="w-1/4 px-5 py-3 text-left">Type</th>
              <th className="w-1/4 px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feeItems.map((item, index) => {
              const isStripe = item.source === SOURCE_TYPES.STRIPE;
              const isMgmt = item.category === 'Management Fee';
              const isAdjustment = item.category === 'Manual Adjustment';

              return (
                <tr key={item.id || index} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900 truncate">
                    {item.description}
                    <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                      {item.date ? `Date: ${item.date} · ` : ''}Source: {item.source}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        isAdjustment
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : isStripe
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : isMgmt
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-red-600">
                    -${Math.abs(item.amount).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {feeItems.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
                <td colSpan={2} className="px-5 py-3 text-right">Total Deductions</td>
                <td className="px-5 py-3 text-right text-red-600">
                  -${Math.abs(feeTotal).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </StatementSection>
    </div>
  );
}