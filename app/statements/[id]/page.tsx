'use client';

import { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SummaryTab from '@/components/statements/SummaryTab';
import LineItemsTab from '@/components/statements/LineItemsTab';
import AuditTab from '@/components/statements/AuditTab';
import { PropertyStatement, StatementAdjustment } from '@/types/statement';

type PageProps = {
  params: Promise<{ id: string }>;
};

function StatementDetailContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<'summary' | 'line-items' | 'audit'>('summary');
  
  const [statement, setStatement] = useState<PropertyStatement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatement = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/statements/${resolvedParams.id}?year=2026&month=10`);
      const data = await res.json();
      
      if (data.success && data.statement) {
        setStatement(data.statement);
      } else {
        setError(data.error || 'Failed to load statement details.');
      }
    } catch (err) {
      console.error('Failed to load statement data:', err);
      setError('Network error loading statement data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatement();
  }, [resolvedParams.id]);

  const patchStatement = async (payload: { status?: string; adjustments?: StatementAdjustment[] }) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/statements/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, year: '2026', month: '10' }),
      });
      const data = await res.json();

      if (data.success) {
        await fetchStatement();
      } else {
        alert(data.error || 'Failed to update statement');
      }
    } catch (err) {
      console.error('Error patching statement:', err);
      alert('Error saving changes');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-xs text-gray-500 animate-pulse">
            Loading live statement data from Hostaway, QuickBooks, & Stripe...
          </p>
        </main>
      </div>
    );
  }

  if (error || !statement) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-sm font-medium text-red-600 mb-4">{error || 'Statement not found.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            &larr; Return to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  const isNotGenerated = statement.status === 'not_generated';
  const isDraft = statement.status === 'draft';
  const isPublished = statement.status === 'published';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-200/80">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">{statement.propertyName}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                isPublished 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : isDraft 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {isPublished ? 'Published' : isDraft ? 'Draft' : 'Not Generated'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Owner: <span className="font-medium text-gray-700">{statement.ownerName}</span> &middot; Period: <span className="font-medium text-gray-700">{statement.monthYear}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={fetchStatement}
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
            >
              Refresh
            </button>

            {isNotGenerated && (
              <button 
                onClick={() => patchStatement({ status: 'draft' })}
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                Generate Statement
              </button>
            )}

            {isDraft && (
              <button 
                onClick={() => patchStatement({ status: 'published' })}
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                Publish Statement
              </button>
            )}

            {isPublished && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                ✓ Statement Published
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 border border-blue-200/80 rounded-xl shadow-2xs p-4">
            <p className="text-[11px] font-semibold text-blue-900/60 uppercase tracking-wider">Total Client Payout</p>
            <p className="text-xl font-bold tracking-tight text-blue-700 mt-1">${statement.totalPayout.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Gross Revenue</p>
            <p className="text-lg font-bold tracking-tight text-emerald-700 mt-1">${statement.grossRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mgmt Fee</p>
            <p className="text-lg font-bold tracking-tight text-red-600 mt-1">${statement.mgmtFee.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Expenses & Adjustments</p>
            <p className="text-lg font-bold tracking-tight text-gray-900 mt-1">
              ${(statement.totalExpenses - (statement.totalAdjustments || 0)).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
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
              All Line Items ({statement.lineItems?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                activeTab === 'audit'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-red-600'
              }`}
            >
              Audit
            </button>
          </nav>
        </div>

        {activeTab === 'summary' && (
          <SummaryTab 
            statement={statement} 
            onUpdateAdjustments={(newAdjustments) => patchStatement({ adjustments: newAdjustments })} 
            isDraft={isDraft}
          />
        )}
        {activeTab === 'line-items' && <LineItemsTab lineItems={statement.lineItems || []} />}
        {activeTab === 'audit' && <AuditTab statement={statement} />}
      </main>
    </div>
  );
}

export default function StatementDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16 flex items-center justify-center">
          <p className="text-xs text-gray-500 animate-pulse">Loading statement view...</p>
        </div>
      }
    >
      <StatementDetailContent params={params} />
    </Suspense>
  );
}