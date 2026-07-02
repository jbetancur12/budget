import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { login as apiLogin, refresh as apiRefresh, logout as apiLogout } from '../api/auth';

interface User {
  id: number;
  email: string;
  name: string;
}

interface PersistedAuth {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = 'budget_auth';

function persist(data: PersistedAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadPersisted(): PersistedAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedAuth;
  } catch {
    return null;
  }
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const stored = loadPersisted();
    if (!stored) {
      setState({ user: null, loading: false });
      return;
    }

    // Try to refresh token on mount
    apiRefresh(stored.refreshToken)
      .then((result) => {
        persist({ ...stored, accessToken: result.accessToken, refreshToken: result.refreshToken });
        setState({ user: stored.user, loading: false });
      })
      .catch(() => {
        clearStorage();
        setState({ user: null, loading: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    persist({ user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
    setState({ user: result.user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    clearStorage();
    setState({ user: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
