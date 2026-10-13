'use client';

import { PropertyStatement } from '@/types/statement';
import StatementSection from '@/components/statements/StatementSection';

export default function OccupancyMetricsCard({ statement }: { statement: PropertyStatement }) {
  return (
    <StatementSection title="Occupancy Metrics">
      <div className="p-5 space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500">Occupancy Rate</span>
            <span className="font-semibold text-gray-900">{statement.occupancyRate}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${statement.occupancyRate}%` }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="text-center p-3 bg-gray-50/75 rounded-lg border border-gray-100">
            <p className="text-base font-bold text-gray-900">{statement.occupiedNights}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Occupied</p>
          </div>
          <div className="text-center p-3 bg-gray-50/75 rounded-lg border border-gray-100">
            <p className="text-base font-bold text-gray-900">{statement.totalNights}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Total Days</p>
          </div>
          <div className="text-center p-3 bg-gray-50/75 rounded-lg border border-gray-100">
            <p className="text-base font-bold text-gray-900">${statement.avgDailyRate.toFixed(2)}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Avg Rate</p>
          </div>
        </div>
      </div>
    </StatementSection>
  );
}