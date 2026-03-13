import { useState, useMemo } from 'react';
import type { SampleQuery, RequestState } from '../types';
import { defaultHeaders } from '../config/defaults';

interface Props {
  queries: SampleQuery[];
  onSelect: (patch: Partial<RequestState>) => void;
}

export default function SampleQueriesSidebar({ queries, onSelect }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => {
    const filtered = queries.filter(
      (q) =>
        q.name.toLowerCase().includes(search.toLowerCase()) ||
        q.path.toLowerCase().includes(search.toLowerCase()),
    );
    return filtered.reduce<Record<string, SampleQuery[]>>((acc, q) => {
      (acc[q.category] ??= []).push(q);
      return acc;
    }, {});
  }, [queries, search]);

  const handleSelect = (q: SampleQuery) => {
    onSelect({
      method: q.method,
      path: q.path,
      body: q.body ?? '',
      headers: q.headers
        ? Object.entries(q.headers).map(([key, value]) => ({ key, value, enabled: true }))
        : [...defaultHeaders],
    });
  };

  const methodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-green-400',
      POST: 'text-blue-400',
      PUT: 'text-amber-400',
      PATCH: 'text-orange-400',
      DELETE: 'text-red-400',
    };
    return (
      <span className={`text-[10px] font-bold font-mono ${colors[method] ?? 'text-slate-400'}`}>
        {method}
      </span>
    );
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="p-2 text-slate-400 hover:text-white transition"
        title="Show sample queries"
      >
        ▶
      </button>
    );
  }

  return (
    <aside className="w-64 shrink-0 bg-slate-850 border-r border-slate-700 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <span className="text-sm font-semibold text-slate-300">Sample queries</span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-slate-500 hover:text-slate-300 text-xs"
        >
          ◀
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-full bg-slate-700 rounded px-2 py-1 text-sm text-white
                     placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Query list */}
      <div className="flex-1 overflow-y-auto px-1 pb-2">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-2">
            <h3 className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {category}
            </h3>
            {items.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSelect(q)}
                title={q.description}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-700/60 transition
                           flex items-center gap-2 group"
              >
                {methodBadge(q.method)}
                <span className="text-sm text-slate-300 group-hover:text-white truncate">
                  {q.name}
                </span>
              </button>
            ))}
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="px-3 py-4 text-sm text-slate-500 text-center">No matching queries</p>
        )}
      </div>
    </aside>
  );
}
