'use client';

interface MetricsProps {
  notGeneratedCount: number;
  draftCount: number;
  publishedCount: number;
  totalPropertiesCount: number;
  totalOwnerPayout: number;
  totalCommission: number;
}

export default function MetricsCards({
  notGeneratedCount,
  draftCount,
  publishedCount,
  totalPropertiesCount,
  totalOwnerPayout,
  totalCommission,
}: MetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* Not Generated */}
      <div className="rounded-xl border border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs border-l-4 border-l-amber-400">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Not Generated</p>
        <p className="mt-1 text-lg font-bold text-gray-900">{notGeneratedCount}</p>
      </div>

      {/* Draft */}
      <div className="rounded-xl border border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs border-l-4 border-l-blue-500">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">Draft</p>
        <p className="mt-1 text-lg font-bold text-blue-600">{draftCount}</p>
      </div>

      {/* Published */}
      <div className="rounded-xl border border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs border-l-4 border-l-emerald-500">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Published</p>
        <p className="mt-1 text-lg font-bold text-emerald-600">{publishedCount}</p>
      </div>

      {/* Total Properties */}
      <div className="rounded-xl border border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs border-l-4 border-l-slate-700">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Properties</p>
        <p className="mt-1 text-lg font-bold text-gray-900">{totalPropertiesCount}</p>
      </div>

      {/* Total Payout */}
      <div className="rounded-xl border border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Owner Payout</p>
        <p className="mt-1 text-base font-extrabold text-gray-900 tracking-tight">
          ${totalOwnerPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Total Commission */}
      <div className="rounded-xl border border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Commission</p>
        <p className="mt-1 text-base font-extrabold text-gray-900 tracking-tight">
          ${totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}