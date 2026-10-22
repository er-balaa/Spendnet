import React from 'react';
import { AlertCircle, CheckCircle2, Clock, FileQuestion, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  freshness?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, freshness }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Reviewed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          label: 'Reviewed'
        };
      case 'Awaiting Review':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          label: 'Awaiting Review'
        };
      case 'Under Review':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock,
          label: 'Under Review'
        };
      case 'Missing Transcript':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: FileQuestion,
          label: 'Missing Transcript'
        };
      case 'Unusable Text':
        return {
          bg: 'bg-zinc-100 text-zinc-700 border-zinc-300',
          icon: FileQuestion,
          label: 'Unusable Text'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: AlertCircle,
          label: status
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${config.bg}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>

      {freshness === 'stale_pending_review' && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"
          title="Source transcript text changed; previous analysis needs review"
        >
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Stale / Needs Review
        </span>
      )}

      {freshness === 'fresh' && (
        <span
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded bg-emerald-50 text-emerald-600 border border-emerald-100"
          title="Analysis reflects current source revision"
        >
          <Sparkles className="w-2.5 h-2.5" />
          Fresh
        </span>
      )}
    </div>
  );
};
