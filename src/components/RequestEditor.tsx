import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { RequestState } from '../types';
import type { Variable } from '../hooks/useVariables';
import { isValidVariableKey } from '../hooks/useVariables';

type Tab = 'headers' | 'body' | 'variables';

interface Props {
  request: RequestState;
  onChange: (patch: Partial<RequestState>) => void;
  variables: Variable[];
  onSetVariable: (idx: number, field: 'key' | 'value', val: string) => void;
  onAddVariable: () => void;
  onRemoveVariable: (idx: number) => void;
}

export default function RequestEditor({
  request,
  onChange,
  variables,
  onSetVariable,
  onAddVariable,
  onRemoveVariable,
}: Props) {
  const [tab, setTab] = useState<Tab>('body');
  const [expanded, setExpanded] = useState(false);

  const addHeader = () =>
    onChange({ headers: [...request.headers, { key: '', value: '', enabled: true }] });

  const updateHeader = (idx: number, field: string, value: string | boolean) => {
    const next = request.headers.map((h, i) =>
      i === idx ? { ...h, [field]: value } : h,
    );
    onChange({ headers: next });
  };

  const removeHeader = (idx: number) =>
    onChange({ headers: request.headers.filter((_, i) => i !== idx) });

  return (
    <div className="flex flex-col bg-slate-800 rounded-none overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {(['headers', 'body', 'variables'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition
              ${tab === t ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {t}
            {t === 'headers' && request.headers.length > 0 && (
              <span className="ml-1 text-xs text-slate-500">({request.headers.length})</span>
            )}
            {t === 'variables' && variables.length > 0 && (
              <span className="ml-1 text-xs text-slate-500">({variables.length})</span>
            )}
          </button>
        ))}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="ml-auto px-3 text-xs text-slate-500 hover:text-slate-300 transition"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? '▼ Collapse' : '▲ Expand'}
        </button>
      </div>

      {/* Headers tab */}
      {tab === 'headers' && (
        <div className={`p-3 space-y-2 overflow-y-auto ${expanded ? 'max-h-[60vh]' : 'max-h-60'}`}>
          {request.headers.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={h.enabled}
                onChange={(e) => updateHeader(i, 'enabled', e.target.checked)}
                className="accent-blue-500"
              />
              <input
                placeholder="Header name"
                value={h.key}
                onChange={(e) => updateHeader(i, 'key', e.target.value)}
                className="flex-1 bg-slate-700 rounded px-2 py-1 text-sm text-white font-mono
                           placeholder:text-slate-500 outline-none"
              />
              <input
                placeholder="Value"
                value={h.value}
                onChange={(e) => updateHeader(i, 'value', e.target.value)}
                className="flex-1 bg-slate-700 rounded px-2 py-1 text-sm text-white font-mono
                           placeholder:text-slate-500 outline-none"
              />
              <button
                onClick={() => removeHeader(i)}
                className="text-slate-500 hover:text-red-400 text-sm px-1"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addHeader}
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            + Add header
          </button>
        </div>
      )}

      {/* Body tab */}
      {tab === 'body' && (
        <div className={expanded ? 'h-[60vh]' : 'h-48'}>
          <Editor
            defaultLanguage="json"
            theme="vs-dark"
            value={request.body}
            onChange={(v) => onChange({ body: v ?? '' })}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'off',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
      )}
      {/* Variables tab */}
      {tab === 'variables' && (
        <div className={`p-3 space-y-2 overflow-y-auto ${expanded ? 'max-h-[60vh]' : 'max-h-60'}`}>
          <p className="text-xs text-slate-500 mb-1">
            Use <code className="text-slate-400">{`{{name}}`}</code> in paths, headers, and body. Keys: alphanumerics and <code className="text-slate-400">.</code> only.
          </p>
          {variables.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                placeholder="variable.name"
                value={v.key}
                onChange={(e) => onSetVariable(i, 'key', e.target.value)}
                className={`w-48 bg-slate-700 rounded px-2 py-1 text-sm text-white font-mono
                           placeholder:text-slate-500 outline-none ${
                             v.key && !isValidVariableKey(v.key) ? 'ring-1 ring-red-500' : ''
                           }`}
              />
              <input
                placeholder="value"
                value={v.value}
                onChange={(e) => onSetVariable(i, 'value', e.target.value)}
                className="flex-1 bg-slate-700 rounded px-2 py-1 text-sm text-white font-mono
                           placeholder:text-slate-500 outline-none"
              />
              <button
                onClick={() => onRemoveVariable(i)}
                className="text-slate-500 hover:text-red-400 text-sm px-1"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={onAddVariable}
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            + Add variable
          </button>
        </div>
      )}
    </div>
  );
}
