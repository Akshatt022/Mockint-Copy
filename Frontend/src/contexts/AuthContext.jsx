import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const verifyToken = useCallback(async () => {
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      clearSession();
      setIsLoading(false);
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Verify failed with status ${response.status}`);
      }

      const data = await response.json();
      const responseData = data.data || data;
      const resolvedUser = responseData.user || data.user;

      if (!resolvedUser) {
        throw new Error('Verification response missing user');
      }

      localStorage.setItem('userData', JSON.stringify(resolvedUser));
      setUser(resolvedUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      clearSession();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || data.message };
      }

      const responseData = data.data || data;
      const token = responseData.token || data.token;
      const resolvedUser = responseData.user || data.user;

      if (token) {
        localStorage.setItem('token', token);
      }

      if (resolvedUser) {
        localStorage.setItem('userData', JSON.stringify(resolvedUser));
        setUser(resolvedUser);
      }

      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to connect to server' };
    }
  };

  const logout = useCallback(() => {
    clearSession();
    navigate('/login', { replace: true });
  }, [clearSession, navigate]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
