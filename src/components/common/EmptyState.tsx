import React from 'react';
import { PlusCircle, Search, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
  type?: 'no-competitors' | 'no-results' | 'no-data';
  onLoadPresets?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  onAction,
  actionText = 'Add Your First Competitor',
  type = 'no-competitors',
  onLoadPresets,
}) => {
  const isNoCompetitors = type === 'no-competitors';

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0d0f17]/60 my-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 shadow-lg shadow-amber-500/5">
        {isNoCompetitors ? (
          <Building2 className="h-8 w-8" />
        ) : type === 'no-results' ? (
          <Search className="h-8 w-8" />
        ) : (
          <ShieldAlert className="h-8 w-8" />
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        {title || (isNoCompetitors ? 'No competitors added yet' : 'No intelligence found')}
      </h3>

      <p className="max-w-md text-sm text-slate-400 mb-6 leading-relaxed">
        {description ||
          (isNoCompetitors
            ? 'Start building your competitive intelligence watchlist. Add any company, startup, or market peer to begin tracking real-time pricing, product launches, and Hindsight longitudinal memories.'
            : 'Try adjusting your search criteria or switching to a different industry category to view monitored peers.')}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            {actionText}
          </button>
        )}

        {onLoadPresets && isNoCompetitors && (
          <button
            onClick={onLoadPresets}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            Load Sample Watchlist
          </button>
        )}
      </div>
    </div>
  );
};
