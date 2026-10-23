import React, { useState } from 'react';
import { X, RotateCcw, Save, ShieldAlert, Check } from 'lucide-react';
import { updateConversationRoutes, resetConversationRoute } from '../services/api';
import { RouteCategory } from '../types';

interface RouteEditorModalProps {
  sourceType: string;
  sourceId: string;
  recordRef: string;
  title: string;
  suggestedRoutes: string[];
  manualOverride?: string[] | null;
  currentNotes?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ALL_CATEGORIES: RouteCategory[] = [
  'Sales Coaching',
  'Deal Next Steps',
  'Customer Follow-up',
  'Internal / Vendor Note',
  'Human Review'
];

export const RouteEditorModal: React.FC<RouteEditorModalProps> = ({
  sourceType,
  sourceId,
  recordRef,
  title,
  suggestedRoutes,
  manualOverride,
  currentNotes,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(
    manualOverride && manualOverride.length > 0 ? manualOverride : suggestedRoutes
  );
  const [notes, setNotes] = useState<string>(currentNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleRoute = (category: string) => {
    if (selectedRoutes.includes(category)) {
      setSelectedRoutes(selectedRoutes.filter(r => r !== category));
    } else {
      setSelectedRoutes([...selectedRoutes, category]);
    }
  };

  const handleSave = async () => {
    if (selectedRoutes.length === 0) {
      setError('Please select at least one route category.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await updateConversationRoutes(sourceType, sourceId, selectedRoutes, notes);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update routes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await resetConversationRoute(sourceType, sourceId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reset route.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-linear-panel rounded-lg max-w-lg w-full shadow-2xl border border-linear-border overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-linear-text">
        <div className="flex items-center justify-between px-4 py-3 border-b border-linear-border bg-linear-surface">
          <div>
            <div className="text-[10px] font-mono font-semibold text-[#D6ED17] uppercase tracking-wider">
              Manual Route Override
            </div>
            <h3 className="text-xs font-semibold text-linear-text font-mono mt-0.5">
              {recordRef} — {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-linear-dim hover:text-linear-text p-1 rounded hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="p-2.5 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-linear-dim uppercase mb-1">
              Automated Suggestions
            </label>
            <div className="flex flex-wrap gap-1">
              {suggestedRoutes.map(r => (
                <span key={r} className="px-2 py-0.5 text-[10px] rounded bg-linear-surface text-linear-muted border border-linear-border font-mono">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-linear-dim uppercase mb-1.5">
              Assign Routes (Multi-select)
            </label>
            <div className="space-y-1.5">
              {ALL_CATEGORIES.map(category => {
                const isChecked = selectedRoutes.includes(category);
                return (
                  <label
                    key={category}
                    className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-[#D6ED17] bg-[#D6ED17]/10 text-linear-text'
                        : 'border-linear-border bg-linear-surface hover:bg-linear-hover text-linear-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRoute(category)}
                        className="w-3.5 h-3.5 rounded accent-[#D6ED17]"
                      />
                      <span className="text-xs font-medium">{category}</span>
                    </div>
                    {isChecked && <Check className="w-3.5 h-3.5 text-[#D6ED17]" />}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-linear-dim uppercase mb-1">
              Review Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Explain the operational rationale for this override..."
              className="w-full text-xs p-2.5 rounded border border-linear-border bg-linear-surface text-linear-text placeholder:text-linear-dim focus:outline-hidden focus:border-[#D6ED17]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-linear-surface border-t border-linear-border text-xs">
          <div>
            {manualOverride && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-linear-dim hover:text-linear-text transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 py-1 text-xs text-linear-muted hover:text-linear-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#08090A] bg-[#D6ED17] hover:bg-[#cde410] rounded transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-3 h-3 text-[#08090A]" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
