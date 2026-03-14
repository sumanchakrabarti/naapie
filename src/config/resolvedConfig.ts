/**
 * Resolved configuration — merges local.config.ts (if present) over defaults.
 *
 * To customise for your team:
 *   cp src/config/local.config.example.ts src/config/local.config.ts
 * Then edit local.config.ts (it's gitignored).
 */
import type { SampleQuery } from '../types';
import type { RequestState } from '../types';
import { defaultHeaders as builtinHeaders, baseUrls as builtinBaseUrls } from './defaults';
import builtinSampleQueries from './sampleQueries';

interface LocalConfig {
  baseUrls?: Array<{ label: string; url: string }>;
  sampleQueries?: SampleQuery[];
  defaultHeaders?: RequestState['headers'];
  brandColors?: {
    primary?: string;
    primaryHover?: string;
    primaryActive?: string;
  };
}

let localConfig: LocalConfig = {};
try {
  // Vite's import.meta.glob with eager gives us the module at build time if the file exists
  const modules = import.meta.glob('./local.config.ts', { eager: true });
  const mod = modules['./local.config.ts'] as { default?: LocalConfig } | undefined;
  if (mod?.default) localConfig = mod.default;
} catch {
  // No local config — use defaults
}

export const resolvedBaseUrls = localConfig.baseUrls ?? builtinBaseUrls;
export const resolvedSampleQueries = localConfig.sampleQueries ?? builtinSampleQueries;
export const resolvedDefaultHeaders = localConfig.defaultHeaders ?? builtinHeaders;
export const resolvedBrandColors = localConfig.brandColors;
