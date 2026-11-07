import React from 'react';
import { ImportanceLevel, ActivityCategory } from '../../types';

export const ImportanceBadge: React.FC<{ level: ImportanceLevel }> = ({ level }) => {
  const styles: Record<ImportanceLevel, string> = {
    Critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    High: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Medium: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    Low: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[level] || styles.Medium}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        level === 'Critical' ? 'bg-rose-400 animate-pulse' :
        level === 'High' ? 'bg-amber-400' :
        level === 'Medium' ? 'bg-blue-400' : 'bg-slate-400'
      }`} />
      {level}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: ActivityCategory | string }> = ({ category }) => {
  const styles: Record<string, string> = {
    'Pricing': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'Product Launch': 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    'Feature Update': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    'Strategic Pivot': 'bg-amber-500/20 text-amber-200 border-amber-500/40',
    'Marketing Campaign': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    'Executive Leadership': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'Partnership': 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    'Patent / R&D': 'bg-yellow-600/15 text-yellow-200 border-yellow-600/30',
    'Legal / Regulatory': 'bg-stone-500/15 text-stone-300 border-stone-500/30',
  };

  const currentStyle = styles[category] || 'bg-[#141620] text-amber-200/80 border-[#23211a]';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${currentStyle}`}>
      {category}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: 'Active Monitoring' | 'Paused' | 'Alert Active' }> = ({ status }) => {
  if (status === 'Alert Active') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5" />
        High Alert
      </span>
    );
  }
  if (status === 'Paused') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5" />
        Paused
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
      Active
    </span>
  );
};
