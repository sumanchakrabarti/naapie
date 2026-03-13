import type { HttpMethod, RequestState } from '../types';

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-green-400',
  POST: 'text-blue-400',
  PUT: 'text-amber-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
};

interface Props {
  request: RequestState;
  onChange: (patch: Partial<RequestState>) => void;
  onRun: () => void;
  onCancel: () => void;
  loading: boolean;
  baseUrl: string;
  baseUrls: Array<{ label: string; url: string }>;
  onBaseUrlChange: (url: string) => void;
}

export default function QueryBar({ request, onChange, onRun, onCancel, loading, baseUrl, baseUrls, onBaseUrlChange }: Props) {
  return (
    <div className="flex items-center gap-2 bg-slate-800 rounded-none p-2">
      {/* Method selector */}
      <select
        value={request.method}
        onChange={(e) => onChange({ method: e.target.value as HttpMethod })}
        className={`bg-slate-700 rounded-none px-3 py-2 text-sm font-mono font-bold
                    outline-none cursor-pointer ${methodColors[request.method]}`}
      >
        {methods.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Base URL dropdown */}
      <select
        value={baseUrl}
        onChange={(e) => onBaseUrlChange(e.target.value)}
        title={baseUrl}
        className="bg-slate-700 rounded-none px-2 py-2 text-sm font-mono text-slate-400
                   outline-none cursor-pointer shrink-0 max-w-64 truncate"
      >
        {baseUrls.map((b) => (
          <option key={b.url} value={b.url}>
            {b.label} — {b.url}
          </option>
        ))}
      </select>

      {/* Path input */}
      <input
        type="text"
        value={request.path}
        onChange={(e) => onChange({ path: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onRun()}
        placeholder="/me"
        className="flex-1 bg-slate-700 rounded-none px-3 py-2 text-sm font-mono text-white
                   placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Run / Cancel button */}
      <button
        onClick={loading ? onCancel : onRun}
        className={`rounded-none px-5 py-2 text-sm font-medium text-white
                   transition whitespace-nowrap ${
                     loading
                       ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                       : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                   }`}
      >
        {loading ? 'Cancel' : 'Run query'}
      </button>
    </div>
  );
}
