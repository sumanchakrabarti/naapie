import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { ResponseState } from '../types';

type Tab = 'body' | 'headers';

const statusColor = (code: number) => {
  if (code < 300) return 'bg-green-600';
  if (code < 400) return 'bg-amber-600';
  return 'bg-red-600';
};

interface Props {
  response: ResponseState | null;
  loading: boolean;
}

export default function ResponseViewer({ response, loading }: Props) {
  const [tab, setTab] = useState<Tab>('body');
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800 rounded-none text-slate-400">
        <span className="animate-pulse">Running query…</span>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800 rounded-none text-slate-500">
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
    <div className="flex flex-col bg-slate-800 rounded-none overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-700">
        <span className={`${statusColor(response.status)} text-white text-xs font-bold px-2 py-0.5 rounded`}>
          {response.status} {response.statusText}
        </span>
        <span className="text-slate-500 text-xs">{response.duration}ms</span>

        {/* Tabs */}
        <div className="flex ml-auto gap-1">
          {(['body', 'headers'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-xs font-medium capitalize rounded transition
                ${tab === t ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="px-2 text-xs text-slate-500 hover:text-slate-300 transition"
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
            theme="vs-dark"
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
              <tr className="text-left text-slate-500">
                <th className="pb-1 pr-4 font-medium">Header</th>
                <th className="pb-1 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {Object.entries(response.headers).map(([k, v]) => (
                <tr key={k} className="border-t border-slate-700">
                  <td className="py-1 pr-4 text-slate-300">{k}</td>
                  <td className="py-1 text-slate-400 break-all">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
