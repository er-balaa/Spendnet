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
  onClick
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative bg-linear-surface rounded-lg border border-linear-border p-4 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-white/[0.18] hover:bg-linear-hover' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-linear-dim font-medium">
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
                className="text-linear-dim hover:text-[#D6ED17] focus:outline-hidden p-0.5 transition-colors cursor-pointer"
                title="View metric definition"
              >
                <Info className="w-3 h-3" />
              </button>
              {showTooltip && (
                <div className="absolute z-30 bottom-full left-0 mb-2 w-64 p-2.5 bg-[#1C1E22] border border-white/[0.12] text-white text-xs rounded-md shadow-xl pointer-events-none">
                  <div className="font-semibold text-[#D6ED17] mb-1 text-[11px] font-mono">Definition:</div>
                  <div className="text-linear-muted leading-relaxed text-[11px]">{denominatorExplanation}</div>
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-[#1C1E22]" />
                </div>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-linear-dim">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tracking-tight text-linear-text font-mono">{value}</div>
        {subtitle && <span className="text-[11px] text-linear-muted">{subtitle}</span>}
      </div>

      {denominatorExplanation && (
        <div className="mt-2 text-[10px] text-linear-dim line-clamp-1 border-t border-linear-border pt-1.5 font-mono">
          {denominatorExplanation}
        </div>
      )}
    </div>
  );
};
