import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Verify token on mount and when token changes
  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch('http://localhost:5000/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Handle new API response format that wraps data
        const responseData = data.data || data;
        const user = responseData.user || data.user;
        
        setUser(user);
        setIsAuthenticated(true);
      } else {
        // Token is invalid or expired
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Handle new API response format that wraps data
        const responseData = data.data || data;
        const token = responseData.token || data.token;
        const user = responseData.user || data.user;
        
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('userData', JSON.stringify(user));
          setUser(user);
        }
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to connect to server' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    verifyToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};