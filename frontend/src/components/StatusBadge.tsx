import React from 'react';

interface StatusBadgeProps {
  status: string;
  freshness?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, freshness }) => {
  const getStatusDot = () => {
    switch (status) {
      case 'Reviewed':
        return 'bg-emerald-400';
      case 'Awaiting Review':
        return 'bg-amber-400';
      case 'Under Review':
        return 'bg-sky-400';
      case 'Missing Transcript':
        return 'bg-linear-dim';
      case 'Unusable Text':
        return 'bg-[#606060]';
      default:
        return 'bg-linear-dim';
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-linear-surface text-linear-text border border-linear-border">
        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot()}`} />
        <span>{status}</span>
      </span>

      {freshness === 'stale_pending_review' && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30"
          title="Source transcript text changed; previous analysis needs review"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Pending
        </span>
      )}

      {freshness === 'fresh' && (
        <span
          className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-white/[0.03] text-linear-dim"
          title="Analysis reflects current source revision"
        >
          synced
        </span>
      )}
    </div>
  );
};
