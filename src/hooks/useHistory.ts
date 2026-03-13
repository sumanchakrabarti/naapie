import { useState, useCallback, useEffect } from 'react';
import type { HistoryEntry, RequestState, ResponseState } from '../types';

const STORAGE_KEY = 'naaipe-history';
const MAX_ENTRIES = 50;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadHistory);

  useEffect(() => {
    saveHistory(entries);
  }, [entries]);

  const addEntry = useCallback(
    (request: RequestState, response: ResponseState, resolvedPath: string) => {
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        request: { ...request },
        resolvedPath,
        status: response.status,
        statusText: response.statusText,
        duration: response.duration,
      };
      setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
    },
    [],
  );

  const clearHistory = useCallback(() => {
    setEntries([]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, addEntry, removeEntry, clearHistory };
}
