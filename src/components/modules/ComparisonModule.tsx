import React, { useState } from 'react';
import { Competitor, ProductItem, Observation } from '../../types';
import { store } from '../../services/store';
import { EmptyState } from '../common/EmptyState';
import { CategoryBadge, ImportanceBadge } from '../common/Badge';
import {
  Columns,
  Plus,
  X,
  TrendingDown,
  TrendingUp,
  Layers,
  ShieldCheck,
  Globe,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface ComparisonModuleProps {
  competitors: Competitor[];
  selectedIds: string[];
  onToggleCompare: (id: string) => void;
  onOpenAddModal: () => void;
  onViewProfile: (comp: Competitor) => void;
}

export const ComparisonModule: React.FC<ComparisonModuleProps> = ({
  competitors,
  selectedIds,
  onToggleCompare,
  onOpenAddModal,
  onViewProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'pricing' | 'timeline' | 'products'>('matrix');

  if (competitors.length === 0) {
    return (
      <EmptyState
        title="No competitors available to compare"
        description="Add at least two competitors to your watchlist to unlock side-by-side strategic comparison, pricing matrices, and feature benchmarking."
        onAction={onOpenAddModal}
        actionText="Add Competitors"
      />
    );
  }

  // Selected competitors list (fallback to first 2 if none selected)
  const activeComps = selectedIds.length >= 2
    ? selectedIds.map((id) => competitors.find((c) => c.id === id)).filter(Boolean) as Competitor[]
    : competitors.slice(0, 2);

  // Gather products for active competitors
  const productsByComp: Record<string, ProductItem[]> = {};
  activeComps.forEach((c) => {
    productsByComp[c.id] = store.getProducts(c.id);
  });

  // Prepare price comparison chart data
  const priceBarData: any[] = [];
  const maxProducts = Math.max(...activeComps.map((c) => productsByComp[c.id]?.length || 0), 1);
  for (let i = 0; i < maxProducts; i++) {
    const entry: any = { index: `Item ${i + 1}` };
    activeComps.forEach((c) => {
      const p = productsByComp[c.id]?.[i];
      if (p) {
        entry[c.name] = p.currentPrice;
        entry[`${c.name}_label`] = p.productName;
      }
    });
    if (Object.keys(entry).length > 1) {
      priceBarData.push(entry);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Selector Dock */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Columns className="h-5 w-5 text-amber-400" />
            Competitor Comparison Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Multi-competitor side-by-side strategic matrix, SKU pricing, and feature benchmarks.
          </p>
        </div>

        {/* Selected Competitor Chips & Picker */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Comparing ({activeComps.length}):</span>
          {activeComps.map((comp) => (
            <span
              key={comp.id}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: comp.brandColor || '#0071e3' }}
              />
              <span>{comp.name}</span>
              {activeComps.length > 2 && (
                <button
                  onClick={() => onToggleCompare(comp.id)}
                  className="rounded p-0.5 hover:bg-amber-500/20 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}

          {/* Add more to comparison */}
          {competitors.length > activeComps.length && (
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onToggleCompare(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white focus:outline-none cursor-pointer"
              >
                <option value="">+ Add to compare...</option>
                {competitors
                  .filter((c) => !activeComps.some((ac) => ac.id === c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.name} ({c.industry})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Comparison View Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-2.5 transition-colors cursor-pointer ${
            activeTab === 'matrix'
              ? 'border-b-2 border-amber-500 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Strategic Overview Matrix
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-2.5 transition-colors cursor-pointer ${
            activeTab === 'pricing'
              ? 'border-b-2 border-amber-500 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Price Comparison & Deltas
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2.5 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'border-b-2 border-amber-500 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Product & Feature Matrix
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-2.5 transition-colors cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-b-2 border-amber-500 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Recent Moves & Activity
        </button>
      </div>

      {/* TAB 1: Strategic Overview Matrix */}
      {activeTab === 'matrix' && (
        <div className="overflow-x-auto rounded-2xl border border-[#23211a] bg-[#0b0c10] shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#23211a] bg-[#0e1017]">
                <th className="p-4 font-bold text-amber-200/60 uppercase tracking-wider w-44 font-mono">Dimension</th>
                {activeComps.map((comp) => (
                  <th key={comp.id} className="p-4 font-bold text-white min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: comp.brandColor || '#d4af37' }}
                      />
                      <span className="text-sm font-extrabold">{comp.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23211a] text-stone-200">
              {/* Industry */}
              <tr className="hover:bg-[#12141d]">
                <td className="p-4 font-semibold text-stone-400 font-mono">Industry & Sector</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4 font-medium text-amber-300">
                    {comp.industry} {comp.customIndustry ? `(${comp.customIndustry})` : ''}
                  </td>
                ))}
              </tr>

              {/* Classification */}
              <tr className="hover:bg-[#12141d]">
                <td className="p-4 font-semibold text-stone-400 font-mono">Competitor Type</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4">
                    <span className="rounded-lg bg-[#141622] px-2.5 py-1 font-semibold text-amber-200/90 border border-[#2b281f]">
                      {comp.competitorType}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Product Category */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-semibold text-slate-400">Primary Product Category</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4 font-medium text-white">
                    {comp.productCategory}
                  </td>
                ))}
              </tr>

              {/* Threat Level */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-semibold text-slate-400">Threat Assessment</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        comp.threatLevel === 'Critical'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : comp.threatLevel === 'High'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {comp.threatLevel} Threat
                    </span>
                  </td>
                ))}
              </tr>

              {/* Country & HQ */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-semibold text-slate-400">Geography / HQ</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4">
                    {comp.headquarters || comp.country}
                  </td>
                ))}
              </tr>

              {/* Valuation / Market Cap */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-semibold text-slate-400">Market Cap / Scale</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4 font-bold text-emerald-400">
                    {comp.marketCapOrRevenue || 'Enterprise Tier'}
                  </td>
                ))}
              </tr>

              {/* Observations Count */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-semibold text-slate-400">Collected Observations</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4 font-bold text-white">
                    {comp.observationCount} records
                  </td>
                ))}
              </tr>

              {/* Monitoring Preferences */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-semibold text-slate-400">Monitored Vectors</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {comp.monitoringPreferences.map((pref) => (
                        <span key={pref} className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Positioning Description */}
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 font-semibold text-slate-400">Core Strategy / Moat</td>
                {activeComps.map((comp) => (
                  <td key={comp.id} className="p-4 text-xs text-slate-300 leading-relaxed">
                    {comp.description}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Price Comparison & Deltas */}
      {activeTab === 'pricing' && (
        <div className="space-y-5">
          {priceBarData.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-2">Key SKU Price Points Comparison ($ USD)</h3>
              <p className="text-xs text-slate-400 mb-4">Direct flagship retail baseline comparison</p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceBarData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <XAxis dataKey="index" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090a0f', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Legend />
                    {activeComps.map((comp, idx) => (
                      <Bar
                        key={comp.id}
                        dataKey={comp.name}
                        fill={comp.brandColor || (idx === 0 ? '#0071e3' : '#1428a0')}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Side by side product price lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeComps.map((comp) => {
              const compProducts = productsByComp[comp.id] || [];
              return (
                <div key={comp.id} className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: comp.brandColor || '#0071e3' }}
                    />
                    <h4 className="font-bold text-white text-sm">{comp.name} SKUs</h4>
                  </div>

                  {compProducts.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No product prices recorded yet for {comp.name}.
                    </p>
                  ) : (
                    compProducts.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-xs text-white">{p.productName}</div>
                          <span className="text-[10px] text-slate-400">{p.status}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-400">
                            ${p.currentPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Product & Feature Matrix */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeComps.map((comp) => {
            const prods = productsByComp[comp.id] || [];
            return (
              <div key={comp.id} className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: comp.brandColor || '#0071e3' }}
                    />
                    <h3 className="text-base font-bold text-white">{comp.name}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{prods.length} Registered Products</span>
                </div>

                <div className="space-y-3">
                  {prods.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400">
                      Product feature matrix not yet populated for this competitor.
                    </div>
                  ) : (
                    prods.map((prod) => (
                      <div key={prod.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-white">{prod.productName}</h5>
                          <span className="text-xs font-bold text-emerald-400">${prod.currentPrice}</span>
                        </div>

                        <div className="text-[11px] text-slate-400">Key Architectural Features:</div>
                        <ul className="space-y-1">
                          {prod.keyFeatures.map((f, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                              <span className="h-1 w-1 rounded-full bg-amber-400" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: Recent Moves & Activity Timeline */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeComps.map((comp) => {
            const compObs = store.getObservations(comp.id);
            return (
              <div key={comp.id} className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: comp.brandColor || '#0071e3' }}
                  />
                  <h4 className="font-bold text-white text-sm">{comp.name} Recent Maneuvers</h4>
                </div>

                <div className="space-y-3">
                  {compObs.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No historical records logged yet.</p>
                  ) : (
                    compObs.slice(0, 5).map((obs) => (
                      <div
                        key={obs.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <CategoryBadge category={obs.category} />
                          <span className="text-[11px] text-slate-500">{obs.date}</span>
                        </div>
                        <div className="font-semibold text-xs text-white">{obs.headline}</div>
                        <p className="text-[11px] text-slate-400">{obs.summary}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
