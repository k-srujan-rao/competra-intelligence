import React, { useState } from 'react';
import { Competitor, Observation, HindsightMemory, ProductItem, ReflectionInsight } from '../../types';
import { store } from '../../services/store';
import { StatusBadge, CategoryBadge, ImportanceBadge } from '../common/Badge';
import {
  X,
  Globe,
  ExternalLink,
  Brain,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Tag,
  ShieldCheck,
} from 'lucide-react';

interface CompetitorProfileDrawerProps {
  competitor: Competitor | null;
  onClose: () => void;
  onOpenCompare: (competitorId: string) => void;
}

export const CompetitorProfileDrawer: React.FC<CompetitorProfileDrawerProps> = ({
  competitor,
  onClose,
  onOpenCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'observations' | 'products' | 'hindsight'>('overview');
  const [isReflecting, setIsReflecting] = useState(false);
  const [latestReflection, setLatestReflection] = useState<ReflectionInsight | null>(null);

  if (!competitor) return null;

  const observations: Observation[] = store.getObservations(competitor.id);
  const products: ProductItem[] = store.getProducts(competitor.id);
  const memories: HindsightMemory[] = store.hindsightEngine
    .getMemories()
    .filter((m) => m.competitorId === competitor.id || m.bankId === `competra-${competitor.id}`);

  const handleTriggerReflect = () => {
    setIsReflecting(true);
    setTimeout(() => {
      const result = store.hindsightEngine.reflect(competitor.id, competitor.name, competitor.industry);
      setLatestReflection(result);
      setIsReflecting(false);
      setActiveTab('hindsight');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-[#08090d] border-l border-[#23211a] shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#23211a] bg-[#0b0c10]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-bold text-white text-xl shadow-lg border border-white/10"
                style={{
                  backgroundColor: competitor.brandColor || '#d4af37',
                  backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.3) 100%)',
                }}
              >
                {competitor.name.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{competitor.name}</h3>
                  <StatusBadge status={competitor.activityStatus} />
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                  <span className="text-amber-400 font-medium">{competitor.industry}</span>
                  <span>•</span>
                  <span>{competitor.country}</span>
                  <span>•</span>
                  <a
                    href={competitor.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-amber-300 transition-colors"
                  >
                    <Globe className="h-3 w-3" />
                    <span>Website</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-stone-400 hover:bg-[#161824] hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick CTA bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#23211a]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenCompare(competitor.id);
                  onClose();
                }}
                className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                Launch Side-by-Side Comparison
              </button>
              <button
                onClick={handleTriggerReflect}
                disabled={isReflecting}
                className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Brain className="h-3.5 w-3.5 text-amber-400" />
                {isReflecting ? 'Synthesizing...' : 'Hindsight Reflect'}
              </button>
            </div>

            <span className="text-xs text-stone-400">
              Bank ID: <code className="text-amber-200/80 font-mono">competra-{competitor.id}</code>
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex border-b border-[#23211a] gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-b-2 border-amber-400 text-white font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('observations')}
              className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'observations'
                  ? 'border-b-2 border-amber-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Observations ({observations.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'border-b-2 border-amber-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Products & SKUs ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('hindsight')}
              className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'hindsight'
                  ? 'border-b-2 border-amber-400 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="h-3.5 w-3.5 text-amber-400" />
              Hindsight Memory ({memories.length})
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="rounded-xl border border-[#23211a] bg-[#0b0c10] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-2">
                  Company Positioning
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">{competitor.description}</p>
              </div>

              {/* Company Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-[#23211a] bg-[#07080b] p-3">
                  <span className="text-[11px] text-slate-400">Classification</span>
                  <div className="mt-1 text-sm font-semibold text-white">{competitor.competitorType}</div>
                </div>

                <div className="rounded-xl border border-[#23211a] bg-[#07080b] p-3">
                  <span className="text-[11px] text-slate-400">Product Focus</span>
                  <div className="mt-1 text-sm font-semibold text-white truncate">{competitor.productCategory}</div>
                </div>

                <div className="rounded-xl border border-[#23211a] bg-[#07080b] p-3">
                  <span className="text-[11px] text-slate-400">Threat Level</span>
                  <div className="mt-1 text-sm font-semibold text-amber-400">{competitor.threatLevel}</div>
                </div>

                <div className="rounded-xl border border-[#23211a] bg-[#07080b] p-3">
                  <span className="text-[11px] text-slate-400">Headquarters</span>
                  <div className="mt-1 text-sm font-semibold text-white">{competitor.headquarters || competitor.country}</div>
                </div>

                <div className="rounded-xl border border-[#23211a] bg-[#07080b] p-3">
                  <span className="text-[11px] text-slate-400">Founded Year</span>
                  <div className="mt-1 text-sm font-semibold text-white">{competitor.foundedYear || 'Established'}</div>
                </div>

                <div className="rounded-xl border border-[#23211a] bg-[#07080b] p-3">
                  <span className="text-[11px] text-slate-400">Valuation / Scale</span>
                  <div className="mt-1 text-sm font-semibold text-white">{competitor.marketCapOrRevenue || 'Enterprise'}</div>
                </div>
              </div>

              {/* Monitoring Preferences */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-2">
                  Active Intelligence Vectors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.monitoringPreferences.map((pref) => (
                    <span
                      key={pref}
                      className="rounded-lg border border-[#23211a] bg-[#141620] px-3 py-1 text-xs text-amber-200/90 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'observations' && (
            <div className="space-y-3">
              {observations.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400">
                  No observation records logged yet for {competitor.name}.
                </div>
              ) : (
                observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="rounded-xl border border-[#23211a] bg-[#07080b] p-4 space-y-2 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <CategoryBadge category={obs.category} />
                      <div className="flex items-center gap-2">
                        <ImportanceBadge level={obs.importance} />
                        <span className="text-xs text-slate-400">{obs.date}</span>
                      </div>
                    </div>

                    <h5 className="text-sm font-bold text-white leading-snug">{obs.headline}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{obs.summary}</p>

                    {obs.priceDelta && (
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 text-xs text-amber-300 flex items-center justify-between">
                        <span>Price Action: {obs.priceDelta.productName}</span>
                        <span className="font-bold">
                          ${obs.priceDelta.oldPrice} → ${obs.priceDelta.newPrice} ({obs.priceDelta.percentChange}%)
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#23211a] text-xs">
                      <span className="text-slate-400">Source: {obs.sourceName}</span>
                      <a
                        href={obs.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                      >
                        Verify Evidence <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-3">
              {products.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400">
                  No products or SKUs registered for {competitor.name}.
                </div>
              ) : (
                products.map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-xl border border-[#23211a] bg-[#07080b] p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-white">{prod.productName}</h5>
                        <span className="text-xs text-slate-400">{prod.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-amber-400">
                          ${prod.currentPrice.toLocaleString()} {prod.currency}
                        </div>
                        <span className="text-[10px] text-slate-400">Status: {prod.status}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {prod.keyFeatures.map((feat, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-[#141620] border border-[#23211a] px-2 py-0.5 text-[11px] text-amber-200/80"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'hindsight' && (
            <div className="space-y-4">
              {latestReflection && (
                <div className="rounded-xl border border-amber-500/40 bg-[#0e1017] p-4 space-y-2 shadow-md">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>LATEST REFLECTION SYNTHESIS</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">{latestReflection.title}</h5>
                  <p className="text-xs text-stone-200 leading-relaxed">{latestReflection.synthesis}</p>
                  <div className="rounded-lg bg-[#141622] p-2.5 text-xs text-amber-300 border border-[#23211a]">
                    <span className="font-semibold text-stone-400">Recommendation: </span>
                    {latestReflection.strategicRecommendation}
                  </div>
                </div>
              )}

              <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-200/60 font-mono">
                Retained Memories in Bank ({memories.length})
              </h5>

              {memories.length === 0 ? (
                <div className="text-center py-6 text-sm text-stone-400">
                  No retained memories in this bank yet. Add observations or trigger Hindsight operations.
                </div>
              ) : (
                memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="rounded-xl border border-[#23211a] bg-[#0b0c10] p-3.5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-stone-400">
                      <span className="font-semibold text-amber-300">{mem.category}</span>
                      <span className="font-mono">{new Date(mem.timestamp).toLocaleDateString()}</span>
                    </div>

                    <p className="text-stone-100 font-medium">{mem.content}</p>
                    <p className="text-stone-400 text-[11px]">{mem.contextSummary}</p>

                    {mem.longitudinalPattern && (
                      <div className="rounded bg-[#141622] p-2 text-[11px] text-amber-300 border border-[#2b281f]">
                        <span className="font-semibold text-stone-300">Pattern: </span>
                        {mem.longitudinalPattern}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {mem.semanticTags.map((tag, idx) => (
                        <span key={idx} className="rounded bg-[#181a24] px-1.5 py-0.5 text-[10px] text-amber-200/70 border border-[#2b281f]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
