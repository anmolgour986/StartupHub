import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('sh_token');
      const cachedUser = localStorage.getItem('sh_user');
      if (!token) {
        setLoading(false);
        return;
      }
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          /* ignore */
        }
      }
      try {
        const { data } = await authAPI.me();
        setUser(data.user);
        localStorage.setItem('sh_user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem('sh_token');
        localStorage.removeItem('sh_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('sh_token', data.token);
    localStorage.setItem('sh_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authAPI.register(payload);
    localStorage.setItem('sh_token', data.token);
    localStorage.setItem('sh_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('sh_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
