'use client';

import { useState, useMemo, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import PageHeader from '@/components/ui/PageHeader';
import DashboardFilters from '@/components/DashboardFilters';
import MetricsCards from '@/components/MetricsCards';
import PropertyQueue from '@/components/PropertyQueue';
import { STATEMENT_STATUSES, StatementStatus, Year, MonthValue, YEARS, MONTHS } from '@/src/constants';
import { PropertyStatement } from '@/types/statement';

export default function DashboardPage() {
  // Initialize with current real-world date (e.g., October 2026), falling back safely to constants
  const now = new Date();
  const currentYear = now.getFullYear() as Year;
  const currentMonth = (now.getMonth() + 1) as MonthValue;

  const [selectedYear, setSelectedYear] = useState<Year>(
    YEARS.includes(currentYear) ? currentYear : (YEARS[0] || 2026)
  );
  const [selectedMonth, setSelectedMonth] = useState<MonthValue>(
    MONTHS.some((m) => m.value === currentMonth) ? currentMonth : (MONTHS[0]?.value || 10)
  );

  const [selectedStatus, setSelectedStatus] = useState<StatementStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [properties, setProperties] = useState<PropertyStatement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDashboardStatements() {
      try {
        setIsLoading(true);
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
    return properties.filter((item: PropertyStatement) => {
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
      notGenerated: list.filter((p: PropertyStatement) => p.status === STATEMENT_STATUSES.NOT_GENERATED || !p.status).length,
      draft: list.filter((p: PropertyStatement) => p.status === STATEMENT_STATUSES.DRAFT).length,
      published: list.filter((p: PropertyStatement) => p.status === STATEMENT_STATUSES.PUBLISHED).length,
      totalProperties: list.length,
      totalOwnerPayout: list.reduce((acc: number, curr: PropertyStatement) => acc + Number(curr.totalPayout || 0), 0),
      totalCommission: list.reduce((acc: number, curr: PropertyStatement) => acc + Number(curr.mgmtFee || 0), 0),
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
          year={selectedYear}   // <-- Pass selectedYear
          month={selectedMonth} // <-- Pass selectedMonth
        />
      </main>
    </div>
  );
}