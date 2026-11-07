import React from 'react';

export const ModuleSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header bar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23211a] pb-5">
        <div className="space-y-2">
          <div className="h-6 w-56 bg-[#161822] rounded-lg border border-[#23211a]" />
          <div className="h-3 w-80 bg-[#11131a] rounded" />
        </div>
        <div className="h-8 w-32 bg-[#161822] rounded-xl border border-[#23211a]" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-[#23211a] bg-[#0b0c10] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-[#161822] rounded" />
              <div className="h-6 w-6 bg-[#161822] rounded-lg" />
            </div>
            <div className="h-7 w-24 bg-[#161822] rounded-lg" />
            <div className="h-2.5 w-16 bg-[#11131a] rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-[#23211a] bg-[#0b0c10] p-5 h-64 flex flex-col justify-between">
          <div className="h-4 w-48 bg-[#161822] rounded" />
          <div className="flex items-end gap-3 h-36 pt-4">
            {[40, 65, 80, 50, 90, 70, 85].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 bg-[#161822] border-t border-amber-500/20 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-5 h-64 space-y-3">
          <div className="h-4 w-32 bg-[#161822] rounded" />
          <div className="h-36 w-36 mx-auto rounded-full border-4 border-[#161822] border-t-amber-400/60" />
        </div>
      </div>
    </div>
  );
};
