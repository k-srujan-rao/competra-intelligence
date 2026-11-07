import React, { useState } from 'react';
import { Competitor, ProductItem } from '../../types';
import { store } from '../../services/store';
import { Layers, Rocket, Check, ExternalLink } from 'lucide-react';

interface ProductIntelligenceModuleProps {
  competitors: Competitor[];
}

export const ProductIntelligenceModule: React.FC<ProductIntelligenceModuleProps> = ({
  competitors,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>('all');
  const products = store.getProducts(selectedCompId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Product & Feature Intelligence Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare flagship hardware specifications, feature differentiators, and launch lifecycles.
          </p>
        </div>

        <select
          value={selectedCompId}
          onChange={(e) => setSelectedCompId(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="all">All Competitors</option>
          {competitors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-5 space-y-4 shadow-xl hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {prod.competitorName}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">{prod.productName}</h4>
                <span className="text-xs text-slate-400">{prod.category}</span>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400">
                  ${prod.currentPrice.toLocaleString()}
                </span>
                <span className="block text-[10px] text-slate-500">Released {prod.releaseDate}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300">Feature Differentiators:</span>
              <ul className="space-y-1.5">
                {prod.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
