// src/context/AuthContext.tsx
'use client'
import { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User { id: string; email: string; avatarUrl?: string; name:string; }
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // On mount, check if user is already logged in
  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
