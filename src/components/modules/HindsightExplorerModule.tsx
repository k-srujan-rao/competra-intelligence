import React, { useState } from 'react';
import { Competitor, HindsightMemory, ReflectionInsight, Observation } from '../../types';
import { store } from '../../services/store';
import {
  Brain,
  Search,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  Database,
  History,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';

interface HindsightExplorerModuleProps {
  competitors: Competitor[];
  memories: HindsightMemory[];
  reflections: ReflectionInsight[];
  onTriggerDemo: () => void;
}

export const HindsightExplorerModule: React.FC<HindsightExplorerModuleProps> = ({
  competitors,
  memories,
  reflections,
  onTriggerDemo,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<'all' | 'RETAIN' | 'RECALL' | 'REFLECT'>('all');
  const [recallQuery, setRecallQuery] = useState('price changes and discounting');
  const [recalledResults, setRecalledResults] = useState<HindsightMemory[] | null>(null);
  const [isRecalling, setIsRecalling] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectCompetitorId, setReflectCompetitorId] = useState<string>(competitors[0]?.id || '');
  const [latestSynthesizedReflection, setLatestSynthesizedReflection] = useState<ReflectionInsight | null>(null);

  // Filter memories by bank
  const filteredMemories = memories.filter((m) => {
    if (selectedBank === 'all') return true;
    return m.bankId === selectedBank || m.competitorId === selectedBank;
  });

  // Handle Recall
  const handleExecuteRecall = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!recallQuery.trim()) return;

    setIsRecalling(true);
    setTimeout(() => {
      const results = store.hindsightEngine.recall(recallQuery, selectedBank);
      setRecalledResults(results.memories);
      setIsRecalling(false);
    }, 400);
  };

  // Handle Reflect
  const handleExecuteReflect = () => {
    const comp = competitors.find((c) => c.id === reflectCompetitorId) || competitors[0];
    if (!comp) return;

    setIsReflecting(true);
    setTimeout(() => {
      const res = store.hindsightEngine.reflect(comp.id, comp.name, comp.industry);
      setLatestSynthesizedReflection(res);
      setIsReflecting(false);
    }, 600);
  };

  const auditLogs = store.hindsightEngine.getAuditLog();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23211a] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-amber-400" />
            Hindsight Long-Term Memory Explorer
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Visual inspection engine for partitioned memory banks, semantic recall queries, and longitudinal reflection syntheses.
          </p>
        </div>

        <button
          onClick={onTriggerDemo}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/15 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Play className="h-4 w-4 fill-amber-300" />
          <span>Interactive 10-Step Walkthrough</span>
        </button>
      </div>

      {/* Visual Workflow Pipeline Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-[#0b0c10] to-yellow-950/20 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold tracking-wider text-amber-300 uppercase flex items-center gap-1.5 font-mono">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            The 5-Stage Cognitive Memory Workflow
          </span>
          <span className="text-xs text-stone-400">Partitioned Isolated Memory Banks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { step: '1. OBSERVATION', desc: 'Raw verified telemetry & source URLs', color: 'border-[#23211a] bg-[#0e1017]' },
            { step: '2. RETAIN', desc: 'Normalized semantic ingestion into bank', color: 'border-amber-500/35 bg-amber-950/20 text-amber-300' },
            { step: '3. RECALL', desc: 'Temporal & semantic similarity query', color: 'border-yellow-500/35 bg-yellow-950/20 text-yellow-300' },
            { step: '4. REFLECT', desc: 'Multi-memory pattern reasoning', color: 'border-amber-400/40 bg-amber-950/30 text-amber-200' },
            { step: '5. INSIGHT', desc: 'Evidence-backed executive strategy', color: 'border-amber-300/40 bg-amber-900/20 text-amber-100' },
          ].map((item, idx) => (
            <div key={idx} className={`rounded-xl border p-3 flex flex-col justify-between ${item.color}`}>
              <div className="text-xs font-bold font-mono">{item.step}</div>
              <div className="text-[10px] text-stone-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Bank Selector & Interactive Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Bank Selector & Operations */}
        <div className="space-y-4">
          {/* Bank Selector */}
          <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200/60 font-mono flex items-center gap-1.5">
              <Database className="h-4 w-4 text-amber-400" />
              Partitioned Memory Banks
            </h3>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              <button
                onClick={() => setSelectedBank('all')}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  selectedBank === 'all'
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/40'
                    : 'text-stone-400 hover:bg-[#141622] hover:text-white'
                }`}
              >
                <span>All Memory Banks</span>
                <span className="rounded-full bg-[#181a26] border border-[#2b281f] px-1.5 py-0.5 text-[10px] text-amber-200/80">
                  {memories.length}
                </span>
              </button>

              {competitors.map((comp) => {
                const count = memories.filter((m) => m.competitorId === comp.id || m.bankId === `competra-${comp.id}`).length;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedBank(comp.id)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                      selectedBank === comp.id
                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/40 font-semibold'
                        : 'text-stone-400 hover:bg-[#141622] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: comp.brandColor || '#d4af37' }}
                      />
                      <span className="truncate">competra-{comp.id}</span>
                    </div>
                    <span className="rounded-full bg-[#181a26] border border-[#2b281f] px-1.5 py-0.5 text-[10px] text-stone-300">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Reflection Panel */}
          <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-mono">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Synthesize Strategic Reflection
            </h3>
            <p className="text-xs text-stone-400">
              Run Hindsight cognitive reflection across all accumulated memories in a competitor's bank.
            </p>

            <div className="space-y-2">
              <select
                value={reflectCompetitorId}
                onChange={(e) => setReflectCompetitorId(e.target.value)}
                className="w-full rounded-xl border border-[#23211a] bg-[#060709] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {competitors.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0b0c10]">
                    {c.name} ({c.industry})
                  </option>
                ))}
              </select>

              <button
                onClick={handleExecuteReflect}
                disabled={isReflecting}
                className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Brain className="h-4 w-4" />
                <span>{isReflecting ? 'Synthesizing Patterns...' : 'Execute Hindsight Reflect'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Interactive Recall & Memories Stream */}
        <div className="lg:col-span-2 space-y-5">
          {/* Interactive Semantic Recall Search Box */}
          <form
            onSubmit={handleExecuteRecall}
            className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-4 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                <Search className="h-4 w-4 text-amber-400" />
                Interactive Hindsight Recall Query
              </span>
              <span className="text-[11px] text-stone-400">Semantic & Temporal Matching</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={recallQuery}
                onChange={(e) => setRecallQuery(e.target.value)}
                placeholder="Query memories: e.g. 'holiday pricing discounts', 'autonomous driving', 'neural silicon'"
                className="flex-1 rounded-xl border border-[#23211a] bg-[#060709] px-3 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isRecalling}
                className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-xs font-bold text-stone-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer disabled:opacity-50"
              >
                {isRecalling ? 'Recalling...' : 'Recall'}
              </button>
            </div>

            {/* Quick Query Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-stone-500">Try queries:</span>
              {[
                'preemptive price cuts',
                'neural silicon architecture',
                'foldable device pricing',
                'autonomous driving europe',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setRecallQuery(q);
                    const res = store.hindsightEngine.recall(q, selectedBank);
                    setRecalledResults(res.memories);
                  }}
                  className="rounded-lg border border-[#2b281f] bg-[#141622] px-2 py-0.5 text-[11px] text-stone-400 hover:border-amber-500/40 hover:text-white cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </form>

          {/* Latest Reflection Card if generated */}
          {latestSynthesizedReflection && (
            <div className="rounded-2xl border border-amber-500/40 bg-[#0e1017] p-5 shadow-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/35 font-mono">
                  {latestSynthesizedReflection.patternType}
                </span>
                <span className="text-xs text-stone-400">{latestSynthesizedReflection.timeframe}</span>
              </div>

              <h4 className="text-base font-bold text-white">{latestSynthesizedReflection.title}</h4>
              <p className="text-xs text-stone-200 leading-relaxed">{latestSynthesizedReflection.synthesis}</p>

              <div className="rounded-xl bg-[#141622] p-3 text-xs text-amber-300 border border-[#23211a]">
                <span className="font-semibold text-stone-400">Strategic Recommendation: </span>
                {latestSynthesizedReflection.strategicRecommendation}
              </div>
            </div>
          )}

          {/* Recalled results list or Default Retained Memories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/60 font-mono">
                {recalledResults ? `Ranked Recall Results (${recalledResults.length})` : `Retained Memories in Bank (${filteredMemories.length})`}
              </h4>

              {recalledResults && (
                <button
                  onClick={() => setRecalledResults(null)}
                  className="text-xs text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Show All Bank Memories
                </button>
              )}
            </div>

            {(recalledResults || filteredMemories).map((mem) => (
              <div
                key={mem.id}
                className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-4.5 space-y-2.5 hover:border-amber-500/30 transition-all shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{mem.competitorName}</span>
                    <span className="rounded bg-[#181a26] px-2 py-0.5 text-[10px] text-amber-300 font-medium border border-[#2b281f]">
                      Bank: {mem.bankId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {mem.relevanceScore !== undefined && (
                      <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-xs font-bold text-amber-300">
                        Score: {(mem.relevanceScore * 100).toFixed(0)}%
                      </span>
                    )}
                    <span className="text-[11px] text-stone-400 font-mono">
                      {new Date(mem.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-stone-100">{mem.content}</p>
                <p className="text-xs text-stone-400 leading-relaxed">{mem.contextSummary}</p>

                {mem.longitudinalPattern && (
                  <div className="rounded-xl bg-[#141622] border border-[#2b281f] p-2.5 text-xs text-amber-200">
                    <span className="font-bold text-amber-400 font-mono">Longitudinal Precedent: </span>
                    {mem.longitudinalPattern}
                  </div>
                )}

                {mem.matchReason && (
                  <div className="text-[11px] text-amber-400/90 font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    {mem.matchReason}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {mem.semanticTags.map((t, idx) => (
                      <span key={idx} className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={mem.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Source Citations <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
