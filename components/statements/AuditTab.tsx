'use client';

import StatementSection from '@/components/ui/StatementSection';

type ReservationItem = {
  id: string;
  channel: string;
  totalPrice: number;
  cleaningFee: number;
};

type AuditTabProps = {
  statement?: {
    reservations?: ReservationItem[];
  };
};

export default function AuditTab({ statement }: AuditTabProps) {
  const reservations = statement?.reservations ?? [];
  const hasReservations = reservations.length > 0;

  // Calculate totals safely
  const totalBaseRate = reservations.reduce((sum, res) => sum + res.totalPrice, 0);
  const totalCleaningFee = reservations.reduce((sum, res) => sum + res.cleaningFee, 0);
  const totalLodgingTax = reservations.length * 75.00;
  const totalPaid = totalBaseRate + totalCleaningFee + totalLodgingTax;
  const totalActualIncome = totalBaseRate + totalCleaningFee;

  return (
    <div className="space-y-6">
      {/* Reservation Data Card */}
      <StatementSection
        title="Reservation Data"
        isEmpty={!hasReservations}
        emptyMessage="No reservations found for this audit period."
      >
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
              <th className="px-5 py-3 text-left">ID</th>
              <th className="px-5 py-3 text-left">Guest</th>
              <th className="px-5 py-3 text-right">Base Rate</th>
              <th className="px-5 py-3 text-right">Adj. Base Rate</th>
              <th className="px-5 py-3 text-right">Cleaning Fee</th>
              <th className="px-5 py-3 text-center">Host Channel Fee</th>
              <th className="px-5 py-3 text-center">Stripe Fees</th>
              <th className="px-5 py-3 text-right">Lodging Tax</th>
              <th className="px-5 py-3 text-right">Total Paid</th>
              <th className="px-5 py-3 text-right">Actual Income</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.map((res) => {
              const guestName = res.channel === 'Airbnb' ? 'Sarah Jenkins' : 'Michael Chang';
              const lodgingTax = 75.00;
              const totalPaidRow = res.totalPrice + res.cleaningFee + lodgingTax;
              const actualIncomeRow = res.totalPrice + res.cleaningFee;

              return (
                <tr key={res.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3 font-mono text-gray-500">{res.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{guestName}</td>
                  <td className="px-5 py-3 text-right text-gray-700">${res.totalPrice.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-gray-700">${res.totalPrice.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-gray-700">${res.cleaningFee.toFixed(2)}</td>
                  <td className="px-5 py-3 text-center text-gray-300">&mdash;</td>
                  <td className="px-5 py-3 text-center text-gray-300">&mdash;</td>
                  <td className="px-5 py-3 text-right text-gray-700">${lodgingTax.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-gray-700">${totalPaidRow.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-blue-600">${actualIncomeRow.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
              <td colSpan={2} className="px-5 py-3">Totals</td>
              <td className="px-5 py-3 text-right">${totalBaseRate.toFixed(2)}</td>
              <td className="px-5 py-3 text-right">${totalBaseRate.toFixed(2)}</td>
              <td className="px-5 py-3 text-right">${totalCleaningFee.toFixed(2)}</td>
              <td className="px-5 py-3 text-center text-gray-400">&mdash;</td>
              <td className="px-5 py-3 text-center text-gray-400">&mdash;</td>
              <td className="px-5 py-3 text-right">${totalLodgingTax.toFixed(2)}</td>
              <td className="px-5 py-3 text-right">${totalPaid.toFixed(2)}</td>
              <td className="px-5 py-3 text-right text-blue-700">${totalActualIncome.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </StatementSection>

      {/* Stripe Charges Card */}
      <StatementSection
        title="Stripe Charges"
        isEmpty={true}
        emptyMessage="No Stripe charges matched for this period"
      >
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
              <th className="px-5 py-3 text-left">Charge ID</th>
              <th className="px-5 py-3 text-left">Reservation ID</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Description</th>
              <th className="px-5 py-3 text-right">Gross</th>
              <th className="px-5 py-3 text-right">Refunded</th>
              <th className="px-5 py-3 text-right">Fee</th>
              <th className="px-5 py-3 text-right">Net</th>
              <th className="px-5 py-3 text-left">Created</th>
              <th className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody />
        </table>
      </StatementSection>

      {/* QBO Expenses Card */}
      <StatementSection
        title="QBO Expenses"
        isEmpty={true}
        emptyMessage="No expense line data for this period"
      >
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Transaction Type</th>
              <th className="px-5 py-3 text-left">Memo</th>
              <th className="px-5 py-3 text-left">Item Split Account</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody />
        </table>
      </StatementSection>
    </div>
  );
}