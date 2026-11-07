import React from 'react';
import { Competitor, Observation, HindsightMemory } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { EmptyState } from '../common/EmptyState';
import { CategoryBadge, ImportanceBadge } from '../common/Badge';
import {
  Building2,
  Database,
  TrendingDown,
  Sparkles,
  ShieldAlert,
  Brain,
  Rocket,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OverviewModuleProps {
  competitors: Competitor[];
  observations: Observation[];
  memories: HindsightMemory[];
  onOpenAddModal: () => void;
  onSelectModule: (mod: any) => void;
  onViewProfile: (comp: Competitor) => void;
  onLoadPresets: () => void;
}

const PIE_COLORS = ['#d4af37', '#e5c158', '#f3e5ab', '#b8860b', '#997819', '#e09f3e'];

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  competitors,
  observations,
  memories,
  onOpenAddModal,
  onSelectModule,
  onViewProfile,
  onLoadPresets,
}) => {
  if (competitors.length === 0) {
    return (
      <EmptyState
        title="No competitors added yet"
        description="Start building your competitive intelligence watchlist. Add any company, startup, or market peer to begin tracking real-time pricing, product launches, and Hindsight longitudinal memories."
        onAction={onOpenAddModal}
        actionText="Add Your First Competitor"
        onLoadPresets={onLoadPresets}
      />
    );
  }

  // Calculate dynamic metrics
  const totalMonitored = competitors.filter((c) => c.monitoringEnabled).length;
  const uniqueIndustries = Array.from(new Set(competitors.map((c) => c.industry))).length;
  const priceChangesCount = observations.filter((o) => o.category === 'Pricing' || o.priceDelta).length;
  const productLaunchesCount = observations.filter((o) => o.category === 'Product Launch').length;
  const criticalAlertsCount = observations.filter((o) => o.importance === 'Critical').length;

  // Category distribution for bar chart
  const categoryCounts: Record<string, number> = {};
  observations.forEach((obs) => {
    categoryCounts[obs.category] = (categoryCounts[obs.category] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Industry distribution for pie chart
  const industryCounts: Record<string, number> = {};
  competitors.forEach((c) => {
    industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
  });

  const industryChartData = Object.entries(industryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Simulated trend timeline
  const activityTimelineData = [
    { period: 'W1', observations: Math.max(2, Math.floor(observations.length * 0.15)), pricingMoves: 1 },
    { period: 'W2', observations: Math.max(3, Math.floor(observations.length * 0.25)), pricingMoves: 2 },
    { period: 'W3', observations: Math.max(4, Math.floor(observations.length * 0.35)), pricingMoves: 1 },
    { period: 'W4', observations: observations.length, pricingMoves: priceChangesCount },
  ];

  const criticalObservations = observations.filter((o) => o.importance === 'Critical' || o.importance === 'High').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Dynamic KPI Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Monitored Peers"
          value={competitors.length}
          subValue={`(${totalMonitored} active)`}
          trendText={`${uniqueIndustries} industries`}
          trendDirection="up"
          icon={Building2}
          color="from-amber-500/15 via-amber-500/5 to-transparent"
          onClick={() => onSelectModule('competitors')}
        />

        <KpiCard
          label="Telemetry Observations"
          value={observations.length}
          subValue="collected"
          trendText="Continuous verification"
          trendDirection="up"
          icon={Database}
          color="from-cyan-500/15 via-cyan-500/5 to-transparent"
          onClick={() => onSelectModule('feed')}
        />

        <KpiCard
          label="Price Shifts Detected"
          value={priceChangesCount}
          subValue="SKUs altered"
          trendText={priceChangesCount > 0 ? 'Tactical discounting active' : 'Stable baselines'}
          trendDirection={priceChangesCount > 0 ? 'down' : 'neutral'}
          icon={TrendingDown}
          color="from-emerald-500/15 via-emerald-500/5 to-transparent"
          onClick={() => onSelectModule('pricing')}
        />

        <KpiCard
          label="Hindsight Memories"
          value={memories.length}
          subValue="retained in banks"
          trendText="Longitudinal reflection ready"
          trendDirection="up"
          icon={Brain}
          color="from-amber-500/15 via-yellow-500/5 to-transparent"
          onClick={() => onSelectModule('hindsight')}
        />
      </div>

      {/* Visual Analytics Grid: 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Activity Category Breakdown (Bar) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#23211a] bg-[#0b0c10] p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Competitive Intelligence Activity Breakdown</h3>
              <p className="text-xs text-stone-400">Distribution across pricing, launches, leadership, and patents</p>
            </div>
            <button
              onClick={() => onSelectModule('feed')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Feed <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#78716c" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#78716c" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b0c10', borderColor: '#23211a', borderRadius: '12px' }}
                  labelStyle={{ color: '#f5e29f', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#d4af37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Industry Distribution (Pie) */}
        <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Industry Watchlist Share</h3>
              <span className="text-xs text-stone-400">{competitors.length} Total</span>
            </div>
            <p className="text-xs text-stone-400 mb-4">Monitored competitor sectors</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {industryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b0c10', borderColor: '#23211a', borderRadius: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            {industryChartData.map((entry, idx) => (
              <span key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                {entry.name} ({entry.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Strategic Alerts & Telemetry Feed Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Critical Alerts */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0d0f17]/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">High-Priority Strategic Alerts</h3>
            </div>
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
              {criticalAlertsCount} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {criticalObservations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No critical deviations detected.</p>
            ) : (
              criticalObservations.map((obs) => (
                <div
                  key={obs.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{obs.competitorName}</span>
                    <div className="flex items-center gap-2">
                      <ImportanceBadge level={obs.importance} />
                      <span className="text-[11px] text-slate-500">{obs.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{obs.headline}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Monitored Competitors Overview Grid */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0d0f17]/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active Watchlist Roster</h3>
            <button
              onClick={() => onSelectModule('competitors')}
              className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Manage ({competitors.length}) <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {competitors.slice(0, 6).map((comp) => (
              <div
                key={comp.id}
                onClick={() => onViewProfile(comp)}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 hover:border-slate-700 hover:bg-slate-900/70 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: comp.brandColor || '#0071e3' }}
                  >
                    {comp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h5 className="text-xs font-bold text-white truncate">{comp.name}</h5>
                    <span className="text-[10px] text-slate-400 truncate block">{comp.industry}</span>
                  </div>
                </div>

                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 shrink-0">
                  {comp.observationCount} obs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
