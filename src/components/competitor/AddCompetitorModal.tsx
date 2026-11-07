import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Competitor, CompetitorType, MonitoringPreference } from '../../types';
import { Building2, Globe, Sparkles, Check, AlertCircle } from 'lucide-react';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (competitorData: any) => void;
  editingCompetitor?: Competitor | null;
}

const PREDEFINED_INDUSTRIES = [
  'Technology',
  'Pharmaceuticals',
  'Healthcare',
  'Automotive',
  'E-commerce',
  'Fashion',
  'Banking and Finance',
  'Food and Beverage',
  'Telecommunications',
  'Education',
  'Real Estate',
  'Manufacturing',
  'Retail',
  'Other',
];

const COMPETITOR_TYPES: CompetitorType[] = [
  'Direct Competitor',
  'Indirect Competitor',
  'Emerging Threat',
  'Market Leader',
  'Low-Cost Disruptor',
  'Substitute / Alternate',
];

const MONITORING_PREFERENCES_LIST: MonitoringPreference[] = [
  'Price Changes',
  'Product Launches',
  'Executive Statements',
  'Marketing & Ads',
  'Patents & R&D',
  'Regulatory & Legal',
  'Partnerships & M&A',
];

const QUICK_SUGGESTIONS = [
  { name: 'Adidas', website: 'https://adidas.com', industry: 'Fashion', category: 'Sportswear & Footwear', country: 'Germany' },
  { name: 'Puma', website: 'https://puma.com', industry: 'Fashion', category: 'Athletic Lifestyle', country: 'Germany' },
  { name: 'Flipkart', website: 'https://flipkart.com', industry: 'E-commerce', category: 'Consumer Marketplace', country: 'India' },
  { name: 'Myntra', website: 'https://myntra.com', industry: 'E-commerce', category: 'Fashion E-tailer', country: 'India' },
  { name: 'Mahindra', website: 'https://mahindra.com', industry: 'Automotive', category: 'SUVs & Commercial Vehicles', country: 'India' },
  { name: 'Hyundai', website: 'https://hyundai.com', industry: 'Automotive', category: 'Passenger Mobility & EVs', country: 'South Korea' },
  { name: 'Sun Pharma', website: 'https://sunpharma.com', industry: 'Pharmaceuticals', category: 'Specialty & Generics', country: 'India' },
  { name: 'Dr. Reddy’s', website: 'https://drreddys.com', industry: 'Pharmaceuticals', category: 'Active Pharmaceutical Ingredients', country: 'India' },
  { name: 'Microsoft', website: 'https://microsoft.com', industry: 'Technology', category: 'Enterprise Cloud & Copilot AI', country: 'United States' },
];

