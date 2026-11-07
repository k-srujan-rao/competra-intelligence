import React, { useState } from 'react';
import { Observation, Competitor, IndustryType, ActivityCategory, ImportanceLevel } from '../../types';
import { CategoryBadge, ImportanceBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  Rss,
  Filter,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Brain,
  Plus,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface FeedModuleProps {
  observations: Observation[];
  competitors: Competitor[];
  activeIndustry: IndustryType;
  onOpenAddModal: () => void;
  onRetainMemory?: (obs: Observation) => void;
}

export const FeedModule: React.FC<FeedModuleProps> = ({
  observations,
  competitors,
  activeIndustry,
  onOpenAddModal,
  onRetainMemory,
}) => {
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedObsId, setExpandedObsId] = useState<string | null>(null);

  // Filter observations
  const filtered = observations.filter((obs) => {
    const matchesIndustry = activeIndustry === 'All' || obs.industry === activeIndustry;
    const matchesComp = selectedCompetitorId === 'all' || obs.competitorId === selectedCompetitorId;
    const matchesCat = selectedCategory === 'all' || obs.category === selectedCategory;
    const matchesImp = selectedImportance === 'all' || obs.importance === selectedImportance;
    const matchesSearch =
      !searchQuery.trim() ||
      obs.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.competitorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesIndustry && matchesComp && matchesCat && matchesImp && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedObsId(expandedObsId === id ? null : id);
  };

  const categories = [
    'Pricing',
    'Product Launch',
    'Feature Update',
    'Strategic Pivot',
    'Marketing Campaign',
    'Executive Leadership',
    'Partnership',
    'Patent / R&D',
    'Legal / Regulatory',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23211a] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Rss className="h-5 w-5 text-amber-400" />
            Dynamic Intelligence Feed
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time verified telemetry stream of competitor pricing deltas, product launches, and strategic pivots.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing <strong className="text-amber-400">{filtered.length}</strong> of {observations.length} observations
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0b0c10] p-3 rounded-2xl border border-[#23211a]">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search observation headlines, summaries, or citations..."
            className="w-full rounded-xl border border-[#23211a] bg-[#07080b] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Competitor filter */}
          <select
            value={selectedCompetitorId}
            onChange={(e) => setSelectedCompetitorId(e.target.value)}
            className="rounded-xl border border-[#23211a] bg-[#07080b] px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Competitors</option>
            {competitors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-[#23211a] bg-[#07080b] px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Importance filter */}
          <select
            value={selectedImportance}
            onChange={(e) => setSelectedImportance(e.target.value)}
            className="rounded-xl border border-[#23211a] bg-[#07080b] px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Importance</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Observation Cards Stream */}
      {filtered.length === 0 ? (
        <EmptyState
          type="no-results"
          title="No intelligence records match your filters"
          description="Try broadening your filters or adding new competitors to populate the activity stream."
        />
      ) : (
        <div className="space-y-3.5">
          {filtered.map((obs) => {
            const isExpanded = expandedObsId === obs.id;
            const comp = competitors.find((c) => c.id === obs.competitorId);

            return (
              <div
                key={obs.id}
                className="rounded-2xl border border-[#23211a] bg-gradient-to-b from-[#0e0f16] to-[#090a0e] p-4.5 shadow-lg transition-all hover:border-amber-500/40"
              >
                {/* Header row: Logo, Name, Category, Importance, Date */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: comp?.brandColor || '#d4af37' }}
                    >
                      {obs.competitorName.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <span className="font-bold text-sm text-white">{obs.competitorName}</span>
                      <span className="text-slate-500 text-xs ml-2">in {obs.industry}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CategoryBadge category={obs.category} />
                    <ImportanceBadge level={obs.importance} />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-amber-400" />
                      {obs.date}
                    </span>
                  </div>
                </div>

                {/* Main Headline */}
                <h4 className="mt-3 text-sm font-bold text-white leading-snug">{obs.headline}</h4>

                {/* Short Summary */}
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{obs.summary}</p>

                {/* Price Delta spotlight if present */}
                {obs.priceDelta && (
                  <div className="mt-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-xs text-amber-300 flex items-center justify-between">
                    <span className="font-medium">Price Delta: {obs.priceDelta.productName}</span>
                    <span className="font-bold">
                      ${obs.priceDelta.oldPrice} → ${obs.priceDelta.newPrice} ({obs.priceDelta.percentChange}%)
                    </span>
                  </div>
                )}

                {/* Footer Bar: Source link, Expand details, Hindsight status */}
                <div className="mt-3.5 pt-2.5 border-t border-[#23211a] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <a
                      href={obs.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-medium"
                    >
                      <span>{obs.sourceName}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    {obs.retainedInHindsight && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25 px-2 py-0.5 text-[10px] font-semibold">
                        <Brain className="h-3 w-3 text-amber-400" />
                        Retained in Memory
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(obs.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Less' : 'Evidence Details'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Expandable Evidence Details Panel */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#23211a] space-y-2.5 text-xs animate-in fade-in duration-150">
                    {obs.details && (
                      <div className="rounded-xl bg-[#07080b] p-3 text-slate-200 leading-relaxed border border-[#23211a]">
                        <span className="font-semibold text-amber-400/90 block mb-1">In-Depth Intelligence Note:</span>
                        {obs.details}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-slate-400 text-[11px]">Semantic Tags:</span>
                      {obs.tags.map((tag, idx) => (
                        <span key={idx} className="rounded bg-[#141620] border border-[#23211a] px-2 py-0.5 text-[10px] text-amber-200/80">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
