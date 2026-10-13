// components/DashboardFilters.tsx
'use client';

import { YEARS, MONTHS } from '@/utils/constants';

interface FilterProps {
  year: number;
  setYear: (y: number) => void;
  month: number;
  setMonth: (m: number) => void;
  status: string;
  setStatus: (s: string) => void;
}

export default function DashboardFilters({
  year,
  setYear,
  month,
  setMonth,
  status,
  setStatus,
}: FilterProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      {/* Inline Select Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Year Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500">Year</span>
          <select
            aria-label="Filter by Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-gray-50/50 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <span className="text-gray-300">|</span>

        {/* Month Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500">Month</span>
          <select
            aria-label="Filter by Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-gray-50/50 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <span className="text-gray-300">|</span>

        {/* Status Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500">Status</span>
          <select
            aria-label="Filter by Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50/50 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="not_generated">Not Generated</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

    </div>
  );
}