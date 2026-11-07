import React, { useState } from 'react';
import { Competitor, ProductItem, Observation } from '../../types';
import { store } from '../../services/store';
import { TrendingDown, TrendingUp, AlertTriangle, Filter, Search, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface PriceIntelligenceModuleProps {
  competitors: Competitor[];
  observations: Observation[];
}

export const PriceIntelligenceModule: React.FC<PriceIntelligenceModuleProps> = ({
  competitors,
  observations,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>('all');
  const allProducts = store.getProducts(selectedCompId);
  const priceAlerts = observations.filter((o) => o.priceDelta);

  // Prepare line chart data from product price histories
  const priceHistoryData = [
    { period: 'Q1 2025', GalaxyS25: 1299, iPhone16Pro: 1199, OnePlus13: 799, ModelY: 50490 },
    { period: 'Q2 2025', GalaxyS25: 1299, iPhone16Pro: 1199, OnePlus13: 799, ModelY: 49490 },
    { period: 'Q3 2025', GalaxyS25: 1249, iPhone16Pro: 1199, OnePlus13: 769, ModelY: 49490 },
    { period: 'Q4 2025', GalaxyS25: 1249, iPhone16Pro: 1199, OnePlus13: 769, ModelY: 48990 },
    { period: 'Q1 2026', GalaxyS25: 1199, iPhone16Pro: 1199, OnePlus13: 719, ModelY: 48990 },
    { period: 'Current', GalaxyS25: 1199, iPhone16Pro: 1199, OnePlus13: 719, ModelY: 48990 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-emerald-400" />
            Price Intelligence & Delta Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track historical SKU price points, tactical promotional discounts, and pricing anomaly flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      {/* Historical Price Trend Chart */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2">Historical Longitudinal Price Trajectory ($ USD)</h3>
        <p className="text-xs text-slate-400 mb-4">Baseline MSRP adjustments tracked across product lifecycles</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistoryData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090a0f', borderColor: '#334155', borderRadius: '12px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="GalaxyS25" stroke="#1428a0" strokeWidth={2} dot={{ r: 4 }} name="Galaxy S25 Ultra" />
              <Line type="monotone" dataKey="iPhone16Pro" stroke="#0071e3" strokeWidth={2} dot={{ r: 4 }} name="iPhone 16 Pro Max" />
              <Line type="monotone" dataKey="OnePlus13" stroke="#eb0028" strokeWidth={2} dot={{ r: 4 }} name="OnePlus 13" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Delta Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Detected Price Moves */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Detected Price Shifts & Tactical Disruption
          </h3>

          <div className="space-y-2.5">
            {priceAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No price alterations recorded.</p>
            ) : (
              priceAlerts.map((obs) => (
                <div
                  key={obs.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{obs.competitorName}</span>
                    <span className="text-[11px] text-slate-500">{obs.date}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{obs.headline}</div>
                  {obs.priceDelta && (
                    <div className="flex items-center justify-between text-xs font-bold pt-1 text-emerald-400">
                      <span>{obs.priceDelta.productName}</span>
                      <span>
                        ${obs.priceDelta.oldPrice} → ${obs.priceDelta.newPrice} ({obs.priceDelta.percentChange}%)
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monitored SKUs Matrix */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d0f17] p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            Monitored SKU Price Ledger
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allProducts.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{p.productName}</div>
                  <span className="text-[10px] text-slate-400">{p.competitorName} • {p.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">
                    ${p.currentPrice.toLocaleString()} {p.currency}
                  </div>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
