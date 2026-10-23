import React, { useEffect, useState } from 'react';
import {
  RefreshCw, Play, CheckCircle2, AlertCircle, Clock, ShieldCheck
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
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto bg-linear-bg text-linear-text">
      {/* Header */}
      <div className="border-b border-linear-border pb-3">
        <h1 className="text-base font-semibold tracking-tight text-linear-text font-heading">
          Replay Engine & Revision Verification
        </h1>
        <p className="text-[11px] text-linear-dim font-mono mt-0.5">
          Execute test scenarios: idempotency, shuffled batch imports, override persistence, and revision monotonicity.
        </p>
      </div>

      {/* Result Notification */}
      {latestResult && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 rounded-md text-xs space-y-1 font-mono">
          <div className="font-semibold flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Success: {latestResult.batch_id} (Rev {latestResult.revision})</span>
          </div>
          <p className="text-[11px]">{latestResult.message}</p>
          <div className="flex gap-4 pt-0.5 text-[10px] text-emerald-300">
            <span>Inserted: {latestResult.inserted_records}</span>
            <span>Updated: {latestResult.updated_records}</span>
            <span>Ignored: {latestResult.ignored_records}</span>
            <span>Total in Store: <strong className="text-[#D6ED17]">{latestResult.total_unique_in_db}</strong></span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-md text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scenario Stepper Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Scenario A */}
        <div className="bg-linear-panel p-3.5 rounded-md border border-linear-border flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                Scenario A
              </span>
              <span className="text-[10px] text-linear-dim font-mono">Rev 1</span>
            </div>
            <h3 className="text-xs font-semibold text-linear-text font-mono">Initial Import</h3>
            <p className="text-[11px] text-linear-muted leading-relaxed">
              Ingests <code>01_initial.json</code> (44 records, 17 usable texts).
            </p>
          </div>
          <button
            onClick={() => handleAction(triggerInitialImport, 'Initial Import')}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-linear-text bg-linear-surface hover:bg-linear-hover border border-linear-border rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3 h-3 text-[#D6ED17]" />
            <span>Run Initial</span>
          </button>
        </div>

        {/* Scenario B */}
        <div className="bg-linear-panel p-3.5 rounded-md border border-linear-border flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase text-linear-dim bg-white/[0.04] px-1.5 py-0.2 rounded border border-linear-border">
                Scenario B
              </span>
              <span className="text-[10px] text-linear-dim font-mono">Shuffled</span>
            </div>
            <h3 className="text-xs font-semibold text-linear-text font-mono">Repeat (Shuffled)</h3>
            <p className="text-[11px] text-linear-muted leading-relaxed">
              Re-imports <code>01_initial.json</code> shuffled. Tests 0 duplicate inflation.
            </p>
          </div>
          <button
            onClick={() => handleAction(() => triggerRepeatImport(true), 'Repeat Import')}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-linear-text bg-linear-surface hover:bg-linear-hover border border-linear-border rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3 h-3 text-linear-dim" />
            <span>Test Shuffled</span>
          </button>
        </div>

        {/* Scenario D */}
        <div className="bg-linear-panel p-3.5 rounded-md border border-linear-border flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase text-[#08090A] bg-[#D6ED17] px-1.5 py-0.2 rounded font-bold">
                Scenario D
              </span>
              <span className="text-[10px] text-[#D6ED17] font-mono">Rev 2</span>
            </div>
            <h3 className="text-xs font-semibold text-linear-text font-mono">Apply Update</h3>
            <p className="text-[11px] text-linear-muted leading-relaxed">
              Imports <code>02_update.json</code> (M07 updated). Preserves overrides!
            </p>
          </div>
          <button
            onClick={() => handleAction(triggerUpdateImport, 'Update Import')}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#08090A] bg-[#D6ED17] hover:bg-[#cde410] rounded transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Play className="w-3 h-3 text-[#08090A]" />
            <span>Apply Update</span>
          </button>
        </div>

        {/* Scenario F */}
        <div className="bg-linear-panel p-3.5 rounded-md border border-linear-border flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase text-linear-dim bg-white/[0.04] px-1.5 py-0.2 rounded border border-linear-border">
                Scenario F
              </span>
              <span className="text-[10px] text-linear-dim font-mono">Guard</span>
            </div>
            <h3 className="text-xs font-semibold text-linear-text font-mono">Older Batch Guard</h3>
            <p className="text-[11px] text-linear-muted leading-relaxed">
              Re-imports Rev 1 over Rev 2. Tests older revision rejection.
            </p>
          </div>
          <button
            onClick={() => handleAction(triggerInitialImport, 'Revision Protection Test')}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-linear-text bg-linear-surface hover:bg-linear-hover border border-linear-border rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-3 h-3 text-[#D6ED17]" />
            <span>Test Guard</span>
          </button>
        </div>
      </div>

      {/* Preset Controls */}
      <div className="bg-linear-panel p-3.5 rounded-md border border-linear-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold text-linear-text font-mono uppercase">
            Store Evaluation Presets
          </h3>
          <p className="text-[11px] text-linear-dim">
            Fast reset to empty, initial batch only, or demo final state.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleReset('empty')}
            disabled={loading}
            className="px-2.5 py-1 text-xs font-mono text-linear-dim hover:text-rose-400 bg-linear-surface border border-linear-border rounded transition-colors cursor-pointer"
          >
            Empty (0)
          </button>
          <button
            onClick={() => handleReset('initial')}
            disabled={loading}
            className="px-2.5 py-1 text-xs font-mono text-linear-muted hover:text-linear-text bg-linear-surface border border-linear-border rounded transition-colors cursor-pointer"
          >
            Initial Only (44)
          </button>
          <button
            onClick={() => handleReset('demo')}
            disabled={loading}
            className="px-3 py-1 text-xs font-semibold font-mono text-[#08090A] bg-[#D6ED17] hover:bg-[#cde410] rounded transition-all cursor-pointer shadow-xs"
          >
            Demo Post-Update
          </button>
        </div>
      </div>

      {/* Audit History Table */}
      <div className="bg-linear-panel rounded-md border border-linear-border overflow-hidden">
        <div className="px-3 py-2 bg-linear-surface border-b border-linear-border flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-1.5 text-linear-text font-semibold">
            <Clock className="w-3.5 h-3.5 text-[#D6ED17]" />
            <span>BATCH EXECUTION AUDIT</span>
          </div>
          <span className="text-[11px] text-linear-dim">
            {history.length} batches logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-[11px]">
            <thead className="bg-linear-surface/60 border-b border-linear-border text-linear-dim uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3">Batch ID</th>
                <th className="py-2 px-3 text-center">Rev</th>
                <th className="py-2 px-3">Imported (UTC)</th>
                <th className="py-2 px-3 text-center">Batch Items</th>
                <th className="py-2 px-3 text-center">Inserted</th>
                <th className="py-2 px-3 text-center">Updated</th>
                <th className="py-2 px-3 text-center">Ignored</th>
                <th className="py-2 px-3 text-right">Unique in Store</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linear-border/60">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-linear-dim font-sans">
                    No import executions recorded in history yet.
                  </td>
                </tr>
              ) : (
                history.map((b, idx) => (
                  <tr key={idx} className="hover:bg-linear-hover transition-colors">
                    <td className="py-2 px-3 font-semibold text-linear-text">{b.batch_id}</td>
                    <td className="py-2 px-3 text-center text-[#D6ED17]">v{b.revision}</td>
                    <td className="py-2 px-3 text-linear-muted">{b.imported_at ? b.imported_at.slice(0, 19).replace('T', ' ') : '--'}</td>
                    <td className="py-2 px-3 text-center text-linear-dim">{b.total_records_in_batch}</td>
                    <td className="py-2 px-3 text-center text-emerald-400 font-semibold">{b.inserted_count}</td>
                    <td className="py-2 px-3 text-center text-[#D6ED17] font-semibold">{b.updated_count}</td>
                    <td className="py-2 px-3 text-center text-linear-dim">{b.ignored_count}</td>
                    <td className="py-2 px-3 text-right text-linear-text font-bold">{b.total_unique_in_db}</td>
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
