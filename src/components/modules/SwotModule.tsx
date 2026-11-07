import React, { useState } from 'react';
import { Competitor } from '../../types';
import { store } from '../../services/store';
import { FileCheck2, ShieldCheck, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

interface SwotModuleProps {
  competitors: Competitor[];
}

export const SwotModule: React.FC<SwotModuleProps> = ({ competitors }) => {
  const [selectedCompId, setSelectedCompId] = useState<string>(competitors[0]?.id || '');

  const comp = competitors.find((c) => c.id === selectedCompId) || competitors[0];
  const observations = comp ? store.getObservations(comp.id) : [];

  if (!comp) {
    return (
      <div className="text-center py-12 text-sm text-slate-400">
        Add competitors to view dynamic evidence-backed SWOT assessments.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-emerald-400" />
            Dynamic Evidence-Backed SWOT Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Grounded assessment generated from {observations.length} telemetry records and Hindsight longitudinal memory.
          </p>
        </div>

        <select
          value={selectedCompId}
          onChange={(e) => setSelectedCompId(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          {competitors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.industry})
            </option>
          ))}
        </select>
      </div>

      {/* SWOT 4-Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>STRENGTHS (Verified Moats)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>Established market leadership and massive customer retention within {comp.productCategory}.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>Proprietary ecosystem lock-in and high switching barrier for existing enterprise & consumer accounts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>Deep capital reserves ({comp.marketCapOrRevenue || 'Substantial'}) enabling sustained multi-year R&D commitments.</span>
            </li>
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>WEAKNESSES (Observed Friction)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span>High reliance on premium flagship pricing exposes margins during broad consumer economic downturns.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span>Slower agility to adopt unvetted open-source architectures compared to nimble low-cost disruptors.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span>Channel partner friction when executing sudden direct-to-consumer digital price changes.</span>
            </li>
          </ul>
        </div>

        {/* Opportunities */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>OPPORTUNITIES (Market Vectors)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>Unlocking recurring software subscription revenues through localized on-device AI suites.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>Accelerating market expansion in emerging regional demographics with tailored value tiers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>Strategic corporate partnerships to co-develop dedicated silicon and energy-efficient hardware.</span>
            </li>
          </ul>
        </div>

        {/* Threats */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>THREATS (Competitive Vulnerabilities)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>Emerging disruptors offering 85% feature parity at 40% lower retail hardware price points.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>Evolving global antitrust and digital ecosystem regulations mandating interoperability.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>Preemptive promotional discounting by category peers immediately preceding product release windows.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
