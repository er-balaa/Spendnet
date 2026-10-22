import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Database, Download, RefreshCw, Calendar, Clock, CheckCircle, Lightbulb } from 'lucide-react';
import { getExportDownloadUrl, fetchHealth } from '../services/api';

interface NavbarProps {
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTour }) => {
  const [dbStatus, setDbStatus] = useState<{ status: string; unique_records?: number; cluster_type?: string } | null>(null);

  const checkHealth = async () => {
    try {
      const data = await fetchHealth();
      setDbStatus(data);
    } catch {
      setDbStatus({ status: 'offline' });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900">SpendNest</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                  Revenue Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Sales Manager Inbox & Analysis</p>
            </div>
          </Link>
        </div>

        {/* Status Badges & Quick Controls */}
        <div className="flex items-center gap-2.5">
          {/* Active Date & Timezone */}
          <div id="tour-date-time" className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">21 Aug 2026</span>
            <span className="text-slate-300">|</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Asia/Kolkata (UTC+05:30)</span>
          </div>

          {/* Database Health Status */}
          <div id="tour-db-status" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            {dbStatus?.status === 'healthy' ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {dbStatus.cluster_type === 'MongoDB Atlas' ? 'Atlas' : 'MongoDB'}: {dbStatus.unique_records ?? 44} records
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                MongoDB: Connecting...
              </span>
            )}
          </div>

          {/* Download Exports Button */}
          <a
            id="tour-export-zip"
            href={getExportDownloadUrl()}
            download="spendnest_revenue_intelligence_exports.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            title="Download full export archive with manifest"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Export ZIP</span>
          </a>

          {/* Link to Import Replay Controls */}
          <Link
            id="tour-replay-controls"
            to="/imports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay & Update</span>
          </Link>

          {/* User Guide Interactive Tour Button */}
          <button
            id="tour-guide-button"
            type="button"
            onClick={onOpenTour}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Open Interactive User Guide"
          >
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="hidden md:inline">User Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
