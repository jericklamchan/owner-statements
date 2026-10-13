'use client';

import { Card } from '@/components/ui/Card';

interface StatementSectionProps {
  title: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

export default function StatementSection({
  title,
  isEmpty = false,
  emptyMessage = 'No data available for this period.',
  children,
}: StatementSectionProps) {
  return (
    <Card title={title}>
      <div className="overflow-x-auto">
        {isEmpty ? (
          <p className="px-5 py-8 text-xs text-gray-400 text-center italic">
            {emptyMessage}
          </p>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}