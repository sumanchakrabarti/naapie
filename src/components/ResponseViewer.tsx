import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { ResponseState } from '../types';
import { useTheme } from '../hooks/useTheme';

type Tab = 'body' | 'headers';

const statusColor = (code: number) => {
  if (code < 300) return 'bg-[var(--status-success)]';
  if (code < 400) return 'bg-[var(--status-warning)]';
  return 'bg-[var(--status-error)]';
};

interface Props {
  response: ResponseState | null;
  loading: boolean;
}

export default function ResponseViewer({ response, loading }: Props) {
  const [tab, setTab] = useState<Tab>('body');
  const [expanded, setExpanded] = useState(false);
  const { current: themeConfig } = useTheme();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[var(--surface-2)] rounded-none text-[var(--text-secondary)]">
        <span className="animate-pulse">Running query…</span>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-64 bg-[var(--surface-2)] rounded-none text-[var(--text-muted)]">
        Run a query to see the response
      </div>
    );
  }

  const prettyBody = (() => {
    try {
      return JSON.stringify(JSON.parse(response.body), null, 2);
    } catch {
      return response.body;
    }
  })();

  return (
    <div className="flex flex-col bg-[var(--surface-2)] rounded-none overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--border)]">
        <span className={`${statusColor(response.status)} text-white text-xs font-bold px-2 py-0.5 rounded`}>
          {response.status} {response.statusText}
        </span>
        <span className="text-[var(--text-muted)] text-xs">{response.duration}ms</span>

        {/* Tabs */}
        <div className="flex ml-auto gap-1">
          {(['body', 'headers'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-xs font-medium capitalize rounded transition
                ${tab === t ? 'bg-[var(--surface-3)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="px-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {/* Body */}
      {tab === 'body' && (
        <div className={expanded ? 'h-[60vh]' : 'h-80'}>
          <Editor
            defaultLanguage="json"
            theme={themeConfig.monacoTheme}
            value={prettyBody}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
      )}

      {/* Headers */}
      {tab === 'headers' && (
        <div className={`p-3 overflow-y-auto ${expanded ? 'max-h-[60vh]' : 'max-h-80'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-muted)]">
                <th className="pb-1 pr-4 font-medium">Header</th>
                <th className="pb-1 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {Object.entries(response.headers).map(([k, v]) => (
                <tr key={k} className="border-t border-[var(--border)]">
                  <td className="py-1 pr-4 text-[var(--text-secondary)]">{k}</td>
                  <td className="py-1 text-[var(--text-secondary)] break-all">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
