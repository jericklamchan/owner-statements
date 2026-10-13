'use client';

import { PropertyStatement } from '@/types/statement';
import StatementSection from '@/components/ui/StatementSection';

export default function ExpensesTable({ expenses }: { expenses: PropertyStatement['expenses'] }) {
  const hasExpenses = expenses && expenses.length > 0;
  const totalExpenses = hasExpenses ? expenses.reduce((acc, item) => acc + (item.amount || 0), 0) : 0;

  return (
    <StatementSection
      title="Property Expenses"
      isEmpty={!hasExpenses}
      emptyMessage="No property expenses recorded for this period."
    >
      <table className="min-w-full text-xs">
        <thead>
          <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
            <th className="px-5 py-3 text-left">Date</th>
            <th className="px-5 py-3 text-left">Category</th>
            <th className="px-5 py-3 text-left">Description / Vendor</th>
            <th className="px-5 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {hasExpenses && expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="px-5 py-3 font-mono text-gray-500">{expense.date || '-'}</td>
              <td className="px-5 py-3 text-gray-700">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-700">
                  {expense.category || 'Expense'}
                </span>
              </td>
              <td className="px-5 py-3 text-gray-600">
                {expense.description || expense.vendor || '-'}
              </td>
              <td className="px-5 py-3 text-right font-medium text-red-600">
                -${Math.abs(expense.amount || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        {hasExpenses && (
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50/75 font-bold text-gray-900 text-xs">
              <td colSpan={3} className="px-5 py-3 text-right">Total</td>
              <td className="px-5 py-3 text-right text-red-600">
                -${Math.abs(totalExpenses).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </StatementSection>
  );
}