import { useState } from 'react';
import type { HistoryEntry, RequestState } from '../types';

const methodColors: Record<string, string> = {
  GET: 'text-green-400',
  POST: 'text-blue-400',
  PUT: 'text-amber-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
};

const statusColor = (code: number) => {
  if (code === 0) return 'text-red-400';
  if (code < 300) return 'text-green-400';
  if (code < 400) return 'text-amber-400';
  return 'text-red-400';
};

interface Props {
  entries: HistoryEntry[];
  onSelect: (patch: Partial<RequestState>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function HistoryPanel({ entries, onSelect, onRemove, onClear }: Props) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-slate-500 hover:text-slate-300 transition px-2 py-1"
      >
        History ({entries.length})
      </button>
    );
  }

  const handleSelect = (entry: HistoryEntry) => {
    onSelect({
      method: entry.request.method,
      path: entry.request.path,
      headers: entry.request.headers,
      body: entry.request.body,
    });
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const buildTooltip = (entry: HistoryEntry) => {
    const lines = [
      `${entry.request.method} ${entry.request.path}`,
    ];
    if (entry.resolvedPath && entry.resolvedPath !== entry.request.path) {
      lines.push(`Resolved: ${entry.resolvedPath}`);
    }
    lines.push(`Status: ${entry.status} ${entry.statusText}`);
    lines.push(`Duration: ${entry.duration}ms`);
    lines.push(`Time: ${new Date(entry.timestamp).toLocaleString()}`);
    const enabledHeaders = entry.request.headers.filter((h) => h.enabled && h.key);
    if (enabledHeaders.length > 0) {
      lines.push('', 'Headers:');
      enabledHeaders.forEach((h) => lines.push(`  ${h.key}: ${h.value}`));
    }
    if (entry.request.body) {
      lines.push('', 'Body:', entry.request.body.substring(0, 500));
    }
    return lines.join('\n');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">History</span>
        <div className="flex gap-2">
          {entries.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-red-400 hover:text-red-300 transition"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            ✕
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-2">No history yet</p>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-1">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-2 px-2 py-1 hover:bg-slate-700/60 transition group"
              title={buildTooltip(entry)}
            >
              <button
                onClick={() => handleSelect(entry)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
                <span className={`text-[10px] font-bold font-mono w-10 shrink-0 ${methodColors[entry.request.method] ?? 'text-slate-400'}`}>
                  {entry.request.method}
                </span>
                <span className="text-xs text-slate-300 truncate flex-1 font-mono">
                  {entry.request.path}
                  {entry.resolvedPath && entry.resolvedPath !== entry.request.path && (
                    <span className="text-slate-500 ml-1">→ {entry.resolvedPath}</span>
                  )}
                </span>
                <span className={`text-[10px] font-mono ${statusColor(entry.status)}`}>
                  {entry.status || 'ERR'}
                </span>
                <span className="text-[10px] text-slate-600">
                  {formatTime(entry.timestamp)}
                </span>
              </button>
              <button
                onClick={() => onRemove(entry.id)}
                className="text-slate-600 hover:text-red-400 text-xs px-1 opacity-0 group-hover:opacity-100 transition"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
