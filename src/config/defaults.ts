import type { RequestState } from '../types';

/**
 * Default headers pre-populated for every new request.
 * These are used when the app loads and when a sample query
 * doesn't specify its own headers.
 */
export const defaultHeaders: RequestState['headers'] = [
  { key: 'Authorization', value: 'Bearer <token>', enabled: true },
  { key: 'Content-Type', value: 'application/json', enabled: true },
  { key: 'User-Agent', value: 'NaApiE/1.0', enabled: true },
];

/**
 * List of base URLs available in the URL dropdown.
 * ★ Customize this list when forking NaApiE for your own APIs. ★
 *
 * The first entry is selected by default.
 * The NAAPIE_API_BASE_URL env var is always prepended if set.
 */
export const baseUrls: Array<{ label: string; url: string }> = [
  { label: 'Graph v1.0', url: 'https://graph.microsoft.com/v1.0' },
  { label: 'Graph beta', url: 'https://graph.microsoft.com/beta' },
];
