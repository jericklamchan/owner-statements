'use client';

import { useState } from 'react';
import { StatementAdjustment } from '@/types/statement';
import StatementSection from '@/components/statements/StatementSection';

type AdjustmentsSectionProps = {
  adjustments?: StatementAdjustment[];
  onUpdateAdjustments: (adjustments: StatementAdjustment[]) => void;
  isDraft: boolean;
};

export default function AdjustmentsSection({
  adjustments = [],
  onUpdateAdjustments,
  isDraft,
}: AdjustmentsSectionProps) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const hasAdjustments = adjustments && adjustments.length > 0;
  const totalAdjustments = hasAdjustments
    ? adjustments.reduce((acc, item) => acc + (item.amount || 0), 0)
    : 0;

  const handleAdd = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!desc.trim() || !amount || isNaN(Number(amount))) return;

    const newAdj: StatementAdjustment = {
      id: `adj-${Date.now()}`,
      date,
      description: desc.trim(),
      amount: parseFloat(amount),
    };

    onUpdateAdjustments([...adjustments, newAdj]);
    setDesc('');
    setAmount('');
  };

  const handleRemove = (id: string) => {
    onUpdateAdjustments(adjustments.filter((a) => a.id !== id));
  };

  return (
    <StatementSection
      title="Adjustments"
      isEmpty={!hasAdjustments && !isDraft}
      emptyMessage="No adjustments added for this period."
    >
      {/* Entry form only renders when in draft mode */}
      {isDraft && (
        <div className="p-5 pb-0 space-y-3">
          <p className="text-xs text-gray-500">
            Add manual additions (+) or deductions (-) to this month's owner payout calculation.
          </p>

          <form
            onSubmit={handleAdd}
            className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Description (e.g., Early check-in fee)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount (+ or -)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full sm:w-36 px-3 py-2 border border-gray-300 rounded-md text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          </form>
        </div>
      )}

      {hasAdjustments && (
        <div className={isDraft ? 'mt-4' : ''}>
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Description</th>
                <th className="px-5 py-3 text-right">Amount</th>
                {isDraft && <th className="px-5 py-3 text-center w-12">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {adjustments.map((adj) => (
                <tr key={adj.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3 font-mono text-gray-500">{adj.date}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{adj.description}</td>
                  <td
                    className={`px-5 py-3 text-right font-medium ${
                      adj.amount >= 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {adj.amount >= 0 ? `+$${adj.amount.toFixed(2)}` : `-$${Math.abs(adj.amount).toFixed(2)}`}
                  </td>
                  {isDraft && (
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(adj.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove Adjustment"
                      >
                        <svg
                          className="w-3.5 h-3.5 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
                <td colSpan={2} className="px-5 py-3 text-right">Total</td>
                <td
                  className={`px-5 py-3 text-right ${
                    totalAdjustments >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {totalAdjustments >= 0 ? `+$${totalAdjustments.toFixed(2)}` : `-$${Math.abs(totalAdjustments).toFixed(2)}`}
                </td>
                {isDraft && <td className="px-5 py-3"></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </StatementSection>
  );
}