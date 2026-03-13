import type { Configuration, PopupRequest } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_CLIENT_ID ?? '';
const tenantId = import.meta.env.VITE_TENANT_ID ?? 'common';
const redirectUri = import.meta.env.VITE_REDIRECT_URI ?? window.location.origin;

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

export const loginRequest: PopupRequest = {
  scopes: ['User.Read'],
};

export const API_BASE_URL =
  import.meta.env.NAAPIE_API_BASE_URL ?? 'http://localhost:9211/v0.1';
