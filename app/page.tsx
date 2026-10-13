'use client';

import { useState, useMemo, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import DashboardFilters from '@/components/DashboardFilters';
import MetricsCards from '@/components/MetricsCards';
import PropertyQueue from '@/components/PropertyQueue';

export default function DashboardPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function fetchProperties() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (data.success) {
          setProperties(data.properties); // Updates state with records from src/data/db.json
        }
      } catch (error) {
        console.error('Failed to load dashboard properties:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const matchStatus = selectedStatus === 'All' || item.status === selectedStatus;
      const matchSearch =
        item.propertyName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.ownerName.toLowerCase().includes(searchTerm.toLowerCase().trim());

      return matchStatus && matchSearch;
    });
  }, [properties, selectedStatus, searchTerm]);

  const metrics = useMemo(() => {
    const list = properties;

    return {
      notGenerated: list.filter((p) => p.status === 'not_generated' || p.status === 'created').length,
      draft: list.filter((p) => p.status === 'draft').length,
      published: list.filter((p) => p.status === 'published').length,
      totalProperties: list.length,
      totalOwnerPayout: list.reduce((acc, curr) => acc + (curr.ownerPayout || 0), 0),
      totalCommission: list.reduce((acc, curr) => acc + (curr.commission || 0), 0),
    };
  }, [properties]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-16 text-center text-xs text-gray-500 animate-pulse">
          Loading dashboard data...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-16">
      <NavBar />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
        {/* Page Header Integration */}
        <div className="flex items-baseline justify-between border-b border-gray-200/60 pb-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              Statement Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage and generate monthly owner statements across properties.
            </p>
          </div>
        </div>

        <DashboardFilters
          year={selectedYear}
          setYear={setSelectedYear}
          month={selectedMonth}
          setMonth={setSelectedMonth}
          status={selectedStatus}
          setStatus={setSelectedStatus}
        />

        <MetricsCards
          notGeneratedCount={metrics.notGenerated}
          draftCount={metrics.draft}
          publishedCount={metrics.published}
          totalPropertiesCount={metrics.totalProperties}
          totalOwnerPayout={metrics.totalOwnerPayout}
          totalCommission={metrics.totalCommission}
        />

        <PropertyQueue
          properties={filteredProperties}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </main>
    </div>
  );
}