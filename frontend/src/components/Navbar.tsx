import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Download, RefreshCw, Calendar, Search, Sun, Moon } from 'lucide-react';
import { getExportDownloadUrl, fetchHealth } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTour }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dbStatus, setDbStatus] = useState<{ status: string; unique_records?: number } | null>(null);

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

  // Global keyboard shortcut listeners (Raycast style)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K -> Search Inbox
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/inbox');
        const input = document.querySelector<HTMLInputElement>('input[type="text"]');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <header className="sticky top-0 z-40 h-12 shrink-0 bg-linear-bg/90 backdrop-blur-md border-b border-linear-border flex items-center transition-colors">
      <div className="flex items-center justify-between px-4 w-full">
        {/* Left: Brand + Workspace context */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-[#151619] border border-white/[0.1] flex items-center justify-center text-[#D6ED17] group-hover:border-[#D6ED17]/60 transition-colors">
              <Layers className="w-3.5 h-3.5 text-[#D6ED17]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-linear-text">
                Revo
              </span>
              <span className="text-[11px] text-linear-dim font-mono">/</span>
              <span className="text-[11px] text-linear-muted font-mono hidden sm:inline">
                Revenue Intel
              </span>
            </div>
          </Link>

          <span className="h-3 w-[1px] bg-linear-border mx-1 hidden md:block" />

          {/* Quick Date Scope */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-linear-muted font-mono">
            <Calendar className="w-3 h-3 text-linear-dim" />
            <span>21 Aug 2026</span>
          </div>
        </div>

        {/* Center: Raycast-style Command Trigger */}
        <div className="flex-1 max-w-sm mx-4 hidden sm:block">
          <button
            type="button"
            onClick={() => navigate('/inbox')}
            className="w-full flex items-center justify-between px-2.5 py-1 text-xs text-linear-muted bg-linear-surface hover:bg-linear-hover border border-linear-border rounded-md transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3 h-3 text-linear-dim group-hover:text-linear-text transition-colors" />
              <span className="text-[11px]">Search conversations, transcripts, reps...</span>
            </div>
            <kbd className="kbd">⌘K</kbd>
          </button>
        </div>

        {/* Right: Pro Status & Utility Controls */}
        <div className="flex items-center gap-2">
          {/* Store Status Indicator */}
          <div
            id="tour-db-status"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-linear-surface border border-linear-border text-[11px] font-mono text-linear-muted"
            title="Local Store Health"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                dbStatus?.status === 'healthy' ? 'bg-[#D6ED17] shadow-[0_0_6px_#D6ED17]' : 'bg-rose-500'
              }`}
            />
            <span className="text-linear-text font-medium">
              {dbStatus?.status === 'healthy' ? `${dbStatus.unique_records ?? 44} recs` : 'Offline'}
            </span>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            id="theme-switch-btn"
            type="button"
            onClick={toggleTheme}
            className="p-1.5 text-linear-muted hover:text-linear-text bg-linear-surface hover:bg-linear-hover border border-linear-border rounded-md transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-[#D6ED17]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#606060]" />
            )}
          </button>

          {/* Quick Export ZIP */}
          <a
            id="tour-export-zip"
            href={getExportDownloadUrl()}
            download="spendnest_revenue_intelligence_exports.zip"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-linear-text bg-linear-surface hover:bg-linear-hover border border-linear-border rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3 text-linear-dim" />
            <span>Export</span>
          </a>

          {/* Primary Action Button: Replay & Update */}
          <Link
            id="tour-replay-controls"
            to="/imports"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-[#08090A] bg-[#D6ED17] hover:bg-[#cde410] rounded-md transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <RefreshCw className="w-3 h-3 text-[#08090A]" />
            <span>Replay</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
