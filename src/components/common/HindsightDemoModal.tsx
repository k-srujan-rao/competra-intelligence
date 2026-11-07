import React, { useState } from 'react';
import { Modal } from './Modal';
import { store } from '../../services/store';
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  Database,
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  Zap,
} from 'lucide-react';

interface HindsightDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishDemo: () => void;
}

export const HindsightDemoModal: React.FC<HindsightDemoModalProps> = ({
  isOpen,
  onClose,
  onFinishDemo,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: 'Verify Samsung in Watchlist',
      actionTitle: 'Target Competitor Partition Verified',
      description: 'Hindsight checks for partitioned memory bank `competra-samsung` in active storage.',
      output: 'Bank `competra-samsung` located. Status: Active. Target: Consumer hardware & foldables.',
    },
    {
      num: 2,
      title: 'Collect Initial Labelled Observations',
      actionTitle: 'Ingest Baseline Telemetry (Galaxy S24 & A55)',
      description: 'Normalized data collected: Flagship release at $1299 and mid-tier promotional discount at $439.',
      output: 'Obs-01: Galaxy S24 Ultra ($1299). Obs-02: Galaxy A55 discounted by 12% to $439.',
    },
    {
      num: 3,
      title: 'RETAIN Initial Observations in Hindsight',
      actionTitle: 'Executing Hindsight RETAIN Operation',
      description: 'Semantic vector generation, entity relationship binding, and timestamped partition indexing.',
      output: 'Memories [mem-sam-01, mem-sam-02] permanently stored in `competra-samsung` memory bank.',
    },
    {
      num: 4,
      title: 'Ingest Subsequent Move (Later Timestamp)',
      actionTitle: 'Z Fold 7 Pricing Increase (+ $100)',
      description: 'Samsung elevates ultra-premium foldable price ceiling while sweetening carrier trade-in incentives.',
      output: 'Obs-03: Galaxy Z Fold 7 priced at $1,899 (+5.5%). Trade-in credits bumped to $800.',
    },
    {
      num: 5,
      title: 'RETAIN New Information in Hindsight',
      actionTitle: 'Executing Hindsight RETAIN Operation',
      description: 'Second temporal data point retained. Hindsight connects pricing delta with previous baseline observations.',
      output: 'Memory [mem-sam-03] stored. Temporal interval computed: +180 days from initial baseline.',
    },
    {
      num: 6,
      title: 'Formulate Executive Strategic Query',
      actionTitle: 'User Query: "What changes has Samsung made over this period?"',
      description: 'Standard AI assistants without memory only answer from latest web scrape. COMPETRA AI queries Hindsight.',
      output: 'Query Tokenized: ["samsung", "changes", "pricing", "foldables", "strategy"]. Target Bank: `competra-samsung`.',
    },
    {
      num: 7,
      title: 'RECALL Relevant Historical Memories',
      actionTitle: 'Executing Hindsight RECALL Operation',
      description: 'Semantic matching + temporal recency scoring across `competra-samsung` memory bank.',
      output: 'Recall Score 0.94 (Galaxy A56 Discount) • Recall Score 0.91 (Z Fold 7 Premium Hike) • Recall Score 0.88 (S25 Roadmap).',
    },
    {
      num: 8,
      title: 'REFLECT on Accumulated Memories',
      actionTitle: 'Executing Hindsight REFLECT Operation',
      description: 'Reasoning across memories to synthesize longitudinal patterns rather than reciting isolated headlines.',
      output: 'Synthesized Pattern: Dual-Track Monetization. Squeezing mid-tier rivals with 12% cuts while expanding ultra-flagship margins via trade-ins.',
    },
    {
      num: 9,
      title: 'Generate Evidence-Backed Executive Answer',
      actionTitle: 'Final Grounded Intelligence Output',
      description: 'Produces structured decision-maker synthesis with verified citations and strategic recommendations.',
      output: 'Answer generated with 3 verified citations, 94% confidence indicator, and specific counter-strategy recommendation.',
    },
    {
      num: 10,
      title: 'Compare Hindsight vs Standard Single-Update Assistant',
      actionTitle: 'The Long-Term Memory Difference',
      description: 'Standard assistants suffer from session amnesia and recency bias. COMPETRA AI with Hindsight understands the entire longitudinal trajectory.',
      output: 'Demonstration complete! Memory banks and cognitive reflections remain active across all 15 platform modules.',
    },
  ];

  const current = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinishDemo();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hindsight 10-Step Interactive Memory Walkthrough"
      subtitle={`Demonstration Step ${currentStep} of 10`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Progress Bar */}
        <div className="w-full bg-[#161822] border border-[#23211a] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          />
        </div>

        {/* Step Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/35 font-bold text-sm">
            {current.num}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Stage: {current.actionTitle}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{current.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-300 leading-relaxed">{current.description}</p>

        {/* Live Simulation Output Box */}
        <div className="rounded-xl border border-[#23211a] bg-[#07080b] p-4 font-mono text-xs text-amber-300 space-y-1">
          <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
            Hindsight Telemetry Log:
          </div>
          <div className="text-stone-100">{current.output}</div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#23211a]">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-white cursor-pointer"
          >
            Exit Demo
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 px-5 py-2 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all cursor-pointer"
          >
            <span>{currentStep === 10 ? 'Complete & Open Explorer' : 'Next Demonstration Step'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
