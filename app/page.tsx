'use client';

import { useState, useMemo, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/ui/PageHeader';
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
    async function fetchDashboardStatements() {
      try {
        setIsLoading(true);
        // Fetch properties combined with their statement snapshot status for the selected year/month
        const res = await fetch(`/api/statements?year=${selectedYear}&month=${selectedMonth}`);
        const data = await res.json();
        if (data.success) {
          setProperties(data.statements || data.properties); 
        }
      } catch (error) {
        console.error('Failed to load dashboard statements:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardStatements();
  }, [selectedYear, selectedMonth]);

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
      notGenerated: list.filter((p) => p.status === 'not_generated' || !p.status).length,
      draft: list.filter((p) => p.status === 'draft').length,
      published: list.filter((p) => p.status === 'published').length,
      totalProperties: list.length,
      totalOwnerPayout: list.reduce((acc, curr) => acc + (curr.totalPayout || curr.ownerPayout || 0), 0),
      totalCommission: list.reduce((acc, curr) => acc + (curr.mgmtFee || curr.commission || 0), 0),
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
        {/* Unified Page Header Integration */}
        <PageHeader
          backHref="" 
          backLabel=""
          title="Statement Dashboard"
          subtitle="Manage and generate monthly owner statements across properties."
        />

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