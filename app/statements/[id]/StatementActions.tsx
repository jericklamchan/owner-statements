'use client';

type StatementActionsProps = {
  status: 'not_generated' | 'draft' | 'published';
  isUpdating: boolean;
  onRefresh: () => void;
  onGenerate: () => void;
  onPublish: () => void;
  onDownloadPdf: () => void;
};

export default function StatementActions({
  status,
  isUpdating,
  onRefresh,
  onGenerate,
  onPublish,
  onDownloadPdf,
}: StatementActionsProps) {
  const isNotGenerated = status === 'not_generated';
  const isDraft = status === 'draft';
  const isPublished = status === 'published';

  return (
    <div className="flex items-center gap-2.5">
      {/* Refresh button disappears entirely when published */}
      {!isPublished && (
        <button 
          onClick={onRefresh}
          disabled={isUpdating}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          Refresh
        </button>
      )}

      {isNotGenerated && (
        <button 
          onClick={onGenerate}
          disabled={isUpdating}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          Generate Statement
        </button>
      )}

      {isDraft && (
        <button 
          onClick={onPublish}
          disabled={isUpdating}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          Publish Statement
        </button>
      )}

      {isPublished && (
        <button
          onClick={onDownloadPdf}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF
        </button>
      )}
    </div>
  );
}