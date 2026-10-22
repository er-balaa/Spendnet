import React, { useState } from 'react';
import { Search, Clock, User, AlertTriangle } from 'lucide-react';

interface Turn {
  speaker?: string;
  starts_at_seconds?: number;
  timecode?: string;
  text?: string;
}

interface EvidenceViewerProps {
  sourceType: 'call' | 'meeting';
  callTranscript?: string | null;
  turns?: Turn[];
  unavailableReason?: string | null;
  highlightTurn?: number | null;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  sourceType,
  callTranscript,
  turns = [],
  unavailableReason,
  highlightTurn
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const hasTurns = turns && turns.length > 0;
  const hasCallText = Boolean(callTranscript && callTranscript.trim());

  if (!hasTurns && !hasCallText) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
        <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-600 mb-3 border border-amber-200">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">
          No Usable Conversation Text Supplied
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {unavailableReason ||
            'This record was extracted without conversational audio or text. Per data contract rules, a missing transcript does not imply the event did not occur.'}
        </p>
      </div>
    );
  }

  // Filter turns if search term entered
  const filteredTurns = turns.map((turn, index) => ({ ...turn, turnIndex: index + 1 })).filter(turn => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (turn.text && turn.text.toLowerCase().includes(term)) ||
      (turn.speaker && turn.speaker.toLowerCase().includes(term)) ||
      (turn.timecode && turn.timecode.includes(term)) ||
      turn.turnIndex.toString() === term
    );
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Transcript Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {sourceType === 'meeting' ? `Meeting Turns (${turns.length} segments)` : 'Adapted Call Transcript'}
          </span>
          {sourceType === 'meeting' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
              1-Based Turn Numbered
            </span>
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search words or turn #..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transcript Body */}
      <div className="max-h-[520px] overflow-y-auto p-5 space-y-4">
        {sourceType === 'meeting' ? (
          filteredTurns.length > 0 ? (
            filteredTurns.map(turn => {
              const isHighlighted = highlightTurn === turn.turnIndex;
              return (
                <div
                  key={turn.turnIndex}
                  id={`turn-${turn.turnIndex}`}
                  className={`p-3.5 rounded-lg border transition-colors ${
                    isHighlighted
                      ? 'border-indigo-400 bg-indigo-50/70 ring-2 ring-indigo-200'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        Turn {turn.turnIndex}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {turn.speaker || 'Speaker'}
                      </span>
                    </div>
                    {turn.timecode && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {turn.timecode}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed pl-1">
                    {turn.text}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No turns matched search filter "{searchTerm}".
            </div>
          )
        ) : (
          /* Call plain text with highlighted styling */
          <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-800 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 font-mono">
            {callTranscript}
          </div>
        )}
      </div>
    </div>
  );
};
