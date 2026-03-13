import { createContext, useContext, type ReactNode } from 'react';

export interface AuthContextValue {
  isAuthenticated: boolean;
  userName: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const defaultValue: AuthContextValue = {
  isAuthenticated: false,
  userName: null,
  login: async () => {},
  logout: async () => {},
  getAccessToken: async () => null,
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

export function useAuth() {
  return useContext(AuthContext);
}

export function NoAuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>;
}
