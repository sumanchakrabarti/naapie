import type { HttpMethod, RequestState } from '../types';

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-[var(--method-get)]',
  POST: 'text-[var(--method-post)]',
  PUT: 'text-[var(--method-put)]',
  PATCH: 'text-[var(--method-patch)]',
  DELETE: 'text-[var(--method-delete)]',
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
    <div className="flex items-center gap-2 bg-[var(--surface-2)] rounded-none p-2">
      {/* Method selector */}
      <select
        value={request.method}
        onChange={(e) => onChange({ method: e.target.value as HttpMethod })}
        className={`bg-[var(--surface-3)] rounded-none px-3 py-2 text-sm font-mono font-bold
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
        className="bg-[var(--surface-3)] rounded-none px-2 py-2 text-sm font-mono text-[var(--text-secondary)]
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
        className="flex-1 bg-[var(--surface-3)] rounded-none px-3 py-2 text-sm font-mono text-[var(--text-primary)]
                   placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
      />

      {/* Run / Cancel button */}
      <button
        onClick={loading ? onCancel : onRun}
        className={`rounded-none px-5 py-2 text-sm font-medium text-white
                   transition whitespace-nowrap ${
                     loading
                       ? 'bg-[var(--status-error)] hover:bg-[var(--status-error)]/80 active:bg-[var(--status-error)]/60'
                       : 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]'
                   }`}
      >
        {loading ? 'Cancel' : 'Run query'}
      </button>
    </div>
  );
}
