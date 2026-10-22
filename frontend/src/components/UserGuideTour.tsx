import React, { useState, useEffect, useCallback } from 'react';
import {
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Database,
  Calendar,
  Download,
  RefreshCw,
  Layers,
  Sparkles
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
    badge: 'Database Health',
    title: 'MongoDB Atlas Cloud Connection',
    description: 'Displays real-time cloud connection to MongoDB Atlas and total verified records in the database (44 unique source records).',
    detail: 'Monitors cluster latency and confirms high availability with auto-healing composite indexes.',
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
    description: 'One-click download of the complete 78 KB audit archive with manifest.json, manifest.csv, and markdown conversation reports.',
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
  },
  {
    targetId: 'tour-guide-button',
    badge: 'Interactive Help',
    title: 'Interactive User Guide Anytime',
    description: 'Need a refresher on how the product works? Click this User Guide button anytime to reopen this walkthrough.',
    detail: 'You can replay this feature walkthrough anytime from the top navbar or sidebar shortcut.',
    icon: Lightbulb,
    position: 'bottom'
  }
];

interface UserGuideTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideTour: React.FC<UserGuideTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStep];

  const updateTargetPosition = useCallback(() => {
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
      updateTargetPosition();
      const timer = setTimeout(updateTargetPosition, 250);
      window.addEventListener('resize', updateTargetPosition);
      window.addEventListener('scroll', updateTargetPosition, true);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateTargetPosition);
        window.removeEventListener('scroll', updateTargetPosition, true);
      };
    }
  }, [isOpen, currentStep, updateTargetPosition]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('spendnest_tour_completed', 'true');
    setCurrentStep(0);
    onClose();
  };

  const StepIcon = step.icon;

  // Compute popover position relative to target element
  let popoverStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999
  };

  if (targetRect) {
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      popoverStyle = {
        position: 'fixed',
        left: '16px',
        right: '16px',
        bottom: '24px',
        zIndex: 9999
      };
    } else if (step.position === 'right') {
      popoverStyle = {
        position: 'fixed',
        top: Math.max(16, targetRect.top),
        left: Math.min(window.innerWidth - 380, targetRect.right + 16),
        zIndex: 9999
      };
    } else {
      // Default bottom position
      const topPos = targetRect.bottom + 12;
      const leftPos = Math.max(16, Math.min(window.innerWidth - 380, targetRect.left - 40));
      popoverStyle = {
        position: 'fixed',
        top: topPos > window.innerHeight - 280 ? targetRect.top - 240 : topPos,
        left: leftPos,
        zIndex: 9999
      };
    }
  } else {
    // Center fallback if target element is not in DOM
    popoverStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999
    };
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Semi-transparent dark overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleComplete}
      />

      {/* Target element highlight cut-out spotlight */}
      {targetRect && (
        <div
          className="fixed rounded-xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.9), 0 0 0 9999px rgba(15, 23, 42, 0.65)'
          }}
        >
          <span className="absolute -top-2 -right-2 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-600 text-[10px] font-bold text-white items-center justify-center">
              {currentStep + 1}
            </span>
          </span>
        </div>
      )}

      {/* Floating Popover Guide Card */}
      <div
        style={popoverStyle}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Step Progress Top Bar */}
        <div className="bg-slate-100 h-1.5 w-full">
          <div
            className="bg-indigo-600 h-1.5 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <StepIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {step.title}
                </h3>
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-2 text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="font-medium text-slate-800">
              {step.description}
            </p>
            <p className="text-[11px] text-indigo-900 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100/70 font-sans flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>{step.detail}</span>
            </p>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            {/* Skip Tour Button */}
            <button
              type="button"
              onClick={handleComplete}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer transition-colors"
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
