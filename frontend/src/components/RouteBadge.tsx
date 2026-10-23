import React from 'react';

interface RouteBadgeProps {
  route: string;
  isOverride?: boolean;
}

export const RouteBadge: React.FC<RouteBadgeProps> = ({ route, isOverride }) => {
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'Sales Coaching':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Deal Next Steps':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Customer Follow-up':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Internal / Vendor Note':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Human Review':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-linear-surface text-linear-text border-linear-border';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-medium rounded-md border ${getBadgeStyle(route)} transition-all`}
      title={isOverride ? 'Manual manager override in effect' : 'Automated suggested route'}
    >
      {route}
      {isOverride && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#D6ED17] shadow-[0_0_4px_#D6ED17]"
          title="Manual Override"
        />
      )}
    </span>
  );
};
