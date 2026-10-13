// app/statements/[id]/page.tsx
'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { MOCK_STATEMENTS } from '@/data/statementData';

export default function StatementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<'summary' | 'line-items' | 'audit'>('summary');
  
  const statement = MOCK_STATEMENTS[resolvedParams.id] || MOCK_STATEMENTS['1'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
      {/* Print Stylesheet Overrides */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          @page { margin: 1cm 1.2cm; size: letter; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { font-size: 9px !important; background: white !important; }
          .min-h-screen { min-height: unset !important; background: white !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          .shadow-sm, .shadow { box-shadow: none !important; }
        }
      `}</style>

      <NavBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4 no-print cursor-pointer"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-200/80">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">{statement.propertyName}</h1>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                {statement.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Owner: <span className="font-medium text-gray-700">{statement.ownerName}</span> &middot; Period: <span className="font-medium text-gray-700">{statement.monthYear}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 no-print">
            <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer">
              <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer">
              Generate Statement
            </button>
          </div>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 border border-blue-200/80 rounded-xl shadow-2xs p-4">
            <p className="text-[11px] font-semibold text-blue-900/60 uppercase tracking-wider">Total Client Payout</p>
            <p className="text-xl font-bold tracking-tight text-blue-700 mt-1">${statement.totalPayout.toFixed(2)}</p>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Gross Revenue</p>
            <p className="text-lg font-bold tracking-tight text-emerald-700 mt-1">${statement.grossRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mgmt Fee</p>
            <p className="text-lg font-bold tracking-tight text-red-600 mt-1">${statement.mgmtFee.toFixed(2)}</p>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Expenses</p>
            <p className="text-lg font-bold tracking-tight text-gray-900 mt-1">${statement.totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6 no-print">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                activeTab === 'summary'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('line-items')}
              className={`pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                activeTab === 'line-items'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              All Line Items
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                activeTab === 'audit'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-red-600'
              }`}
            >
              Audit Log
            </button>
          </nav>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Statement Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-xs text-gray-900 uppercase tracking-wider">Statement Summary</h3>
            </div>
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
          </div>

          {/* Occupancy Card */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-xs text-gray-900 uppercase tracking-wider">Occupancy Metrics</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Occupancy Rate</span>
                  <span className="font-semibold text-gray-900">{statement.occupancyRate}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${statement.occupancyRate}%` }}
                  ></div>
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
          </div>

          {/* Reservations Table */}
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden lg:col-span-2">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-xs text-gray-900 uppercase tracking-wider">Reservations Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Channel</th>
                    <th className="px-5 py-3">From</th>
                    <th className="px-5 py-3">To</th>
                    <th className="px-5 py-3 text-center">Nights</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Total Price</th>
                    <th className="px-5 py-3 text-right">Cleaning Fee</th>
                    <th className="px-5 py-3 text-right">Channel Fee</th>
                    <th className="px-5 py-3 text-right">Stripe Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {statement.reservations.map((res, idx) => (
                    <tr key={res.id} className={`hover:bg-gray-50/80 transition-colors ${idx % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                      <td className="px-5 py-3 font-mono text-gray-500">{res.id}</td>
                      <td className="px-5 py-3 text-gray-700">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200/60">
                          {res.channel}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{res.from}</td>
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{res.to}</td>
                      <td className="px-5 py-3 text-center text-gray-600">{res.nights}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {res.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">${res.totalPrice.toFixed(2)}</td>
                      <td className="px-5 py-3 text-right text-gray-600">${res.cleaningFee.toFixed(2)}</td>
                      <td className="px-5 py-3 text-right text-gray-300">&mdash;</td>
                      <td className="px-5 py-3 text-right text-gray-300">&mdash;</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50/50">
                    <td colSpan={6} className="px-5 py-3 font-bold text-gray-900">Total</td>
                    <td className="px-5 py-3 text-right font-bold text-gray-900">
                      ${statement.baseRentalIncome.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-gray-900">
                      ${statement.cleaningFees.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-gray-400">&mdash;</td>
                    <td className="px-5 py-3 text-right font-bold text-gray-400">&mdash;</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Property Expenses Table */}
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden lg:col-span-2">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-xs text-gray-900 uppercase tracking-wider">Property Expenses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/75 border-b border-gray-200 uppercase text-gray-400 font-semibold tracking-wider">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Vendor</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {statement.expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                        No expenses recorded for this period.
                      </td>
                    </tr>
                  ) : (
                    statement.expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-3 text-gray-600">{expense.date}</td>
                        <td className="px-5 py-3 text-gray-900 font-medium">{expense.vendor}</td>
                        <td className="px-5 py-3 text-gray-600">{expense.category}</td>
                        <td className="px-5 py-3 text-right font-medium text-gray-900">${expense.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}