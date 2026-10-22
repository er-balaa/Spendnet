import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  denominatorExplanation?: string;
  icon?: React.ReactNode;
  trend?: string;
  onClick?: () => void;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  denominatorExplanation,
  icon,
  onClick,
  accentColor = 'border-l-indigo-600'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5' : ''
      } border-l-4 ${accentColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          {denominatorExplanation && (
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
                className="text-slate-400 hover:text-slate-600 focus:outline-hidden p-0.5"
                title="View metric definition"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              {showTooltip && (
                <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none">
                  <div className="font-semibold text-slate-200 mb-1">Calculation Definition:</div>
                  <div className="text-slate-300 leading-relaxed">{denominatorExplanation}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          )}
        </div>
        {icon && <div className="text-slate-400 p-1.5 bg-slate-50 rounded-lg">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        {subtitle && <span className="text-xs font-medium text-slate-500">{subtitle}</span>}
      </div>

      {denominatorExplanation && (
        <div className="mt-2 text-[11px] text-slate-500 line-clamp-1 border-t border-slate-100 pt-2">
          {denominatorExplanation}
        </div>
      )}
    </div>
  );
};
