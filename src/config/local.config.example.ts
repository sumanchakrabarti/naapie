/**
 * Local configuration — NOT committed to git.
 * ─────────────────────────────────────────────
 * Copy local.config.example.ts → local.config.ts and customise
 * for your team's API. This file overrides the default sample
 * queries, base URLs, and default headers.
 */
import type { SampleQuery } from '../types';
import type { RequestState } from '../types';

export interface LocalConfig {
  /** Base URLs shown in the dropdown. First entry is selected by default. */
  baseUrls?: Array<{ label: string; url: string }>;
  /** Sample queries shown in the sidebar. */
  sampleQueries?: SampleQuery[];
  /** Default headers pre-populated for every new request. */
  defaultHeaders?: RequestState['headers'];
  /** Brand colors (CSS color values). Applied as CSS custom properties. */
  brandColors?: {
    primary?: string;
    primaryHover?: string;
    primaryActive?: string;
  };
}

const config: LocalConfig = {
  baseUrls: [
    { label: 'My API (dev)', url: 'http://localhost:9211/v0.1' },
    { label: 'My API (prod)', url: 'https://api.example.com/v1' },
  ],

  sampleQueries: [
    {
      id: 'health-check',
      category: 'System',
      name: 'Health check',
      method: 'GET',
      path: '/health',
      description: 'Check if the API is running.',
    },
    // Add your team's queries here...
  ],

  // Uncomment to override default headers:
  // defaultHeaders: [
  //   { key: 'Authorization', value: 'Bearer <token>', enabled: true },
  //   { key: 'Content-Type', value: 'application/json', enabled: true },
  //   { key: 'X-Custom-Header', value: 'my-value', enabled: true },
  // ],

  // Uncomment to set brand colors:
  // brandColors: {
  //   primary: '#7c3aed',       // violet-600
  //   primaryHover: '#6d28d9',  // violet-700
  //   primaryActive: '#5b21b6', // violet-800
  // },
};

export default config;