export const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCompetitor,
}) => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [customIndustry, setCustomIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('United States');
  const [productCategory, setProductCategory] = useState('');
  const [competitorType, setCompetitorType] = useState<CompetitorType>('Direct Competitor');
  const [monitoringPreferences, setMonitoringPreferences] = useState<MonitoringPreference[]>([
    'Price Changes',
    'Product Launches',
    'Executive Statements',
  ]);
  const [brandColor, setBrandColor] = useState('#0071e3');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingCompetitor) {
      setName(editingCompetitor.name);
      setWebsite(editingCompetitor.website);
      if (PREDEFINED_INDUSTRIES.includes(editingCompetitor.industry)) {
        setIndustry(editingCompetitor.industry);
        setCustomIndustry(editingCompetitor.customIndustry || '');
      } else {
        setIndustry('Other');
        setCustomIndustry(editingCompetitor.industry);
      }
      setDescription(editingCompetitor.description);
      setCountry(editingCompetitor.country);
      setProductCategory(editingCompetitor.productCategory);
      setCompetitorType(editingCompetitor.competitorType);
      setMonitoringPreferences(editingCompetitor.monitoringPreferences);
      setBrandColor(editingCompetitor.brandColor || '#0071e3');
    } else {
      resetForm();
    }
  }, [editingCompetitor, isOpen]);

  const resetForm = () => {
    setName('');
    setWebsite('');
    setIndustry('Technology');
    setCustomIndustry('');
    setDescription('');
    setCountry('United States');
    setProductCategory('');
    setCompetitorType('Direct Competitor');
    setMonitoringPreferences(['Price Changes', 'Product Launches', 'Executive Statements']);
    setBrandColor('#0071e3');
    setErrors({});
  };

  const handleApplySuggestion = (sug: typeof QUICK_SUGGESTIONS[0]) => {
    setName(sug.name);
    setWebsite(sug.website);
    setIndustry(sug.industry);
    setProductCategory(sug.category);
    setCountry(sug.country);
    setDescription(`Major competitor operating in ${sug.industry} specializing in ${sug.category}.`);
  };

  const togglePreference = (pref: MonitoringPreference) => {
    if (monitoringPreferences.includes(pref)) {
      setMonitoringPreferences(monitoringPreferences.filter((p) => p !== pref));
    } else {
      setMonitoringPreferences([...monitoringPreferences, pref]);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Company name is required';
    if (!website.trim()) newErrors.website = 'Website URL is required';
    if (industry === 'Other' && !customIndustry.trim()) {
      newErrors.customIndustry = 'Please specify custom industry';
    }
    if (!productCategory.trim()) newErrors.productCategory = 'Product category is required';
    if (!description.trim()) newErrors.description = 'Brief description is required';
    if (monitoringPreferences.length === 0) {
      newErrors.preferences = 'Select at least one monitoring preference';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalIndustry = industry === 'Other' && customIndustry.trim() ? customIndustry.trim() : industry;

    onSave({
      name: name.trim(),
      website: website.trim().startsWith('http') ? website.trim() : `https://${website.trim()}`,
      industry: finalIndustry,
      customIndustry: industry === 'Other' ? customIndustry.trim() : undefined,
      description: description.trim(),
      country: country.trim(),
      productCategory: productCategory.trim(),
      competitorType,
      monitoringPreferences,
      monitoringEnabled: true,
      brandColor,
      threatLevel: competitorType === 'Market Leader' || competitorType === 'Direct Competitor' ? 'High' : 'Moderate',
    });

    onClose();
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCompetitor ? `Edit Competitor: ${editingCompetitor.name}` : 'Add New Competitor or Company'}
      subtitle="Register any competitor across any industry to begin automated intelligence ingestion & Hindsight memory retention."
      maxWidth="max-w-3xl"
    >
      {/* Quick suggestions on fresh adds */}
      {!editingCompetitor && (
        <div className="rounded-xl border border-[#23211a] bg-[#0e1017] p-3 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Quick Presets (Multi-Industry):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((sug) => (
              <button
                key={sug.name}
                type="button"
                onClick={() => handleApplySuggestion(sug)}
                className="rounded-lg border border-[#2b281f] bg-[#141622] px-2.5 py-1 text-xs text-stone-300 hover:border-amber-500/50 hover:bg-[#1c1f2e] hover:text-amber-200 transition-all cursor-pointer"
              >
                + {sug.name} ({sug.industry})
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name and Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Adidas, Tesla, Sun Pharma"
                className={`w-full rounded-xl border bg-[#07080b] pl-9 pr-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-1 ${
                  errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-[#23211a] focus:border-amber-400 focus:ring-amber-400'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Company Website <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://company.com"
                className={`w-full rounded-xl border bg-[#07080b] pl-9 pr-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-1 ${
                  errors.website ? 'border-rose-500 focus:ring-rose-500' : 'border-[#23211a] focus:border-amber-400 focus:ring-amber-400'
                }`}
              />
            </div>
            {errors.website && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.website}</p>}
          </div>
        </div>

        {/* Row 2: Industry & Custom Industry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Industry <span className="text-amber-400">*</span>
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-xl border border-[#23211a] bg-[#07080b] px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {PREDEFINED_INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} className="bg-[#0b0c10] text-white">
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              {industry === 'Other' ? 'Specify Custom Industry *' : 'Custom Industry Override (Optional)'}
            </label>
            <input
              type="text"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              placeholder={industry === 'Other' ? 'e.g. Aerospace, Quantum Computing, Agritech' : 'Leave blank to use selected industry'}
              className={`w-full rounded-xl border bg-[#07080b] px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-1 ${
                errors.customIndustry ? 'border-rose-500 focus:ring-rose-500' : 'border-[#23211a] focus:border-amber-400 focus:ring-amber-400'
              }`}
            />
            {errors.customIndustry && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.customIndustry}</p>}
          </div>
        </div>

        {/* Row 3: Product Category, Country & Brand Accent Color */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Product Category <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              placeholder="e.g. Electric SUVs, Generic Biosimilars"
              className={`w-full rounded-xl border bg-[#07080b] px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-1 ${
                errors.productCategory ? 'border-rose-500 focus:ring-rose-500' : 'border-[#23211a] focus:border-amber-400 focus:ring-amber-400'
              }`}
            />
            {errors.productCategory && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.productCategory}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Country or Region
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Germany, India, Global"
              className="w-full rounded-xl border border-[#23211a] bg-[#07080b] px-3 py-2 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Brand Badge Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="h-9 w-12 rounded-lg border border-[#23211a] bg-[#0b0c10] cursor-pointer p-0.5"
              />
              <span className="text-xs font-mono text-amber-200/70">{brandColor}</span>
            </div>
          </div>
        </div>

        {/* Row 4: Competitor Type */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
            Competitor Classification Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COMPETITOR_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCompetitorType(type)}
                className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                  competitorType === type
                    ? 'border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-sm shadow-amber-500/20'
                    : 'border-[#23211a] bg-[#0e1017] text-stone-400 hover:border-[#332f25] hover:text-stone-200'
                }`}
              >
                <span>{type}</span>
                {competitorType === type && <Check className="h-3.5 w-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Row 5: Description */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
            Company Description & Positioning <span className="text-amber-400">*</span>
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of market position, core moats, and target demographic..."
            className={`w-full rounded-xl border bg-[#07080b] px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-1 ${
              errors.description ? 'border-rose-500 focus:ring-rose-500' : 'border-[#23211a] focus:border-amber-400 focus:ring-amber-400'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
        </div>

        {/* Row 6: Monitoring Preferences */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
            Continuous Monitoring Vectors (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {MONITORING_PREFERENCES_LIST.map((pref) => {
              const isSelected = monitoringPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                      : 'border-[#23211a] bg-[#0e1017] text-stone-400 hover:border-[#332f25] hover:text-stone-200'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-stone-600'}`} />
                  {pref}
                </button>
              );
            })}
          </div>
          {errors.preferences && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.preferences}</p>}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#23211a]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#23211a] px-4 py-2 text-sm font-medium text-stone-300 hover:bg-[#161824] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 px-5 py-2 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all cursor-pointer"
          >
            {editingCompetitor ? 'Save Competitor Updates' : 'Add Competitor to Watchlist'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
