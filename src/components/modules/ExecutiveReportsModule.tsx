import React, { useState } from 'react';
import { Competitor, Observation, HindsightMemory, ReflectionInsight, IndustryType } from '../../types';
import { store } from '../../services/store';
import { FileText, Printer, Download, Sparkles, Brain, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ExecutiveReportsModuleProps {
  competitors: Competitor[];
  observations: Observation[];
  activeIndustry: IndustryType;
}

export const ExecutiveReportsModule: React.FC<ExecutiveReportsModuleProps> = ({
  competitors,
  observations,
  activeIndustry,
}) => {
  const [reportPeriod, setReportPeriod] = useState('Weekly Strategic Briefing');

  const reflections: ReflectionInsight[] = store.hindsightEngine.getReflections();
  const criticalObs = observations.filter((o) => o.importance === 'Critical' || o.importance === 'High');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ['Competitor', 'Industry', 'Category', 'Headline', 'Date', 'Importance', 'Source'];
    const rows = observations.map((o) => [
      `"${o.competitorName}"`,
      `"${o.industry}"`,
      `"${o.category}"`,
      `"${o.headline.replace(/"/g, '""')}"`,
      `"${o.date}"`,
      `"${o.importance}"`,
      `"${o.sourceUrl}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `competra_intelligence_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23211a] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-400" />
            Executive Strategic Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Board-ready synthesis digests, longitudinal telemetry reviews, and exportable data ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#23211a] bg-[#141620] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-[#1a1c28] hover:text-amber-300 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl gold-gradient-btn px-4 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Executive Report Document */}
      <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-8 shadow-2xl space-y-8 max-w-4xl mx-auto print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b border-[#23211a] pb-6 print:border-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-amber-400 print:text-black">COMPETRA AI</span>
              <span className="text-xs font-mono text-slate-400">| STRATEGIC INTELLIGENCE DOSSIER</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Date: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white mt-4 print:text-black">
            Executive Competitive Trajectory Briefing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Focus Vertical: <strong className="text-slate-200 print:text-black">{activeIndustry}</strong> • Monitored Cohort: {competitors.map((c) => c.name).join(', ')}
          </p>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            1. Executive Trajectory Summary
          </h3>
          <p className="text-xs text-slate-200 print:text-black leading-relaxed">
            During the monitored period, competitive moves across the {activeIndustry} cohort exhibited intensified margin defense and preemptive discounting. Hindsight memory synthesis indicates that primary competitors are consistently front-running rival hardware announcements by 14–21 days with promotional incentives to secure distributor shelf space and carrier retail priority.
          </p>
        </div>

        {/* Section 2: High-Priority Strategic Signals */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 print:text-black flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" />
            2. Critical Strategic Deviations
          </h3>

          <div className="space-y-2">
            {criticalObs.slice(0, 4).map((obs) => (
              <div
                key={obs.id}
                className="rounded-xl border border-[#23211a] bg-[#07080b] p-3 text-xs space-y-1 print:border-slate-300 print:bg-slate-50"
              >
                <div className="flex items-center justify-between font-bold text-white print:text-black">
                  <span>{obs.competitorName} — {obs.category}</span>
                  <span className="text-slate-400 font-normal">{obs.date}</span>
                </div>
                <p className="text-slate-300 print:text-slate-800">{obs.headline}</p>
                <div className="text-[11px] text-slate-400">Verified Citation: {obs.sourceName}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Longitudinal Hindsight Reflection Insights */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-amber-400" />
            3. Longitudinal Hindsight Pattern Syntheses
          </h3>

          <div className="space-y-2.5">
            {reflections.slice(0, 3).map((ref) => (
              <div
                key={ref.id}
                className="rounded-xl border border-amber-500/20 bg-[#141620] p-3.5 space-y-1.5 text-xs print:border-slate-300 print:bg-slate-50"
              >
                <div className="flex items-center justify-between font-bold text-amber-300 print:text-black">
                  <span>{ref.title} ({ref.competitorName})</span>
                  <span className="text-slate-400 font-normal">{ref.patternType}</span>
                </div>
                <p className="text-slate-300 print:text-slate-800 leading-relaxed">{ref.synthesis}</p>
                <div className="pt-1 text-amber-300 print:text-slate-900 font-medium">
                  Recommendation: {ref.strategicRecommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-6 border-t border-[#23211a] text-[11px] text-slate-500 print:border-slate-300 flex items-center justify-between">
          <span>CONFIDENTIAL — FOR INTERNAL STRATEGY & EXECUTIVE USE ONLY</span>
          <span>COMPETRA AI PLATFORM</span>
        </div>
      </div>
    </div>
  );
};
