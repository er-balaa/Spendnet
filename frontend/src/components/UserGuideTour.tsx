import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Database,
  Calendar,
  Download,
  RefreshCw,
  Layers
} from 'lucide-react';

export interface TourStep {
  targetId: string;
  badge: string;
  title: string;
  description: string;
  detail: string;
  icon: React.ElementType;
  position?: 'bottom' | 'top' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-db-status',
    badge: 'Store Health',
    title: 'Persistent Store & Health',
    description: 'Displays real-time status of the local persistent store and total verified records (44 unique source records).',
    detail: 'Zero external database required; data persists cleanly across restarts adhering strictly to composite identity rules.',
    icon: Database,
    position: 'bottom'
  },
  {
    targetId: 'tour-date-time',
    badge: 'Time Context',
    title: 'Operational Time Scope',
    description: 'Pinned strictly to 21 August 2026 in Asia/Kolkata (UTC+05:30) per the recruitment operational scope.',
    detail: 'All daily call summaries, meeting turns, and analytics align with this specific business day.',
    icon: Calendar,
    position: 'bottom'
  },
  {
    targetId: 'tour-export-zip',
    badge: 'Reports & Audit',
    title: 'Export ZIP & Audit Manifest',
    description: 'One-click download of the complete audit archive with manifest.json, manifest.csv, and markdown conversation reports.',
    detail: 'Enables audit-ready compliance verification with SHA-256 integrity checksums.',
    icon: Download,
    position: 'bottom'
  },
  {
    targetId: 'tour-replay-controls',
    badge: 'Batch Management',
    title: 'Replay & Batch Controls',
    description: 'Quickly access replay scenarios: Scenario A (initial), B (shuffled), D (update batch), and F (revision guard).',
    detail: 'Verify revision monotonicity: newer revisions replace source payloads, older revisions are safely rejected.',
    icon: RefreshCw,
    position: 'bottom'
  },
  {
    targetId: 'tour-sidebar-nav',
    badge: 'Navigation',
    title: 'Workspaces & Analytics Navigation',
    description: 'Navigate between the Overview Dashboard, Conversation Inbox, Routing Taxonomy, Manager Brief, and Exports.',
    detail: 'Use the left sidebar to quickly switch operational views and inspect conversation details.',
    icon: Layers,
    position: 'right'
  }
];

interface UserGuideTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideTour: React.FC<UserGuideTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStep];

  const updatePosition = useCallback(() => {
    if (!isOpen || !step) return;
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleResize = () => updatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
  }, [isOpen, currentStep, updatePosition]);

  if (!isOpen || !step) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('spendnest_tour_completed', 'true');
    setCurrentStep(0);
    onClose();
  };

  // Compute tooltip position
  const getPopoverStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 60
      };
    }

    const pos = step.position || 'bottom';
    const margin = 16;
    let top = 0;
    let left = 0;

    if (pos === 'bottom') {
      top = targetRect.bottom + margin;
      left = Math.max(16, Math.min(window.innerWidth - 380, targetRect.left + targetRect.width / 2 - 180));
    } else if (pos === 'right') {
      top = Math.max(16, targetRect.top + targetRect.height / 2 - 120);
      left = targetRect.right + margin;
    } else if (pos === 'top') {
      top = targetRect.top - margin - 260;
      left = Math.max(16, Math.min(window.innerWidth - 380, targetRect.left + targetRect.width / 2 - 180));
    } else if (pos === 'left') {
      top = Math.max(16, targetRect.top + targetRect.height / 2 - 120);
      left = targetRect.left - margin - 360;
    }

    if (top < 16) top = 16;
    if (top > window.innerHeight - 300) top = window.innerHeight - 300;

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 60
    };
  };

  const popoverStyle = getPopoverStyle();
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Semi-transparent dark overlay */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleComplete}
      />

      {/* Target element highlight cut-out spotlight */}
      {targetRect && (
        <div
          className="fixed rounded-2xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: '0 0 0 3px rgba(214, 237, 23, 0.9), 0 0 0 9999px rgba(9, 10, 13, 0.75)'
          }}
        >
          <span className="absolute -top-2 -right-2 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6ED17] opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-[#D6ED17] text-[10px] font-bold text-[#090A0D] items-center justify-center font-mono">
              {currentStep + 1}
            </span>
          </span>
        </div>
      )}

      {/* Floating Popover Guide Card */}
      <div
        style={popoverStyle}
        className="w-full max-w-sm bg-linear-panel rounded-lg shadow-2xl border border-linear-border overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-linear-text"
      >
        {/* Step Progress Top Bar */}
        <div className="bg-white/[0.06] h-1 w-full">
          <div
            className="bg-[#D6ED17] h-1 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-linear-surface text-[#D6ED17] border border-linear-border flex items-center justify-center shrink-0">
                <StepIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-semibold text-[#D6ED17] uppercase tracking-wider">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white/[0.06] text-linear-dim rounded border border-linear-border">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-linear-text leading-tight mt-0.5 font-mono">
                  {step.title}
                </h3>
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="text-linear-dim hover:text-linear-text p-1 rounded hover:bg-white/[0.06] cursor-pointer transition-colors"
              title="Close guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-1.5 text-xs text-linear-muted bg-linear-surface p-3 rounded border border-linear-border">
            <p className="font-normal text-linear-text text-xs">
              {step.description}
            </p>
            <p className="text-[11px] text-linear-dim bg-linear-bg p-2 rounded border border-linear-border font-mono">
              {step.detail}
            </p>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={handleComplete}
              className="text-xs font-medium text-[#9CA3AF] hover:text-[#F3F4F6] px-2 py-1.5 rounded-full hover:bg-white/[0.04] cursor-pointer transition-colors"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#F3F4F6] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] rounded-full cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#08090A] bg-[#D6ED17] hover:bg-[#cde410] rounded-md transition-all cursor-pointer shadow-xs"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Finish Tour
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
