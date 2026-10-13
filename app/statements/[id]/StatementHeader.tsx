'use client';

import Link from 'next/link';

type StatementHeaderProps = {
  propertyName: string;
  ownerName: string;
  monthYear: string;
  status: 'not_generated' | 'draft' | 'published';
};

export default function StatementHeader({
  propertyName,
  ownerName,
  monthYear,
  status,
}: StatementHeaderProps) {
  const isDraft = status === 'draft';
  const isPublished = status === 'published';

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Dashboard
      </Link>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">{propertyName}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              isPublished
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isDraft
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {isPublished ? 'Published' : isDraft ? 'Draft' : 'Not Generated'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Owner: <span className="font-medium text-gray-700">{ownerName}</span> &middot; Period:{' '}
          <span className="font-medium text-gray-700">{monthYear}</span>
        </p>
      </div>
    </div>
  );
}