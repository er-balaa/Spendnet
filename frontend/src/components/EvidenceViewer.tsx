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
      <div className="bg-linear-panel border border-linear-border rounded-md p-8 text-center shadow-xs">
        <div className="inline-flex p-2 bg-white/[0.04] rounded text-linear-dim mb-2">
          <AlertTriangle className="w-4 h-4 text-linear-dim" />
        </div>
        <h4 className="text-xs font-semibold text-linear-text font-mono mb-1">
          No Usable Text Supplied
        </h4>
        <p className="text-[11px] text-linear-muted max-w-md mx-auto leading-relaxed">
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
    <div className="bg-linear-panel rounded-md border border-linear-border shadow-xs overflow-hidden">
      {/* Transcript Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2 bg-linear-surface border-b border-linear-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-linear-text font-mono">
            {sourceType === 'meeting' ? `Meeting Turns (${turns.length})` : 'Adapted Call Transcript'}
          </span>
          {sourceType === 'meeting' && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.04] text-linear-dim font-mono">
              1-based
            </span>
          )}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-linear-dim" />
          <input
            type="text"
            placeholder="Search turns..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-7 pr-3 py-1 rounded border border-linear-border bg-linear-bg text-linear-text placeholder:text-linear-dim focus:outline-hidden focus:border-[#D6ED17] transition-colors"
          />
        </div>
      </div>

      {/* Transcript Body */}
      <div className="max-h-[500px] overflow-y-auto p-3 space-y-2">
        {sourceType === 'meeting' ? (
          filteredTurns.length > 0 ? (
            filteredTurns.map(turn => {
              const isHighlighted = highlightTurn === turn.turnIndex;
              return (
                <div
                  key={turn.turnIndex}
                  id={`turn-${turn.turnIndex}`}
                  className={`p-2.5 rounded border transition-all ${
                    isHighlighted
                      ? 'border-[#D6ED17] bg-[#D6ED17]/10 ring-1 ring-[#D6ED17]/40'
                      : 'border-linear-border bg-linear-surface hover:bg-linear-hover'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-white/[0.05] text-[#D6ED17]">
                        T{turn.turnIndex}
                      </span>
                      <span className="text-xs font-medium text-linear-text flex items-center gap-1">
                        <User className="w-2.5 h-2.5 text-linear-dim" />
                        {turn.speaker || 'Speaker'}
                      </span>
                    </div>
                    {turn.timecode && (
                      <span className="text-[10px] text-linear-dim flex items-center gap-1 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {turn.timecode}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-linear-muted leading-relaxed pl-0.5">
                    {turn.text}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-linear-dim font-mono">
              No turns matched query "{searchTerm}".
            </div>
          )
        ) : (
          /* Call plain text with Linear styling */
          <div className="text-xs leading-relaxed text-linear-muted whitespace-pre-wrap bg-linear-surface p-3.5 rounded border border-linear-border font-mono">
            {callTranscript}
          </div>
        )}
      </div>
    </div>
  );
};
