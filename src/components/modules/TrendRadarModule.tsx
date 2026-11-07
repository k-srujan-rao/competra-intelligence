import React, { useState } from 'react';
import { TrendItem, IndustryType } from '../../types';
import { store } from '../../services/store';
import { Radar, TrendingUp, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface TrendRadarModuleProps {
  activeIndustry: IndustryType;
}

export const TrendRadarModule: React.FC<TrendRadarModuleProps> = ({ activeIndustry }) => {
  const trends = store.getTrends(activeIndustry);
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(trends[0] || null);

  const stages: Array<'Emerging' | 'Growing' | 'Stable' | 'Declining'> = [
    'Emerging',
    'Growing',
    'Stable',
    'Declining',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23211a] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radar className="h-5 w-5 text-amber-400" />
            Market & Industry Trend Radar
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Longitudinal synthesis of emerging paradigms, technology adoption curves, and tactical trends across {activeIndustry}.
          </p>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          Tracking <strong className="text-amber-400">{trends.length}</strong> active macro trends
        </span>
      </div>

      {/* 4 Quadrants / Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stages.map((stg) => {
          const stageTrends = trends.filter((t) => t.stage === stg);
          const colorStyles = {
            Emerging: 'border-amber-500/30 bg-[#0b0c10] text-amber-200',
            Growing: 'border-yellow-500/40 bg-[#0e0f16] text-yellow-300',
            Stable: 'border-[#2b281f] bg-[#0b0c10] text-amber-400',
            Declining: 'border-rose-500/30 bg-rose-950/10 text-rose-300',
          }[stg];

          return (
            <div key={stg} className={`rounded-2xl border p-4 space-y-3 ${colorStyles}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider">{stg}</h4>
                <span className="rounded-full bg-[#141620] border border-[#23211a] px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {stageTrends.length}
                </span>
              </div>

              <div className="space-y-2">
                {stageTrends.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No trends in this stage.</p>
                ) : (
                  stageTrends.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTrend(t)}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${
                        selectedTrend?.id === t.id
                          ? 'border-amber-400/60 bg-[#141620] shadow-md ring-1 ring-amber-400/30'
                          : 'border-[#23211a] bg-[#07080b] hover:border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{t.title}</span>
                        <ChevronRight className="h-3 w-3 text-amber-400/60" />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Pioneer: {t.pioneeringCompetitor}</span>
                        <span className="font-bold text-amber-400">{t.growthVelocity}% vel</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Trend Deep Dive Card */}
      {selectedTrend && (
        <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#23211a] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedTrend.title}</h3>
                <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-xs font-bold text-amber-300">
                  {selectedTrend.stage}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedTrend.industry} Sector</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Growth Velocity</span>
              <div className="text-xl font-bold text-amber-400">{selectedTrend.growthVelocity}/100</div>
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">{selectedTrend.description}</p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Pioneered by:</span>
              <strong className="text-amber-300">{selectedTrend.pioneeringCompetitor}</strong>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedTrend.keyKeywords.map((kw, idx) => (
                <span key={idx} className="rounded-lg bg-[#141620] border border-[#23211a] px-2.5 py-1 text-xs text-amber-200/80">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
