import React, { useState } from 'react';
import { Competitor } from '../../types';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import {
  Globe,
  ExternalLink,
  Edit2,
  Trash2,
  Columns,
  Eye,
  Power,
  Clock,
  Database,
  ShieldAlert,
  Check,
} from 'lucide-react';

interface CompetitorCardProps {
  competitor: Competitor;
  onEdit: (competitor: Competitor) => void;
  onDelete: (id: string) => void;
  onViewProfile: (competitor: Competitor) => void;
  onToggleMonitoring: (id: string) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (id: string) => void;
}

export const CompetitorCard: React.FC<CompetitorCardProps> = ({
  competitor,
  onEdit,
  onDelete,
  onViewProfile,
  onToggleMonitoring,
  isSelectedForCompare,
  onToggleCompare,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const initials = competitor.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const formattedUrl = competitor.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  const formatRelativeTime = (timestamp: string) => {
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-gradient-to-b from-[#0e0f16] to-[#090a0e] p-5 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-black/70 ${
        isSelectedForCompare
          ? 'border-amber-500/60 ring-1 ring-amber-500/30'
          : 'border-[#23211a]'
      }`}
    >
      {/* Top Banner & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Logo / Initial Badge */}
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-md text-base tracking-wider border border-white/10"
              style={{
                backgroundColor: competitor.brandColor || '#d4af37',
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.3) 100%)',
              }}
            >
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {competitor.name}
                </h4>
                {competitor.threatLevel === 'Critical' && (
                  <span title="Critical Threat Level">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-stone-400">
                <span className="font-medium text-amber-200/70">{competitor.industry}</span>
                <span>•</span>
                <span>{competitor.country}</span>
              </div>
            </div>
          </div>

          <StatusBadge status={competitor.activityStatus} />
        </div>

        {/* Website & Classification pill */}
        <div className="mt-3.5 flex items-center justify-between text-xs border-y border-[#23211a] py-2">
          <a
            href={competitor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition-colors truncate max-w-[180px]"
          >
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{formattedUrl}</span>
            <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
          </a>

          <span className="rounded-md bg-[#13151f] px-2 py-0.5 text-[11px] font-medium text-amber-200/80 border border-[#2b281f]">
            {competitor.competitorType}
          </span>
        </div>

        {/* Latest Activity Spotlight */}
        <div className="mt-3 rounded-xl bg-[#0b0c10] border border-[#23211a] p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/60 font-mono flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-400" />
              Latest Telemetry
            </span>
            {competitor.latestActivityCategory && (
              <CategoryBadge category={competitor.latestActivityCategory} />
            )}
          </div>
          <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
            {competitor.latestActivity || `Actively monitoring ${competitor.productCategory} telemetry.`}
          </p>
        </div>

        {/* Metrics Row */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-[#0e0f16] border border-[#23211a] p-2">
            <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
              <Database className="h-3 w-3 text-amber-400" />
              Observations
            </div>
            <div className="mt-1 text-sm font-bold text-white tabular-nums">
              {competitor.observationCount} <span className="text-[10px] font-normal text-stone-400">records</span>
            </div>
          </div>

          <div className="rounded-lg bg-[#0e0f16] border border-[#23211a] p-2">
            <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
              <Clock className="h-3 w-3 text-yellow-400" />
              Last Checked
            </div>
            <div className="mt-1 text-sm font-bold text-stone-200">
              {formatRelativeTime(competitor.lastMonitoredAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="mt-4 pt-3 border-t border-[#23211a] flex items-center justify-between gap-1.5">
        {/* Compare Toggle */}
        <button
          type="button"
          onClick={() => onToggleCompare(competitor.id)}
          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            isSelectedForCompare
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-md shadow-amber-500/20'
              : 'border border-[#23211a] bg-[#12141c] text-stone-300 hover:border-amber-500/40 hover:text-amber-300'
          }`}
          title={isSelectedForCompare ? 'Remove from comparison tray' : 'Add to side-by-side comparison'}
        >
          {isSelectedForCompare ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Comparing
            </>
          ) : (
            <>
              <Columns className="h-3.5 w-3.5" />
              Compare
            </>
          )}
        </button>

        {/* View Profile */}
        <button
          type="button"
          onClick={() => onViewProfile(competitor)}
          className="inline-flex items-center gap-1 rounded-lg border border-[#23211a] bg-[#12141c] px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:border-amber-500/30 hover:bg-[#1a1c26] hover:text-white transition-colors cursor-pointer"
          title="View In-Depth Competitor Profile"
        >
          <Eye className="h-3.5 w-3.5" />
          Intel
        </button>

        {/* Toggle Monitoring */}
        <button
          type="button"
          onClick={() => onToggleMonitoring(competitor.id)}
          className={`rounded-lg p-1.5 text-xs border transition-colors cursor-pointer ${
            competitor.monitoringEnabled
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
              : 'border-[#23211a] bg-[#12141c] text-stone-500 hover:text-stone-300'
          }`}
          title={competitor.monitoringEnabled ? 'Pause monitoring' : 'Enable monitoring'}
        >
          <Power className="h-3.5 w-3.5" />
        </button>

        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(competitor)}
          className="rounded-lg border border-[#23211a] bg-[#12141c] p-1.5 text-stone-400 hover:border-amber-500/30 hover:text-white transition-colors cursor-pointer"
          title="Edit Competitor Details"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>

        {/* Delete */}
        {showConfirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDelete(competitor.id)}
              className="rounded-lg bg-rose-600 px-2 py-1 text-xs font-bold text-white hover:bg-rose-500 cursor-pointer"
            >
              Delete?
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="rounded-lg bg-[#181a24] px-1.5 py-1 text-xs text-stone-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="rounded-lg border border-[#23211a] bg-[#12141c] p-1.5 text-stone-500 hover:border-rose-500/40 hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete Competitor"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
