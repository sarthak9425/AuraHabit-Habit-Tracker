import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockApi } from '../services/mockApi';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let active = true;
    mockApi.getCurrentUser().then((currentUser) => { if (active) setUser(currentUser); })
      .catch((error) => { if (active) setAuthError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setAuthError('');
    try { const loggedInUser = await mockApi.login(email, password); setUser(loggedInUser); return loggedInUser; }
    catch (error) { setAuthError(error.message); throw error; }
    finally { setLoading(false); }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true); setAuthError('');
    try { const newUser = await mockApi.register(name, email, password); setUser(newUser); return newUser; }
    catch (error) { setAuthError(error.message); throw error; }
    finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => { try { await mockApi.logout(); } finally { setUser(null); } }, []);
  return <AuthContext.Provider value={{ user, loading, authError, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
