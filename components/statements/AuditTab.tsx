'use client';

import { PropertyStatement } from '@/types/statement';
import StatementSection from '@/components/statements/StatementSection';
import { CHANNELS } from '@/src/constants';

type AuditTabProps = {
  statement?: PropertyStatement;
};

export default function AuditTab({ statement }: AuditTabProps) {
  const reservations = statement?.reservations ?? [];
  const allExpenses = statement?.expenses ?? [];
  
  // Filter unified expenses into Stripe and QBO categories
  const stripeCharges = allExpenses.filter((e: any) => e.source === 'Stripe' || (e.id && e.id.startsWith('ADJ')));
  const qboExpenses = allExpenses.filter((e: any) => e.source === 'QuickBooks' || (!e.id?.startsWith('ADJ') && e.source !== 'Stripe'));

  const hasReservations = reservations.length > 0;
  const hasStripeCharges = stripeCharges.length > 0;
  const hasQboExpenses = qboExpenses.length > 0;

  // Calculate totals safely with explicit types
  const totalBaseRate = reservations.reduce((sum: number, res: any) => sum + (res.totalPrice - res.cleaningFee), 0);
  const totalCleaningFee = reservations.reduce((sum: number, res: any) => sum + res.cleaningFee, 0);
  const totalLodgingTax = reservations.length * 75.00;
  const totalStripeFees = stripeCharges.reduce((sum: number, charge: any) => sum + Number(charge.amount || 0), 0);
  const totalPaid = (reservations.reduce((sum: number, res: any) => sum + res.totalPrice, 0)) + totalLodgingTax;
  const totalActualIncome = (reservations.reduce((sum: number, res: any) => sum + res.totalPrice, 0)) - totalStripeFees;

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
              <th className="px-5 py-3 text-left">Channel</th>
              <th className="px-5 py-3 text-right">Base Rate</th>
              <th className="px-5 py-3 text-right">Cleaning Fee</th>
              <th className="px-5 py-3 text-center">Host Channel Fee</th>
              <th className="px-5 py-3 text-center">Stripe Fees</th>
              <th className="px-5 py-3 text-right">Lodging Tax</th>
              <th className="px-5 py-3 text-right">Total Paid</th>
              <th className="px-5 py-3 text-right">Actual Income</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.map((res: any) => {
              const isVrbo = res.channel.toLowerCase() === CHANNELS.VRBO.toLowerCase();
              const baseRate = res.totalPrice - res.cleaningFee;
              const lodgingTax = 75.00;
              const stripeFeeRow = isVrbo ? 15.00 : 0;
              const totalPaidRow = res.totalPrice + lodgingTax;
              const actualIncomeRow = res.totalPrice - stripeFeeRow;

              return (
                <tr key={res.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3 font-mono text-gray-500">{res.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{res.channel}</td>
                  <td className="px-5 py-3 text-right text-gray-700">${baseRate.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-gray-700">${res.cleaningFee.toFixed(2)}</td>
                  <td className="px-5 py-3 text-center text-gray-300">&mdash;</td>
                  <td className="px-5 py-3 text-center text-gray-700">
                    {isVrbo ? `$${stripeFeeRow.toFixed(2)}` : <span className="text-gray-300">&mdash;</span>}
                  </td>
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
              <td className="px-5 py-3 text-right">${totalCleaningFee.toFixed(2)}</td>
              <td className="px-5 py-3 text-center text-gray-400">&mdash;</td>
              <td className="px-5 py-3 text-center text-gray-700">${totalStripeFees.toFixed(2)}</td>
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
        isEmpty={!hasStripeCharges}
        emptyMessage="No Stripe charges matched for this period"
      >
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
              <th className="px-5 py-3 text-left">Charge ID</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Description</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stripeCharges.map((charge: any) => (
              <tr key={charge.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-5 py-3 font-mono text-gray-500">{charge.id}</td>
                <td className="px-5 py-3 text-gray-700 uppercase font-medium">{charge.type || 'Charge'}</td>
                <td className="px-5 py-3 text-gray-600">{charge.description}</td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">${Number(charge.amount || 0).toFixed(2)}</td>
                <td className="px-5 py-3 text-gray-600">{charge.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StatementSection>

      {/* QBO Expenses Card */}
      <StatementSection
        title="QBO Expenses"
        isEmpty={!hasQboExpenses}
        emptyMessage="No expense line data for this period"
      >
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-left">Memo</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {qboExpenses.map((expense: any) => (
              <tr key={expense.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-5 py-3 text-gray-600">{expense.date}</td>
                <td className="px-5 py-3 text-gray-700 font-medium">{expense.category}</td>
                <td className="px-5 py-3 text-gray-600">{expense.description || expense.vendor}</td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">${Number(expense.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StatementSection>
    </div>
  );
}