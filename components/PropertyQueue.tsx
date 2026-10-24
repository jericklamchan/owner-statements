'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PropertyItem } from '@/types/dashboard';
import { STATEMENT_STATUSES } from '@/src/constants';

interface QueueProps {
  properties: PropertyItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  [STATEMENT_STATUSES.NOT_GENERATED]: { label: 'Not Generated', bg: 'bg-amber-50/80', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200/60' },
  created: { label: 'Not Generated', bg: 'bg-amber-50/80', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200/60' }, // Legacy fallback
  [STATEMENT_STATUSES.DRAFT]: { label: 'Draft', bg: 'bg-blue-50/80', text: 'text-blue-700', dot: 'bg-blue-500', border: 'border-blue-200/60' },
  [STATEMENT_STATUSES.PUBLISHED]: { label: 'Published', bg: 'bg-emerald-50/80', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200/60' },
};

export default function PropertyQueue({ properties, searchTerm, setSearchTerm }: QueueProps) {
  const renderStatusBadge = (status: string = STATEMENT_STATUSES.NOT_GENERATED) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG[STATEMENT_STATUSES.NOT_GENERATED];
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.bg} ${config.text} border ${config.border} shadow-2xs`}>
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    );
  };

  const getDisplayDate = (item: PropertyItem) => {
    const isGenerated = item.status === STATEMENT_STATUSES.DRAFT || item.status === STATEMENT_STATUSES.PUBLISHED;
    
    if (!isGenerated) {
      return (
        <span className="inline-flex items-center text-xs text-gray-400 font-medium">
          —
        </span>
      );
    }

    const dateStr = item.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200/80 rounded-md px-2.5 py-1 shadow-2xs">
        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{dateStr}</span>
      </span>
    );
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Header & Search */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline space-x-2">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Property Queue</h2>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {properties.length}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            aria-label="Search properties or owners"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search properties or owners..."
            className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-9 pr-3 text-xs text-gray-800 placeholder-gray-400 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <Card title="Properties Overview">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-gray-200/80 bg-gray-50/60 uppercase text-gray-400 font-semibold tracking-wider text-[10px]">
              <tr>
                <th scope="col" className="px-5 py-3 text-left">Property</th>
                <th scope="col" className="px-5 py-3 text-left">Status</th>
                <th scope="col" className="px-5 py-3 text-left">Date</th>
                <th scope="col" className="px-5 py-3 text-right">Owner Payout</th>
                <th scope="col" className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <p className="text-xs font-semibold text-gray-900">No properties found</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Try adjusting your filters or search term.</p>
                  </td>
                </tr>
              ) : (
                properties.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                    {/* Property & Avatar */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50/80 border border-teal-200/60 text-xs font-bold text-teal-700 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                          {item.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate">{item.propertyName}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{item.ownerName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 align-middle">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 align-middle">
                      {getDisplayDate(item)}
                    </td>

                    {/* Owner Payout */}
                    <td className="px-5 py-4 align-middle text-right font-bold text-gray-900 tabular-nums">
                      {item.ownerPayout !== null ? `$${item.ownerPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : <span className="text-gray-300 font-mono">—</span>}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-4 align-middle text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* View Button */}
                        <Link
                          href={`/statements/${item.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-2xs cursor-pointer group/btn"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View</span>
                        </Link>

                        {/* Edit Button */}
                        <Link
                          href={`/properties/${item.id}`}
                          title="Edit Property Policy"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-gray-300 transition-all shadow-2xs cursor-pointer group/edit"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-400 group-hover/edit:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}