import { useState, useCallback, useRef } from 'react';
import type { RequestState, ResponseState } from '../types';
import { useAuth } from '../auth/AuthContext';

export default function useApiRequest() {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseState | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const run = useCallback(
    async (request: RequestState, apiBaseUrl: string) => {
      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setResponse(null);

      const effectiveBase = apiBaseUrl.replace(/\/+$/, '');

      try {
        const headers: Record<string, string> = {};
        for (const h of request.headers) {
          if (h.enabled && h.key) headers[h.key] = h.value;
        }

        const hasManualAuth = request.headers.some(
          (h) => h.enabled && h.key.toLowerCase() === 'authorization',
        );

        if (!hasManualAuth && isAuthenticated) {
          const token = await getAccessToken();
          if (token) headers['Authorization'] = `Bearer ${token}`;
        }

        const url = `${effectiveBase}${request.path.startsWith('/') ? '' : '/'}${request.path}`;

        const start = performance.now();
        const res = await fetch(url, {
          method: request.method,
          headers,
          body: ['POST', 'PUT', 'PATCH'].includes(request.method)
            ? request.body || undefined
            : undefined,
          signal: controller.signal,
        });
        const duration = Math.round(performance.now() - start);

        const bodyText = await res.text();

        const resHeaders: Record<string, string> = {};

        const rawHeadersJson = res.headers.get('x-naapie-raw-headers');
        if (rawHeadersJson) {
          try {
            Object.assign(resHeaders, JSON.parse(rawHeadersJson));
          } catch { /* fall through */ }
        }

        res.headers.forEach((v, k) => {
          if (k !== 'x-naapie-raw-headers') resHeaders[k] = v;
        });

        const result: ResponseState = {
          status: res.status,
          statusText: res.statusText,
          headers: resHeaders,
          body: bodyText,
          duration,
        };
        setResponse(result);
        return result;
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setResponse({
            status: 0,
            statusText: 'Cancelled',
            headers: {},
            body: JSON.stringify({ error: 'Request cancelled by user' }, null, 2),
            duration: 0,
          });
          return null;
        }
        const message = err instanceof Error ? err.message : String(err);
        const result: ResponseState = {
          status: 0,
          statusText: 'Network Error',
          headers: {},
          body: JSON.stringify({ error: message }, null, 2),
          duration: 0,
        };
        setResponse(result);
        return result;
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [isAuthenticated, getAccessToken],
  );

  return { run, cancel, loading, response };
}
