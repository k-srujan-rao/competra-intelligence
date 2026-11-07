import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { IndustryType, MonitoringPreference } from '../../types';
import { INDUSTRY_CATEGORIES } from '../../data/seedData';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Cpu,
  Car,
  ShoppingBag,
  Pill,
  Shirt,
  ShieldCheck,
  Radar,
  Zap,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { industry: IndustryType; competitors: string[]; preferences: MonitoringPreference[] }) => void;
}

const INDUSTRY_ICON_MAP: Record<string, any> = {
  Technology: Cpu,
  Automotive: Car,
  'E-commerce': ShoppingBag,
  Pharmaceuticals: Pill,
  Fashion: Shirt,
};

const SUGGESTED_COMPETITORS_BY_INDUSTRY: Record<string, string[]> = {
  Technology: ['Apple', 'Samsung', 'OnePlus', 'Google', 'Microsoft', 'Xiaomi'],
  Automotive: ['Tesla', 'Tata Motors', 'Mahindra', 'Hyundai', 'BYD', 'Rivian'],
  'E-commerce': ['Amazon', 'Flipkart', 'Shopify', 'Myntra', 'Temu', 'Alibaba'],
  Pharmaceuticals: ['Cipla', 'Sun Pharma', 'Dr. Reddy’s', 'Pfizer', 'Novartis'],
  Fashion: ['Nike', 'Adidas', 'Puma', 'Zara', 'H&M', 'Lululemon'],
};

const ALL_MONITORING_PREFERENCES: MonitoringPreference[] = [
  'Price Changes',
  'Product Launches',
  'Executive Statements',
  'Marketing & Ads',
  'Patents & R&D',
  'Regulatory & Legal',
  'Partnerships & M&A',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('Technology');
  const [customIndustry, setCustomIndustry] = useState('');
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(['Apple', 'Samsung']);
  const [customCompetitorInput, setCustomCompetitorInput] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<MonitoringPreference[]>([
    'Price Changes',
    'Product Launches',
    'Executive Statements',
  ]);

  const handleToggleCompetitor = (name: string) => {
    if (selectedCompetitors.includes(name)) {
      setSelectedCompetitors(selectedCompetitors.filter((c) => c !== name));
    } else {
      setSelectedCompetitors([...selectedCompetitors, name]);
    }
  };

  const handleAddCustomCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCompetitorInput.trim() && !selectedCompetitors.includes(customCompetitorInput.trim())) {
      setSelectedCompetitors([...selectedCompetitors, customCompetitorInput.trim()]);
      setCustomCompetitorInput('');
    }
  };

  const handleTogglePreference = (pref: MonitoringPreference) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleFinish = () => {
    const finalIndustry = selectedIndustry === 'Other' && customIndustry.trim() ? customIndustry.trim() : selectedIndustry;
    onComplete({
      industry: finalIndustry,
      competitors: selectedCompetitors,
      preferences: selectedPreferences,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to COMPETRA AI"
      subtitle={`Step ${step} of 4: Setup your custom competitive intelligence workspace`}
      maxWidth="max-w-3xl"
    >
      {/* Step Indicators */}
      <div className="flex items-center justify-between border-b border-[#23211a] pb-4 mb-4">
        {[
          { num: 1, title: 'Select Industry' },
          { num: 2, title: 'Add Competitors' },
          { num: 3, title: 'Monitoring Vectors' },
          { num: 4, title: 'Launch Workspace' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-md shadow-amber-500/25'
                  : step > s.num
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#141622] text-stone-500 border border-[#2b281f]'
              }`}
            >
              {step > s.num ? <Check className="h-3.5 w-3.5" /> : s.num}
            </div>
            <span
              className={`hidden sm:inline text-xs font-semibold ${
                step === s.num ? 'text-amber-300' : 'text-stone-500'
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Industry Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Choose your primary industry to personalize telemetry collectors, benchmarks, and Hindsight memory patterns:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto p-1">
            {INDUSTRY_CATEGORIES.filter((c) => c.id !== 'All').map((cat) => {
              const Icon = INDUSTRY_ICON_MAP[cat.id] || Building2;
              const isSelected = selectedIndustry === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedIndustry(cat.id)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {selectedIndustry === 'Other' && (
            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter Custom Industry Name
              </label>
              <input
                type="text"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                placeholder="e.g. Defense Tech, Renewable Energy, AgriTech"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Step 2: Add Competitors */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Select competitors to track in <strong className="text-amber-400">{selectedIndustry}</strong>, or enter your own custom companies:
          </p>

          <div className="flex flex-wrap gap-2">
            {(SUGGESTED_COMPETITORS_BY_INDUSTRY[selectedIndustry] || ['Competitor A', 'Competitor B', 'Competitor C']).map((comp) => {
              const isSelected = selectedCompetitors.includes(comp);
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => handleToggleCompetitor(comp)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{comp}</span>
                  {isSelected ? <Check className="h-3.5 w-3.5 text-amber-400" /> : <span className="text-slate-600">+</span>}
                </button>
              );
            })}
          </div>

          {/* Custom Competitor Input */}
          <form onSubmit={handleAddCustomCompetitor} className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              + Add Any Other Company / Competitor
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCompetitorInput}
                onChange={(e) => setCustomCompetitorInput(e.target.value)}
                placeholder="e.g. Any startup, private firm, or international brand"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>

          {/* Active selection summary */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Selected Watchlist ({selectedCompetitors.length}):
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedCompetitors.length === 0 ? (
                <span className="text-xs text-rose-400">Please select or add at least one competitor.</span>
              ) : (
                selectedCompetitors.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-200"
                  >
                    {c}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Monitoring Preferences */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Configure which competitive telemetry channels Hindsight will track and memorize:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ALL_MONITORING_PREFERENCES.map((pref) => {
              const isSelected = selectedPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => handleTogglePreference(pref)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`h-4 w-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold">{pref}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Ready to Launch */}
      {step === 4 && (
        <div className="space-y-4 text-center py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto shadow-xl shadow-amber-500/10">
            <Zap className="h-8 w-8" />
          </div>

          <h4 className="text-xl font-bold text-white">Your Workspace Is Ready</h4>
          <p className="max-w-md mx-auto text-xs text-slate-300 leading-relaxed">
            COMPETRA AI will continuously monitor your selected watchlist peers in <strong className="text-amber-400">{selectedIndustry}</strong>, retain strategic observations into dedicated Hindsight memory banks, and detect price & product shifts in real time.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 max-w-md mx-auto text-left text-xs space-y-2">
            <div>
              <span className="text-slate-400">Industry:</span> <strong className="text-white">{selectedIndustry}</strong>
            </div>
            <div>
              <span className="text-slate-400">Monitored Peers:</span>{' '}
              <strong className="text-amber-300">{selectedCompetitors.join(', ') || 'Default Peers'}</strong>
            </div>
            <div>
              <span className="text-slate-400">Active Vectors:</span>{' '}
              <strong className="text-emerald-300">{selectedPreferences.length} Channels Active</strong>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          Skip onboarding (configure later)
        </button>

        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
