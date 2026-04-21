import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('ecowise_token');
    const storedUser = localStorage.getItem('ecowise_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('ecowise_token');
        localStorage.removeItem('ecowise_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: newToken, user: newUser } = res.data;
    
    localStorage.setItem('ecowise_token', newToken);
    localStorage.setItem('ecowise_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return res;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token: newToken, user: newUser } = res.data;
    
    localStorage.setItem('ecowise_token', newToken);
    localStorage.setItem('ecowise_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ecowise_token');
    localStorage.removeItem('ecowise_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.me();
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('ecowise_user', JSON.stringify(updatedUser));
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
