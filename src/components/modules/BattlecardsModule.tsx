import React, { useState } from 'react';
import { Competitor } from '../../types';
import { Swords, ShieldAlert, Target, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BattlecardsModuleProps {
  competitors: Competitor[];
}

export const BattlecardsModule: React.FC<BattlecardsModuleProps> = ({ competitors }) => {
  const [selectedCompId, setSelectedCompId] = useState<string>(competitors[0]?.id || '');

  const comp = competitors.find((c) => c.id === selectedCompId) || competitors[0];

  if (!comp) {
    return (
      <div className="text-center py-12 text-sm text-slate-400">
        Add competitors to generate tactical sales battlecards.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Swords className="h-5 w-5 text-amber-400" />
            Competitive Battlecards
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Actionable tactical briefing cards equipping revenue teams to win head-to-head deals against {comp.name}.
          </p>
        </div>

        <select
          value={selectedCompId}
          onChange={(e) => setSelectedCompId(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          {competitors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} Battlecard
            </option>
          ))}
        </select>
      </div>

      {/* Main Battlecard Document */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-6 shadow-2xl space-y-6">
        {/* Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white shadow-md"
              style={{ backgroundColor: comp.brandColor || '#0071e3' }}
            >
              {comp.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">How to Displace {comp.name}</h3>
              <p className="text-xs text-slate-400">
                Category: <strong className="text-slate-300">{comp.productCategory}</strong> • Threat Level:{' '}
                <strong className="text-amber-400">{comp.threatLevel}</strong>
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300 font-semibold">
            Sales Readiness: Verified Active
          </div>
        </div>

        {/* 3 Core Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Attack Vectors / Vulnerabilities */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Target className="h-4 w-4" />
              <span>Vulnerabilities to Target</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Heavy premium margin dependence creates reluctance to match flexible enterprise volume terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Walled garden ecosystem causes integration friction for heterogeneous multi-vendor fleets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Slow response times for custom enterprise feature requests and tailored APIs.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Landmines to Avoid */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              <span>Landmines to Avoid</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>Do NOT debate consumer brand recognition or sheer raw marketing budget.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>Avoid head-to-head comparison on proprietary closed-loop hardware benchmarks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>Do not let the prospect compare entry-level pricing without calculating full multi-year TCO.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: The Winning Pitch */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Zap className="h-4 w-4" />
              <span>How We Win (Our Moat)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Position our solution as the open, flexible, agile platform that offers 35% superior total cost of ownership, zero vendor lock-in, and instant cross-platform compatibility.
            </p>
            <div className="rounded-lg bg-slate-900/80 p-2 text-xs text-amber-300 font-medium border border-slate-800">
              "You own your data, your integrations, and your roadmap—without being held hostage to proprietary price increases."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
