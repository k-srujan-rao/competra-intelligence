import React, { useState } from 'react';
import { Competitor, IndustryType } from '../../types';
import { CompetitorCard } from '../competitor/CompetitorCard';
import { EmptyState } from '../common/EmptyState';
import { INDUSTRY_CATEGORIES } from '../../data/seedData';
import {
  Search,
  PlusCircle,
  Filter,
  ArrowUpDown,
  Building2,
  Columns,
  Sparkles,
} from 'lucide-react';

interface CompetitorsModuleProps {
  competitors: Competitor[];
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAddModal: () => void;
  onEditCompetitor: (competitor: Competitor) => void;
  onDeleteCompetitor: (id: string) => void;
  onViewProfile: (competitor: Competitor) => void;
  onToggleMonitoring: (id: string) => void;
  selectedCompareIds: string[];
  onToggleCompare: (id: string) => void;
  onLoadPresets: () => void;
}

type SortOption = 'recent' | 'observations' | 'name' | 'threat';

export const CompetitorsModule: React.FC<CompetitorsModuleProps> = ({
  competitors,
  activeIndustry,
  onSelectIndustry,
  onOpenAddModal,
  onEditCompetitor,
  onDeleteCompetitor,
  onViewProfile,
  onToggleMonitoring,
  selectedCompareIds,
  onToggleCompare,
  onLoadPresets,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Filter by industry & search
  const filteredCompetitors = competitors.filter((comp) => {
    const matchesIndustry = activeIndustry === 'All' || comp.industry === activeIndustry;
    const matchesSearch =
      !searchQuery.trim() ||
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.productCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  // Sort competitors
  const sortedCompetitors = [...filteredCompetitors].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.lastMonitoredAt).getTime() - new Date(a.lastMonitoredAt).getTime();
    }
    if (sortBy === 'observations') {
      return (b.observationCount || 0) - (a.observationCount || 0);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'threat') {
      const threatScore = { Critical: 4, High: 3, Moderate: 2, Low: 1 };
      return (threatScore[b.threatLevel] || 0) - (threatScore[a.threatLevel] || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-400" />
            Competitor Management Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic watchlist of monitored enterprises, startups, and market peers across {activeIndustry === 'All' ? 'all industries' : activeIndustry}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Competitor</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d0f17] p-3 rounded-2xl border border-slate-800">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, product category, or country..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Sort & Industry filter controls */}
        <div className="flex items-center gap-2">
          {/* Industry Filter dropdown */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Filter className="h-3.5 w-3.5 text-amber-400" />
            <select
              value={activeIndustry}
              onChange={(e) => onSelectIndustry(e.target.value as IndustryType)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              {INDUSTRY_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                  {cat.name} ({cat.id === 'All' ? competitors.length : competitors.filter((c) => c.industry === cat.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="recent" className="bg-slate-900 text-white">Recent Activity</option>
              <option value="observations" className="bg-slate-900 text-white">Most Observations</option>
              <option value="threat" className="bg-slate-900 text-white">Threat Level</option>
              <option value="name" className="bg-slate-900 text-white">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Competitors Visual Cards Grid */}
      {sortedCompetitors.length === 0 ? (
        <EmptyState
          type={competitors.length === 0 ? 'no-competitors' : 'no-results'}
          title={competitors.length === 0 ? 'No competitors added yet' : 'No matching competitors found'}
          description={
            competitors.length === 0
              ? 'Start building your competitive intelligence watchlist. Add any company across any industry to begin tracking real-time pricing, product launches, and Hindsight longitudinal memories.'
              : `No competitors match your search "${searchQuery}" in ${activeIndustry}. Try clearing the search or adding a new competitor.`
          }
          onAction={onOpenAddModal}
          actionText="Add New Competitor"
          onLoadPresets={onLoadPresets}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedCompetitors.map((comp) => (
            <CompetitorCard
              key={comp.id}
              competitor={comp}
              onEdit={onEditCompetitor}
              onDelete={onDeleteCompetitor}
              onViewProfile={onViewProfile}
              onToggleMonitoring={onToggleMonitoring}
              isSelectedForCompare={selectedCompareIds.includes(comp.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
};
