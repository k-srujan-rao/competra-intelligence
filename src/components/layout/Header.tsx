import React, { useState } from 'react';
import { IndustryType } from '../../types';
import { INDUSTRY_CATEGORIES } from '../../data/seedData';
import { AuthUser } from '../../services/authService';
import {
  Brain,
  PlusCircle,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Filter,
  Layers,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  activeIndustry: IndustryType;
  onSelectIndustry: (ind: IndustryType) => void;
  onOpenAddModal: () => void;
  onOpenOnboarding: () => void;
  onRunHindsightDemo: () => void;
  onResetData: () => void;
  onClearData: () => void;
  competitorsCount: number;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeIndustry,
  onSelectIndustry,
  onOpenAddModal,
  onOpenOnboarding,
  onRunHindsightDemo,
  onResetData,
  onClearData,
  competitorsCount,
  currentUser,
  onLogout,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#23211a] bg-[#07080a]/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/25 font-black tracking-tighter text-lg border border-amber-300/40">
            C
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">COMPETRA</span>
              <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/35">
                AI INTELLIGENCE
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-stone-400 tracking-wide">
              Remember Every Move. Understand Every Strategy.
            </p>
          </div>
        </div>

        {/* Center: Dynamic Industry Selector Dropdown / Pills */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#0d0f15] p-1 rounded-xl border border-[#23211a]">
          <span className="px-2 text-xs font-semibold text-stone-400 flex items-center gap-1">
            <Filter className="h-3 w-3 text-amber-400" />
            Industry:
          </span>

          <div className="flex items-center gap-1 max-w-md overflow-x-auto no-scrollbar">
            {INDUSTRY_CATEGORIES.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectIndustry(cat.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeIndustry === cat.id
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold shadow-md shadow-amber-500/25'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-[#161822]'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {/* Overflow Dropdown for other industries */}
            <div className="relative">
              <button
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                className={`rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 cursor-pointer ${
                  !INDUSTRY_CATEGORIES.slice(0, 6).some((c) => c.id === activeIndustry)
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-[#161822]'
                }`}
              >
                <span>More</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showIndustryDropdown && (
                <div className="absolute left-0 mt-2 w-52 rounded-xl border border-[#23211a] bg-[#0b0c10] p-1.5 shadow-2xl z-50">
                  {INDUSTRY_CATEGORIES.slice(6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectIndustry(cat.id);
                        setShowIndustryDropdown(false);
                      }}
                      className={`w-full text-left rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                        activeIndustry === cat.id
                          ? 'bg-amber-500/20 text-amber-300 font-semibold'
                          : 'text-stone-300 hover:bg-[#161822]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Hindsight 10-Step Interactive Demo Walkthrough */}
          <button
            onClick={onRunHindsightDemo}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/60 transition-all cursor-pointer shadow-sm shadow-amber-500/15"
            title="Run interactive 10-Step Hindsight Memory Demonstration"
          >
            <Play className="h-3.5 w-3.5 fill-amber-300" />
            <span>10-Step Demo</span>
          </button>

          {/* Add Competitor Primary CTA */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 px-3.5 py-2 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Competitor</span>
          </button>

          {/* Settings & Reset Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="rounded-xl border border-[#23211a] bg-[#0d0f15] p-2 text-stone-400 hover:border-amber-500/40 hover:text-amber-300 transition-colors cursor-pointer"
              title="Database controls & presets"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#23211a] bg-[#0b0c10] p-2 shadow-2xl z-50 space-y-1">
                <div className="px-3 py-2 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-[#23211a]">
                  Database & Storage
                </div>

                <button
                  onClick={() => {
                    onResetData();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full text-left rounded-xl px-3 py-2 text-xs text-stone-200 hover:bg-[#161822] flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Restore Sample Watchlist</span>
                </button>

                <button
                  onClick={() => {
                    onOpenOnboarding();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full text-left rounded-xl px-3 py-2 text-xs text-stone-200 hover:bg-[#161822] flex items-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-amber-300" />
                  <span>Restart Onboarding Tour</span>
                </button>

                <button
                  onClick={() => {
                    onClearData();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full text-left rounded-xl px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear All Watchlist Data</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-xl border border-[#23211a] bg-[#0d0f15] pl-2 pr-3 py-1.5 hover:border-amber-500/40 transition-colors cursor-pointer"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-600 text-[10px] font-bold text-stone-950 shadow">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-200/60 leading-tight truncate max-w-[110px]">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-stone-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#23211a] bg-[#0b0c10] p-3 shadow-2xl z-50 space-y-2">
                  <div className="border-b border-[#23211a] pb-2.5">
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-stone-400">{currentUser.email}</div>
                    <span className="mt-1.5 inline-block rounded-md bg-amber-500/15 border border-amber-500/35 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      {currentUser.organization}
                    </span>
                  </div>

                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left rounded-xl px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out of Console</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
