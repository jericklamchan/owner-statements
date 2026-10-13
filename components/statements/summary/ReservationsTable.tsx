'use client';

import { PropertyStatement } from '@/types/statement';
import StatementSection from '@/components/statements/StatementSection';

export default function ReservationsTable({ reservations }: { reservations: PropertyStatement['reservations'] }) {
  const hasReservations = reservations.length > 0;
  const totalTotalPrice = reservations.reduce((acc, res) => acc + res.totalPrice, 0);
  const totalCleaningFee = reservations.reduce((acc, res) => acc + res.cleaningFee, 0);

  return (
    <StatementSection
      title="Reservations Breakdown"
      isEmpty={!hasReservations}
      emptyMessage="No reservations found for this period."
    >
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
          {reservations.map((res) => {
            const isVrbo = res.channel.toLowerCase() === 'vrbo';
            const isAirbnb = res.channel.toLowerCase() === 'airbnb';

            return (
              <tr key={res.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-5 py-3 font-mono text-gray-500">{res.id}</td>
                <td className="px-5 py-3 text-gray-700">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      isVrbo
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : isAirbnb
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
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
            );
          })}
        </tbody>
        {hasReservations && (
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
              <td colSpan={6} className="px-5 py-3 text-right">Total</td>
              <td className="px-5 py-3 text-right">${totalTotalPrice.toFixed(2)}</td>
              <td className="px-5 py-3 text-right">${totalCleaningFee.toFixed(2)}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </StatementSection>
  );
}