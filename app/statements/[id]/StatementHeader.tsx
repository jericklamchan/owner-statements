'use client';

import { STATEMENT_STATUSES, StatementStatus } from '@/src/constants';

type StatementHeaderProps = {
  propertyName: string;
  ownerName: string;
  monthYear: string;
  status: StatementStatus;
};

export default function StatementHeader({
  propertyName,
  ownerName,
  monthYear,
  status,
}: StatementHeaderProps) {
  const isDraft = status === STATEMENT_STATUSES.DRAFT;
  const isPublished = status === STATEMENT_STATUSES.PUBLISHED;

  return (
    <div>
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