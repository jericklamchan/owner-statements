'use client';

import Link from 'next/link';
import { PropertyItem } from '@/types/dashboard';

interface QueueProps {
  properties: PropertyItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function PropertyQueue({ properties, searchTerm, setSearchTerm }: QueueProps) {
  const renderStatusBadge = (status: PropertyItem['status']) => {
    switch (status) {
      case 'not_generated':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Not Generated
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            Draft
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Published
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Section Header and Search */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline space-x-2">
          <h2 className="text-base font-bold text-gray-900">Property Queue</h2>
          <span className="text-xs font-medium text-gray-400">({properties.length})</span>
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

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-200 bg-gray-50/75 uppercase text-gray-400 font-semibold tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3">Property</th>
              <th scope="col" className="px-5 py-3">Status</th>
              <th scope="col" className="px-5 py-3">Date</th>
              <th scope="col" className="px-5 py-3">Owner Payout</th>
              <th scope="col" className="px-5 py-3 text-right">Action</th>
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
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-50 border border-teal-200/60 text-xs font-bold text-teal-700 shadow-2xs">
                        {item.avatarInitials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.propertyName}</p>
                        <p className="text-[11px] text-gray-400">{item.ownerName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">{renderStatusBadge(item.status)}</td>
                  <td className="px-5 py-3.5 text-gray-500">{item.date || '--'}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    {item.ownerPayout !== null ? `$${item.ownerPayout.toFixed(2)}` : '--'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/statements/${item.id}`}
                      title="View Statement Details"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}