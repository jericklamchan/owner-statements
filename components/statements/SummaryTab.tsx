'use client';

import { PropertyStatement, StatementAdjustment } from '@/types/statement';
import StatementSummaryCard from './summary/StatementSummaryCard';
import OccupancyMetricsCard from './summary/OccupancyMetricsCard';
import ReservationsTable from './summary/ReservationsTable';
import AdjustmentsSection from './summary/AdjustmentsSection';

type SummaryTabProps = {
  statement: PropertyStatement;
  onUpdateAdjustments: (adjustments: StatementAdjustment[]) => void;
  isDraft: boolean;
};

export default function SummaryTab({ statement, onUpdateAdjustments, isDraft }: SummaryTabProps) {
  return (
    <div className="space-y-6">
      {/* Top Grid: Statement Summary & Occupancy Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatementSummaryCard statement={statement} />
        <OccupancyMetricsCard statement={statement} />
      </div>

      {/* Reservations Breakdown Table */}
      <ReservationsTable reservations={statement.reservations} />

      {/* Adjustments Section (Editable in Draft, Read-Only when Published) */}
      <AdjustmentsSection
        adjustments={statement.adjustments}
        onUpdateAdjustments={onUpdateAdjustments}
        isDraft={isDraft}
      />
    </div>
  );
}