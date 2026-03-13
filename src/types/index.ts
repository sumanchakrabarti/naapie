export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface SampleQuery {
  id: string;
  category: string;
  name: string;
  method: HttpMethod;
  path: string;
  body?: string;
  headers?: Record<string, string>;
  description?: string;
}

export interface RequestState {
  method: HttpMethod;
  path: string;
  headers: Array<{ key: string; value: string; enabled: boolean }>;
  body: string;
}

export interface ResponseState {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  request: RequestState;
  resolvedPath: string;
  status: number;
  statusText: string;
  duration: number;
}
