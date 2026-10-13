// components/statements/LineItemsTab.tsx
import { LineItem } from '@/types/statement';
import { Card } from '@/components/ui/Card';

type LineItemsTabProps = {
  lineItems?: LineItem[];
};

export default function LineItemsTab({ lineItems }: LineItemsTabProps) {
  const rentalItems = lineItems?.filter(item => item.category === 'Rental Income' || item.category === 'Cleaning Fee') || [];
  const feeItems = lineItems?.filter(item => item.category !== 'Rental Income' && item.category !== 'Cleaning Fee') || [];

  const rentalTotal = rentalItems.reduce((acc, item) => acc + item.amount, 0);
  const feeTotal = feeItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Rental Income Section */}
      <Card title="Rental Income">
        <div className="overflow-x-auto">
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
                <th className="w-1/2 px-5 py-3 text-left">Description</th>
                <th className="w-1/4 px-5 py-3 text-left">Type</th>
                <th className="w-1/4 px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rentalItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900 truncate">
                    {item.description}
                    <div className="text-[11px] text-gray-400 font-normal mt-0.5">Date: {item.date} &middot; Source: {item.source}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700">
                      {item.category === 'Cleaning Fee' ? 'cleaning' : 'rental'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
                <td colSpan={2} className="px-5 py-3 text-right">Total</td>
                <td className="px-5 py-3 text-right text-emerald-700">${rentalTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Fees & Deductions Section */}
      <Card title="Fees & Deductions">
        <div className="overflow-x-auto">
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
                <th className="w-1/2 px-5 py-3 text-left">Description</th>
                <th className="w-1/4 px-5 py-3 text-left">Type</th>
                <th className="w-1/4 px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feeItems.length > 0 ? (
                feeItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 truncate">
                      {item.description}
                      <div className="text-[11px] text-gray-400 font-normal mt-0.5">Source: {item.source}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase bg-rose-50 text-rose-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-red-600">
                      {item.amount < 0 ? `-$${Math.abs(item.amount).toFixed(2)}` : `$${item.amount.toFixed(2)}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-xs text-gray-400 text-center italic">
                    No fee deductions recorded for this period.
                  </td>
                </tr>
              )}
            </tbody>
            {feeItems.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
                  <td colSpan={2} className="px-5 py-3 text-right">Total</td>
                  <td className="px-5 py-3 text-right text-red-600">
                    {feeTotal < 0 ? `-$${Math.abs(feeTotal).toFixed(2)}` : `$${feeTotal.toFixed(2)}`}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>
    </div>
  );
}