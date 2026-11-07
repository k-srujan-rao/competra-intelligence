import React, { useState } from 'react';
import { Competitor } from '../../types';
import { Sliders, Sparkles, Brain, ShieldAlert, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface StrategySimulatorModuleProps {
  competitors: Competitor[];
}

export const StrategySimulatorModule: React.FC<StrategySimulatorModuleProps> = ({
  competitors,
}) => {
  const [selectedAction, setSelectedAction] = useState('price-cut');
  const [targetCompetitorId, setTargetCompetitorId] = useState<string>(competitors[0]?.id || '');
  const [simulationResult, setSimulationResult] = useState<{
    scenarioName: string;
    targetRival: string;
    predictedReactions: Array<{ competitor: string; reaction: string; probability: number; rationale: string }>;
    strategicRecommendation: string;
    precedentCitation: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const targetComp = competitors.find((c) => c.id === targetCompetitorId) || competitors[0];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      let scenarioName = '10% Price Reduction Across Flagship SKUs';
      let reactions: any[] = [];
      let recommendation = '';
      let precedent = '';

      if (selectedAction === 'price-cut') {
        scenarioName = '10% Tactical Price Cut Across Mid-Tier SKUs';
        reactions = [
          {
            competitor: targetComp?.name || 'Rival Enterprise',
            reaction: 'Carrier Trade-In Subsidy Increase ($150 bonus)',
            probability: 88,
            rationale: 'Hindsight precedent shows rival avoids direct MSRP cuts, relying instead on carrier trade-in incentives to maintain nominal brand value.',
          },
          {
            competitor: 'Secondary Competitors',
            reaction: 'Flash Promotional Bundling (Accessories + 1 Yr Cloud)',
            probability: 72,
            rationale: 'Historical data reflects low-margin competitors using software bundles rather than hardware price deflation.',
          },
        ];
        recommendation = 'Bundle extended 3-year warranty and prioritized customer support rather than engaging in a race-to-the-bottom hardware price war.';
        precedent = 'Memory Bank verified: Preemptive discounting maneuvers observed in Q4 2024 and Q4 2025.';
      } else if (selectedAction === 'feature-launch') {
        scenarioName = 'Accelerated Launch of Next-Gen On-Device AI Architecture';
        reactions = [
          {
            competitor: targetComp?.name || 'Rival Enterprise',
            reaction: 'Marketing narrative pivot highlighting enterprise privacy & model longevity',
            probability: 85,
            rationale: 'Telemetry indicates rival counters hardware leaps with messaging on software stability and 7-year update cycles.',
          },
          {
            competitor: 'Market Disruptors',
            reaction: 'Open-source benchmark comparisons released within 14 days',
            probability: 68,
            rationale: 'Disruptors regularly publish side-by-side performance tests to challenge premium flagship claims.',
          },
        ];
        recommendation = 'Emphasize real-world latency advantages and offline reliability rather than synthetic benchmark scores.';
        precedent = 'Memory Bank verified: Responses to M-series and Snapdragon announcements.';
      } else {
        scenarioName = 'Direct Geographic Expansion into Emerging Asian Markets';
        reactions = [
          {
            competitor: targetComp?.name || 'Rival Enterprise',
            reaction: 'Localized distributor rebate increases of 350-500 bps',
            probability: 91,
            rationale: 'Established regional incumbents immediately incentivize retail dealers to protect shelf space dominance.',
          },
        ];
        recommendation = 'Partner directly with indigenous digital-first retail platforms to bypass traditional dealer gatekeeping.';
        precedent = 'Memory Bank verified: Regional distribution defensive maneuvers.';
      }

      setSimulationResult({
        scenarioName,
        targetRival: targetComp?.name || 'Primary Peer',
        predictedReactions: reactions,
        strategicRecommendation: recommendation,
        precedentCitation: precedent,
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23211a] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            AI Strategy Simulator & Wargaming Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate "What-If" market maneuvers against your watchlist peers with Hindsight historical precedent validation.
          </p>
        </div>
      </div>

      {/* Simulator Control Cockpit */}
      <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-5 shadow-2xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-amber-400" />
          Configure Strategic Maneuver
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Strategic Action to Execute:
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full rounded-xl border border-[#23211a] bg-[#07080b] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="price-cut">Tactical 10% Price Reduction on Core Product Line</option>
              <option value="feature-launch">Preemptive Next-Gen AI Feature Launch</option>
              <option value="expansion">Aggressive Geographic Expansion into Rival's Home Market</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Competitor to Wargame Against:
            </label>
            <select
              value={targetCompetitorId}
              onChange={(e) => setTargetCompetitorId(e.target.value)}
              className="w-full rounded-xl border border-[#23211a] bg-[#07080b] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {competitors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.industry} • {c.competitorType})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="rounded-xl gold-gradient-btn px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Brain className="h-4 w-4" />
          <span>{isSimulating ? 'Simulating Rival Responses...' : 'Run Wargaming Simulation'}</span>
        </button>
      </div>

      {/* Simulation Result Presentation */}
      {simulationResult && (
        <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10] p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#23211a] pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Simulation Outcome Analysis
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{simulationResult.scenarioName}</h3>
            </div>
            <span className="rounded-lg bg-[#141620] border border-[#23211a] px-3 py-1 text-xs text-amber-300 font-medium">
              Target: {simulationResult.targetRival}
            </span>
          </div>

          {/* Predicted Reactions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Anticipated Competitor Counter-Maneuvers:
            </h4>

            {simulationResult.predictedReactions.map((rec, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#23211a] bg-[#07080b] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{rec.competitor}</span>
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                    {rec.probability}% Probability
                  </span>
                </div>
                <div className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                  <span>Predicted Action: {rec.reaction}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{rec.rationale}</p>
              </div>
            ))}
          </div>

          {/* Strategic Recommendation */}
          <div className="rounded-xl bg-[#141620] border border-amber-500/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>EXECUTIVE RECOMMENDATION</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {simulationResult.strategicRecommendation}
            </p>
            <div className="text-[11px] text-amber-400/80 font-mono pt-1">
              {simulationResult.precedentCitation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
