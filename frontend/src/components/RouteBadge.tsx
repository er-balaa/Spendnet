import React from 'react';

interface RouteBadgeProps {
  route: string;
  isOverride?: boolean;
}

export const RouteBadge: React.FC<RouteBadgeProps> = ({ route, isOverride }) => {
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'Sales Coaching':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20';
      case 'Deal Next Steps':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'Customer Follow-up':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
      case 'Internal / Vendor Note':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      case 'Human Review':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border shadow-xs ${getBadgeStyle(route)}`}
      title={isOverride ? 'Manual manager override in effect' : 'Automated suggested route'}
    >
      {route}
      {isOverride && (
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 ring-2 ring-indigo-200" title="Manual Override" />
      )}
    </span>
  );
};
