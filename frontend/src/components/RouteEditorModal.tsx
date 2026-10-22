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

  const hasChanges = JSON.stringify(selectedRoutes.sort()) !== JSON.stringify(suggestedRoutes.sort());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Manual Route Override
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {recordRef} — {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Automated Suggestions:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {suggestedRoutes.map(r => (
                <span key={r} className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Assign Routes (Select one or more destinations):
            </label>
            <div className="space-y-2">
              {ALL_CATEGORIES.map(category => {
                const isChecked = selectedRoutes.includes(category);
                return (
                  <label
                    key={category}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRoute(category)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    {isChecked && <Check className="w-4 h-4 text-indigo-600" />}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manager Review Notes & Justification (Optional):
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Explain the operational rationale for this routing decision..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div>
            {manualOverride && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Suggested
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSubmitting ? 'Saving...' : 'Save Override'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
