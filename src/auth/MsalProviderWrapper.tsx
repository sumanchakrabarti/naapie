import { type ReactNode, useMemo } from 'react';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig, loginRequest, API_BASE_URL } from './authConfig';
import { AuthContext, NoAuthProvider, type AuthContextValue } from './AuthContext';

const clientId = import.meta.env.VITE_CLIENT_ID;
const msalInstance = clientId ? new PublicClientApplication(msalConfig) : null;

if (msalInstance) {
  msalInstance.addEventCallback((event) => {
    if (
      event.eventType === EventType.LOGIN_SUCCESS &&
      event.payload &&
      'account' in event.payload &&
      event.payload.account
    ) {
      msalInstance.setActiveAccount(event.payload.account);
    }
  });
}

function MsalAuthBridge({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = accounts[0] ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      userName: account?.name ?? account?.username ?? null,
      login: () => instance.loginPopup(loginRequest).then(() => {}),
      logout: () => instance.logoutPopup().then(() => {}),
      getAccessToken: async () => {
        if (!account) return null;
        try {
          const res = await instance.acquireTokenSilent({
            scopes: [API_BASE_URL.replace(/\/+$/, '') + '/.default'],
            account,
          });
          return res.accessToken;
        } catch {
          const res = await instance.acquireTokenPopup({
            scopes: [API_BASE_URL.replace(/\/+$/, '') + '/.default'],
          });
          return res.accessToken;
        }
      },
    }),
    [instance, accounts, isAuthenticated, account],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function MsalProviderWrapper({ children }: { children: ReactNode }) {
  if (!msalInstance) return <NoAuthProvider>{children}</NoAuthProvider>;
  return (
    <MsalProvider instance={msalInstance}>
      <MsalAuthBridge>{children}</MsalAuthBridge>
    </MsalProvider>
  );
}
