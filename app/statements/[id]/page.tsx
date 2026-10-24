'use client';

import { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SummaryTab from '@/components/statements/SummaryTab';
import LineItemsTab from '@/components/statements/LineItemsTab';
import AuditTab from '@/components/statements/AuditTab';
import { PropertyStatement, StatementAdjustment } from '@/types/statement';
import { STATEMENT_STATUSES, YEARS, MONTHS } from '@/src/constants';
import StatementHeader from './StatementHeader';
import StatementActions from './StatementActions';
import StatementMetrics from './StatementMetrics';
import StatementInvoiceHeader from '@/components/statements/summary/StatementInvoiceHeader';

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

  const defaultYear = YEARS[0] || 2026;
  const defaultMonth = MONTHS[0]?.value || 10;

  const fetchStatement = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/statements/${resolvedParams.id}?year=${defaultYear}&month=${defaultMonth}`);
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
        body: JSON.stringify({ 
          ...payload, 
          year: String(statement?.year || defaultYear), 
          month: String(statement?.month || defaultMonth) 
        }),
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

  const handleDownloadPdf = () => {
    window.print();
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

  const isDraft = statement.status === STATEMENT_STATUSES.DRAFT;
  const isPublished = statement.status === STATEMENT_STATUSES.PUBLISHED;

  return (
    <div className="min-h-screen bg-[#f8fafc] print:bg-white text-gray-900 pb-16 print:pb-0 print:p-0">
      {/* Hide navigation bar on print */}
      <div className="print:hidden">
        <NavBar />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-full print:w-full">
        {/* Hide top action bar on print */}
       <div className="print:hidden mb-6 pb-6 border-b border-gray-200/80">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-2 transition-colors"
          >
            &larr; Return to Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <StatementHeader
              propertyName={statement.propertyName}
              ownerName={statement.ownerName}
              monthYear={statement.monthYear}
              status={statement.status}
            />

            <StatementActions
              status={statement.status}
              isUpdating={isUpdating}
              onRefresh={fetchStatement}
              onGenerate={() => patchStatement({ status: STATEMENT_STATUSES.DRAFT })}
              onPublish={() => patchStatement({ status: STATEMENT_STATUSES.PUBLISHED })}
              onDownloadPdf={handleDownloadPdf}
            />
          </div>
        </div>

        {/* Invoice Header */}
        {isPublished && (
          <StatementInvoiceHeader
            statementId={statement.id}
            monthYear={statement.monthYear}
          />
        )}

        {/* Standard Statement Metrics Row */}
        <div className="mb-6 print:mb-4">
          <StatementMetrics statement={statement} />
        </div>

        {/* Hide tab navigation on print */}
        <div className="print:hidden border-b border-gray-200 mb-6">
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

        {/* Print wrapper to scale or constrain page break behavior */}
        <div className="print:space-y-4">
          {activeTab === 'summary' && (
            <SummaryTab 
              statement={statement} 
              onUpdateAdjustments={(newAdjustments) => patchStatement({ adjustments: newAdjustments })} 
              isDraft={isDraft}
            />
          )}
          {activeTab === 'line-items' && <LineItemsTab lineItems={statement.lineItems || []} />}
          {activeTab === 'audit' && <AuditTab statement={statement} />}
        </div>
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