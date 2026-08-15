'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);


  

  async function loadUser() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await api.get('/auth/me');
      console.log(data); 

      setUser(data);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  

  useEffect(() => {
    loadUser();
  }, []);

  async function login(token: string) {
    localStorage.setItem('token', token);

    await loadUser();
  }

  function logout() {
    localStorage.removeItem('token');

    setUser(null);

    window.location.href = '/login';
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}