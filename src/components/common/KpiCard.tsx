import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subValue,
  trendText,
  trendDirection = 'neutral',
  icon: Icon,
  color = 'from-amber-500/20 to-amber-500/5',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border border-[#23211a] bg-[#0b0c10] p-4.5 backdrop-blur-sm transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-black/70 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-amber-200/60 font-mono">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141620] text-amber-400 border border-[#2b281f]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white tabular-nums">{value}</span>
        {subValue && <span className="text-xs text-stone-400">{subValue}</span>}
      </div>
      {trendText && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
          <span
            className={
              trendDirection === 'up'
                ? 'text-emerald-400'
                : trendDirection === 'down'
                ? 'text-rose-400'
                : 'text-slate-400'
            }
          >
            {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '•'} {trendText}
          </span>
        </div>
      )}
    </div>
  );
};
