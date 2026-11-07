import React, { useState } from 'react';
import { Competitor, ProductItem, Observation } from '../../types';
import { store } from '../../services/store';
import { Network, Sparkles, Building2, Layers, DollarSign, Zap } from 'lucide-react';

interface KnowledgeGraphModuleProps {
  competitors: Competitor[];
}

export const KnowledgeGraphModule: React.FC<KnowledgeGraphModuleProps> = ({ competitors }) => {
  const [selectedNode, setSelectedNode] = useState<{ id: string; label: string; type: string; details?: string } | null>(null);

  const products = store.getProducts();
  const priceAlerts = store.getObservations().filter((o) => o.priceDelta);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23211a] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="h-5 w-5 text-amber-400" />
            Competitive Knowledge Graph
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual relational network linking Monitored Enterprises, Flagship SKUs, Architectural Features, and Price Moves.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Competitors
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" /> Products
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Price Deltas
          </span>
        </div>
      </div>

      {/* Interactive SVG Network Canvas */}
      <div className="relative rounded-2xl border border-[#23211a] bg-[#0b0c10] p-6 shadow-2xl overflow-hidden min-h-[460px] flex items-center justify-center">
        {/* SVG Visualization */}
        <svg className="w-full h-96" viewBox="0 0 800 400">
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#b8860b" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Central Hub */}
          <line x1="400" y1="200" x2="200" y2="100" stroke="url(#edgeGrad)" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="400" y1="200" x2="600" y2="100" stroke="url(#edgeGrad)" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="400" y1="200" x2="200" y2="300" stroke="url(#edgeGrad)" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="400" y1="200" x2="600" y2="300" stroke="url(#edgeGrad)" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Hub Node */}
          <circle cx="400" cy="200" r="32" fill="#181408" stroke="#d4af37" strokeWidth="2" />
          <text x="400" y="196" textAnchor="middle" fill="#f5e29f" fontSize="10" fontWeight="bold">
            HINDSIGHT
          </text>
          <text x="400" y="210" textAnchor="middle" fill="#d4af37" fontSize="9">
            MEMORY HUB
          </text>

          {/* Competitor Nodes dynamically positioned */}
          {competitors.slice(0, 4).map((comp, idx) => {
            const positions = [
              { cx: 200, cy: 100, labelY: 90 },
              { cx: 600, cy: 100, labelY: 90 },
              { cx: 200, cy: 300, labelY: 330 },
              { cx: 600, cy: 300, labelY: 330 },
            ];
            const pos = positions[idx];
            const isSelected = selectedNode?.id === comp.id;

            return (
              <g
                key={comp.id}
                onClick={() =>
                  setSelectedNode({
                    id: comp.id,
                    label: comp.name,
                    type: 'Competitor Enterprise',
                    details: `${comp.industry} • Threat Level: ${comp.threatLevel}. ${comp.description}`,
                  })
                }
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r={isSelected ? 26 : 22}
                  fill={comp.brandColor || '#d4af37'}
                  stroke={isSelected ? '#f5e29f' : '#2b281f'}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <text
                  x={pos.cx}
                  y={pos.cy + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {comp.name.substring(0, 3).toUpperCase()}
                </text>
                <text
                  x={pos.cx}
                  y={pos.labelY}
                  textAnchor="middle"
                  fill="#f5e29f"
                  fontSize="11"
                  fontWeight="600"
                >
                  {comp.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Floating Overlay */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 rounded-2xl border border-[#23211a] bg-[#07080a]/95 p-4 shadow-2xl backdrop-blur-md animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {selectedNode.type}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-500 hover:text-amber-300"
              >
                ✕
              </button>
            </div>
            <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">{selectedNode.details}</p>
          </div>
        )}
      </div>
    </div>
  );
};
