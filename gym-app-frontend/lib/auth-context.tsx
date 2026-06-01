'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { api, AuthUser, RegisterPayload } from './api';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthCtx = createContext<AuthContextValue | null>(null);

function loadAuth(): AuthState {
  if (typeof window === 'undefined') return { token: null, user: null };
  try {
    const token = localStorage.getItem('irondesk:token');
    const raw = localStorage.getItem('irondesk:user');
    return { token, user: raw ? (JSON.parse(raw) as AuthUser) : null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadAuth);

  const persist = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem('irondesk:token', token);
    localStorage.setItem('irondesk:user', JSON.stringify(user));
    setAuth({ token, user });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token, user } = await api.auth.login({ email, password });
      persist(token, user);
    },
    [persist],
  );

  const register = useCallback(
    async (data: RegisterPayload) => {
      await api.auth.register(data);
      await login(data.email, data.password);
    },
    [login],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('irondesk:token');
    localStorage.removeItem('irondesk:user');
    setAuth({ token: null, user: null });
  }, []);

  return (
    <AuthCtx.Provider value={{ ...auth, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
