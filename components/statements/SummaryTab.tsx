// components/statements/SummaryTab.tsx
import { PropertyStatement } from '@/types/statement';
import { StatementCard } from './ui/StatementCard';

type SummaryTabProps = {
  statement: PropertyStatement;
};

export default function SummaryTab({ statement }: SummaryTabProps) {
  const totalTotalPrice = statement.reservations.reduce((acc, res) => acc + res.totalPrice, 0);
  const totalCleaningFee = statement.reservations.reduce((acc, res) => acc + res.cleaningFee, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Statement Summary Card */}
      <StatementCard title="Statement Summary">
        <div className="p-5">
          <dl className="space-y-3.5 text-xs">
            <div className="flex justify-between">
              <dt className="text-gray-500">Base Rental Income</dt>
              <dd className="font-medium text-gray-900">${statement.baseRentalIncome.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Total Commission (20% excl. cleaning)</dt>
              <dd className="font-medium text-red-600">-${statement.mgmtFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Cleaning Fees</dt>
              <dd className="font-medium text-emerald-700">+${statement.cleaningFees.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Total Expenses</dt>
              <dd className="font-medium text-gray-900">${statement.totalExpenses.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between pt-3.5 border-t border-gray-100">
              <dt className="font-bold text-gray-900 text-sm">Total Client Payout</dt>
              <dd className="font-bold text-blue-700 text-sm">${statement.totalPayout.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </StatementCard>

      {/* Occupancy Card */}
      <StatementCard title="Occupancy Metrics">
        <div className="p-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500">Occupancy Rate</span>
              <span className="font-semibold text-gray-900">{statement.occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${statement.occupancyRate}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="text-center p-3 bg-gray-50/75 rounded-lg border border-gray-100">
              <p className="text-base font-bold text-gray-900">{statement.occupiedNights}</p>
              <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Occupied</p>
            </div>
            <div className="text-center p-3 bg-gray-50/75 rounded-lg border border-gray-100">
              <p className="text-base font-bold text-gray-900">{statement.totalNights}</p>
              <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Total Days</p>
            </div>
            <div className="text-center p-3 bg-gray-50/75 rounded-lg border border-gray-100">
              <p className="text-base font-bold text-gray-900">${statement.avgDailyRate.toFixed(2)}</p>
              <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Avg Rate</p>
            </div>
          </div>
        </div>
      </StatementCard>

      {/* Reservations Table */}
      <div className="lg:col-span-2">
        <StatementCard title="Reservations Breakdown">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Channel</th>
                  <th className="px-5 py-3 text-left">From</th>
                  <th className="px-5 py-3 text-left">To</th>
                  <th className="px-5 py-3 text-center">Nights</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Total Price</th>
                  <th className="px-5 py-3 text-right">Cleaning Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statement.reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3 font-mono text-gray-500">{res.id}</td>
                    <td className="px-5 py-3 text-gray-700">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase bg-rose-50 text-rose-700">
                        {res.channel}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{res.from}</td>
                    <td className="px-5 py-3 text-gray-600">{res.to}</td>
                    <td className="px-5 py-3 text-center text-gray-600">{res.nights}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700">
                        {res.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">${res.totalPrice.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right text-gray-600">${res.cleaningFee.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
                  <td colSpan={6} className="px-5 py-3 text-right">Total</td>
                  <td className="px-5 py-3 text-right">${totalTotalPrice.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right">${totalCleaningFee.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </StatementCard>
      </div>
    </div>
  );
}