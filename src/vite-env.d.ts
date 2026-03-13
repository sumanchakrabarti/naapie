/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NAAPIE_API_BASE_URL?: string;
  readonly VITE_CLIENT_ID?: string;
  readonly VITE_TENANT_ID?: string;
  readonly VITE_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
