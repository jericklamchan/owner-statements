'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SummaryTab from '@/components/statements/SummaryTab';
import LineItemsTab from '@/components/statements/LineItemsTab';
import AuditTab from '@/components/statements/AuditTab';
import { PropertyStatement, StatementAdjustment } from '@/types/statement';
import { STATEMENT_STATUSES, YEARS, MONTHS, Year } from '@/src/constants';
import StatementHeader from './StatementHeader';
import StatementActions from './StatementActions';
import StatementMetrics from './StatementMetrics';
import StatementInvoiceHeader from '@/components/statements/summary/StatementInvoiceHeader';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function StatementDetailPage({ params }: PageProps) {
  // Use React state for resolved ID to prevent any unmemoized async rendering during SSR/hydration
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'line-items' | 'audit'>('summary');
  
  const [statement, setStatement] = useState<PropertyStatement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safely resolve the Next.js async params promise on mount
  useEffect(() => {
    params.then((resolved) => {
      setPropertyId(resolved.id);
    });
  }, [params]);

  const fetchStatement = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const searchParams = new URLSearchParams(window.location.search);
      const now = new Date();
      const currentYearNum = now.getFullYear();
      
      const currentYear = YEARS.includes(currentYearNum as Year) ? currentYearNum : (YEARS[0] || 2026);
      const currentMonth = MONTHS.some(m => m.value === (now.getMonth() + 1)) ? (now.getMonth() + 1) : (MONTHS.find(m => m.value === 10)?.value || 10);

      const year = searchParams.get('year') || String(currentYear);
      const month = searchParams.get('month') || String(currentMonth);

      const res = await fetch(`/api/statements/${id}?year=${year}&month=${month}`);
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
    if (propertyId) {
      fetchStatement(propertyId);
    }
  }, [propertyId]);

  const patchStatement = async (payload: { status?: string; adjustments?: StatementAdjustment[] }) => {
    if (!propertyId) return;
    try {
      setIsUpdating(true);
      const searchParams = new URLSearchParams(window.location.search);
      const now = new Date();
      const currentYearNum = now.getFullYear();
      const currentYear = YEARS.includes(currentYearNum as Year) ? currentYearNum : (YEARS[0] || 2026);
      const currentMonth = MONTHS.some(m => m.value === (now.getMonth() + 1)) ? (now.getMonth() + 1) : (MONTHS.find(m => m.value === 10)?.value || 10);

      const year = searchParams.get('year') || String(statement?.year || currentYear);
      const month = searchParams.get('month') || String(statement?.month || currentMonth);

      const res = await fetch(`/api/statements/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...payload, 
          year, 
          month 
        }),
      });
      const data = await res.json();

      if (data.success) {
        await fetchStatement(propertyId);
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

  if (isLoading || !propertyId) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-xs text-gray-500 animate-pulse">
            Loading statement view...
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
      <div className="print:hidden">
        <NavBar />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-full print:w-full">
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
              onRefresh={() => fetchStatement(propertyId)}
              onGenerate={() => patchStatement({ status: STATEMENT_STATUSES.DRAFT })}
              onPublish={() => patchStatement({ status: STATEMENT_STATUSES.PUBLISHED })}
              onDownloadPdf={handleDownloadPdf}
            />
          </div>
        </div>

        {isPublished && (
          <StatementInvoiceHeader
            statementId={statement.id}
            monthYear={statement.monthYear}
          />
        )}

        <div className="mb-6 print:mb-4">
          <StatementMetrics statement={statement} />
        </div>

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