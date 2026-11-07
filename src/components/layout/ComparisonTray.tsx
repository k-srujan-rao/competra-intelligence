import React from 'react';
import { Competitor } from '../../types';
import { Columns, X, ArrowRight } from 'lucide-react';

interface ComparisonTrayProps {
  selectedIds: string[];
  competitors: Competitor[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onLaunchCompare: () => void;
}

export const ComparisonTray: React.FC<ComparisonTrayProps> = ({
  selectedIds,
  competitors,
  onRemove,
  onClear,
  onLaunchCompare,
}) => {
  if (selectedIds.length === 0) return null;

  const selectedComps = selectedIds
    .map((id) => competitors.find((c) => c.id === id))
    .filter(Boolean) as Competitor[];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-[#08090d]/95 px-4 py-2.5 shadow-2xl shadow-black/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Columns className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-white whitespace-nowrap">
            Comparison Dock ({selectedComps.length}/4):
          </span>
        </div>

        {/* Selected competitor chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {selectedComps.map((comp) => (
            <span
              key={comp.id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2b281f] bg-[#141622] pl-2 pr-1 py-1 text-xs text-stone-100"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: comp.brandColor || '#d4af37' }}
              />
              <span className="font-semibold text-[11px]">{comp.name}</span>
              <button
                type="button"
                onClick={() => onRemove(comp.id)}
                className="rounded p-0.5 text-stone-400 hover:bg-[#1f2233] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] text-stone-400 hover:text-stone-200 transition-colors cursor-pointer px-1"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={onLaunchCompare}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-stone-950 shadow-md shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Compare Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
