import React, { useEffect, useState } from 'react';
import {
  RefreshCw, Play, RotateCcw, CheckCircle2, AlertCircle, FileText,
  Clock, ShieldCheck, Database, ArrowRight
} from 'lucide-react';
import {
  triggerInitialImport,
  triggerRepeatImport,
  triggerUpdateImport,
  triggerResetDatabase,
  fetchImportHistory
} from '../services/api';
import { ImportResult, ImportBatchRecord } from '../types';

export const ImportReplayPage: React.FC = () => {
  const [history, setHistory] = useState<ImportBatchRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [latestResult, setLatestResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      const data = await fetchImportHistory();
      setHistory(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAction = async (actionFn: () => Promise<ImportResult>, actionName: string) => {
    setLoading(true);
    setError(null);
    setLatestResult(null);
    try {
      const res = await actionFn();
      setLatestResult(res);
      await loadHistory();
    } catch (err: any) {
      setError(err.message || `${actionName} failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (mode: 'empty' | 'initial' | 'demo') => {
    if (!window.confirm(`Are you sure you want to reset database to '${mode}'?`)) return;
    setLoading(true);
    setError(null);
    setLatestResult(null);
    try {
      await triggerResetDatabase(mode);
      await loadHistory();
      alert(`Database successfully reset to '${mode}' state.`);
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Import, Replay & Revision Controls
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Execute and verify all five public replay test scenarios: initial import, repeat import with shuffled ordering, manual overrides, late-transcript update batch, and revision protection.
        </p>
      </div>

      {/* Result / Error Notification */}
      {latestResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-1 shadow-xs animate-in fade-in">
          <div className="font-bold flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Execution Successful: {latestResult.batch_id} (Rev {latestResult.revision})</span>
          </div>
          <p>{latestResult.message}</p>
          <div className="flex gap-4 pt-1 font-mono text-[11px] text-emerald-700">
            <span>Inserted: {latestResult.inserted_records}</span>
            <span>Updated: {latestResult.updated_records}</span>
            <span>Ignored: {latestResult.ignored_records}</span>
            <span>Total Unique in DB: <strong>{latestResult.total_unique_in_db}</strong></span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Interactive Replay Steps Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1: Initial Import */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Scenario A
              </span>
              <span className="text-xs text-slate-400 font-mono">Rev 1</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Initial Import</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ingests <code>01_initial.json</code>. Generates 44 logical source records (30 calls, 14 meetings; 17 usable texts).
            </p>
          </div>
          <button
            onClick={() => handleAction(triggerInitialImport, 'Initial Import')}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            Import Initial Batch
          </button>
        </div>

        {/* Step 2: Repeat Import with Shuffled Ordering */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Scenario B
              </span>
              <span className="text-xs text-slate-400 font-mono">Shuffled</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Repeat Import (Shuffled)</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Re-imports <code>01_initial.json</code> in randomized order. Verifies 0 duplicate records and 0 metric inflation.
            </p>
          </div>
          <button
            onClick={() => handleAction(() => triggerRepeatImport(true), 'Repeat Import')}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-xs disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Test Repeat Import
          </button>
        </div>

        {/* Step 3: Apply Update Batch */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Scenario D
              </span>
              <span className="text-xs text-slate-400 font-mono">Rev 2</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Apply Update Batch</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Imports <code>02_update.json</code>. Replaces M07 source payload with 27-turn transcript. Preserves existing manual overrides!
            </p>
          </div>
          <button
            onClick={() => handleAction(triggerUpdateImport, 'Update Import')}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            Apply Update Batch
          </button>
        </div>

        {/* Step 4: Revision Protection Test */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Scenario F
              </span>
              <span className="text-xs text-slate-400 font-mono">Rev Guard</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Re-import Older Batch</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Attempts to import Rev 1 over Rev 2. Enforces contract rule: equal or older revisions are ignored.
            </p>
          </div>
          <button
            onClick={() => handleAction(triggerInitialImport, 'Revision Protection Test')}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg shadow-xs disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Test Revision Guard
          </button>
        </div>
      </div>

      {/* Reset & Quick Demo Preset Controls */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Database Reset & Demo Seeding Presets
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly return the MongoDB database to any required state for repeatable evaluation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleReset('empty')}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Reset to Empty (0 records)
          </button>
          <button
            onClick={() => handleReset('initial')}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Reset to Initial Only (44 records, 17 usable)
          </button>
          <button
            onClick={() => handleReset('demo')}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
          >
            Demo Load (Final Post-Update State)
          </button>
        </div>
      </div>

      {/* Import Execution History Audit Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Import History & Batch Execution Audit
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {history.length} batches logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Batch ID</th>
                <th className="py-2.5 px-4 text-center">Revision</th>
                <th className="py-2.5 px-4">Imported At (UTC)</th>
                <th className="py-2.5 px-4 text-center">Batch Records</th>
                <th className="py-2.5 px-4 text-center">Inserted</th>
                <th className="py-2.5 px-4 text-center">Updated</th>
                <th className="py-2.5 px-4 text-center">Ignored</th>
                <th className="py-2.5 px-4 text-right">Unique in DB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No import executions recorded in history collection yet.
                  </td>
                </tr>
              ) : (
                history.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">{b.batch_id}</td>
                    <td className="py-3 px-4 text-center">v{b.revision}</td>
                    <td className="py-3 px-4 text-slate-600">{b.imported_at ? b.imported_at.slice(0, 19).replace('T', ' ') : '--'}</td>
                    <td className="py-3 px-4 text-center">{b.total_records_in_batch}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-bold">{b.inserted_count}</td>
                    <td className="py-3 px-4 text-center text-indigo-700 font-bold">{b.updated_count}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{b.ignored_count}</td>
                    <td className="py-3 px-4 text-right text-slate-900 font-bold">{b.total_unique_in_db}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
