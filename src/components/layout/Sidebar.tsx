import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Columns,
  Rss,
  TrendingDown,
  Layers,
  Milestone,
  Radar,
  Network,
  Brain,
  MessageSquareText,
  Sliders,
  FileCheck2,
  Swords,
  FileText,
} from 'lucide-react';

export type ModuleKey =
  | 'overview'
  | 'competitors'
  | 'comparison'
  | 'feed'
  | 'pricing'
  | 'products'
  | 'timeline'
  | 'radar'
  | 'knowledge'
  | 'hindsight'
  | 'chat'
  | 'simulator'
  | 'swot'
  | 'battlecards'
  | 'reports';

interface SidebarProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  competitorsCount: number;
  observationsCount: number;
  memoriesCount: number;
}

interface NavItem {
  key: ModuleKey;
  label: string;
  icon: any;
  badge?: number;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  competitorsCount,
  observationsCount,
  memoriesCount,
}) => {
  const navSections: NavSection[] = [
    {
      group: 'Core Intelligence',
      items: [
        { key: 'overview', label: 'Intelligence Overview', icon: LayoutDashboard },
        { key: 'competitors', label: 'Competitor Watchlist', icon: Building2, badge: competitorsCount },
        { key: 'comparison', label: 'Competitor Comparison', icon: Columns },
        { key: 'feed', label: 'Intelligence Feed', icon: Rss, badge: observationsCount },
      ],
    },
    {
      group: 'Longitudinal Memory',
      items: [
        { key: 'hindsight', label: 'Hindsight Explorer', icon: Brain, badge: memoriesCount, highlight: true },
        { key: 'chat', label: 'AI Intelligence Chat', icon: MessageSquareText },
        { key: 'timeline', label: 'Strategy Timeline', icon: Milestone },
        { key: 'radar', label: 'Trend Radar', icon: Radar },
        { key: 'knowledge', label: 'Knowledge Graph', icon: Network },
      ],
    },
    {
      group: 'Analytics & Strategy',
      items: [
        { key: 'pricing', label: 'Price Intelligence', icon: TrendingDown },
        { key: 'products', label: 'Product Intelligence', icon: Layers },
        { key: 'simulator', label: 'Strategy Simulator', icon: Sliders },
        { key: 'swot', label: 'SWOT Analysis', icon: FileCheck2 },
        { key: 'battlecards', label: 'Battlecards', icon: Swords },
        { key: 'reports', label: 'Executive Reports', icon: FileText },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[#23211a] bg-[#07080a] flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      <div className="p-3.5 space-y-6 flex-1">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-amber-200/50">
              {sec.group}
            </h4>

            <div className="space-y-0.5 pt-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => onSelectModule(item.key)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-yellow-500/5 text-amber-300 font-semibold border border-amber-500/40 shadow-sm shadow-amber-500/15'
                        : item.highlight
                        ? 'text-amber-200/90 hover:bg-[#14151e] hover:text-amber-300'
                        : 'text-stone-400 hover:bg-[#12141c] hover:text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive
                            ? 'text-amber-400'
                            : item.highlight
                            ? 'text-amber-400'
                            : 'text-stone-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`ml-2 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950'
                            : item.highlight
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35'
                            : 'bg-[#181a24] text-stone-300 border border-[#2b281f]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Memory Status Pill */}
      <div className="p-3 border-t border-[#23211a] bg-[#090a0f]">
        <div className="rounded-xl border border-amber-500/25 bg-[#0e1017] p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              Hindsight Engine
            </span>
            <span className="text-[10px] text-amber-400 font-mono">ACTIVE</span>
          </div>
          <p className="mt-1 text-[10px] text-stone-400 leading-tight">
            Multi-bank partitioned memory active across {competitorsCount} entities.
          </p>
        </div>
      </div>
    </aside>
  );
};
