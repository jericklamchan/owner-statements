'use client';

import NavBar from '@/components/NavBar';
import { Card } from '@/components/ui/Card';

type ListPageLayoutProps = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  actionLabel: string;
  onActionClick: () => void;
  cardTitle: string;
  children: React.ReactNode;
};

export default function ListPageLayout({
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actionLabel,
  onActionClick,
  cardTitle,
  children,
}: ListPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
            
            {/* Search & Action Bar */}
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={onSearchChange}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-1.5 text-xs placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <button
                onClick={onActionClick}
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              >
                {actionLabel}
              </button>
            </div>
          </div>

          {/* Content Card & Table */}
          <Card title={cardTitle}>
            <div className="overflow-x-auto">
              {children}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}