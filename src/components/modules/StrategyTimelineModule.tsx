import React, { useState } from 'react';
import { Competitor, Observation } from '../../types';
import { CategoryBadge, ImportanceBadge } from '../common/Badge';
import { Milestone, Calendar, ExternalLink, Filter } from 'lucide-react';

interface StrategyTimelineModuleProps {
  competitors: Competitor[];
  observations: Observation[];
}

export const StrategyTimelineModule: React.FC<StrategyTimelineModuleProps> = ({
  competitors,
  observations,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>('all');

  const filtered = observations
    .filter((o) => selectedCompId === 'all' || o.competitorId === selectedCompId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Milestone className="h-5 w-5 text-amber-400" />
            Historical Strategy Timeline (2024–2026)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chronological multi-peer progression tracking product unveilings, pricing pivots, and software milestones.
          </p>
        </div>

        <select
          value={selectedCompId}
          onChange={(e) => setSelectedCompId(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="all">All Competitors</option>
          {competitors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Visual Timeline Spine */}
      <div className="relative border-l-2 border-slate-800 pl-6 ml-4 space-y-6">
        {filtered.map((obs) => {
          const comp = competitors.find((c) => c.id === obs.competitorId);
          return (
            <div key={obs.id} className="relative group">
              {/* Timeline marker node */}
              <div
                className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-[#090a0f] shadow-md transition-transform group-hover:scale-125"
                style={{ backgroundColor: comp?.brandColor || '#0071e3' }}
              />

              {/* Event card */}
              <div className="rounded-2xl border border-slate-800/80 bg-[#0d0f17] p-4.5 space-y-2 shadow-lg hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{obs.competitorName}</span>
                    <span className="text-[11px] text-slate-500">• {obs.industry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={obs.category} />
                    <ImportanceBadge level={obs.importance} />
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {obs.date}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">{obs.headline}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{obs.summary}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400">Source: {obs.sourceName}</span>
                  <a
                    href={obs.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Verify Source <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
