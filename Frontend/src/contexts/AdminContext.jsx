import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verify admin token on mount
  useEffect(() => {
    verifyAdminToken();
  }, []);

  const verifyAdminToken = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setAdmin(null);
        setIsLoading(false);
        return;
      }

      // You can add a verify endpoint for admin if needed
      // For now, just check if token exists and is valid format
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin' && payload.exp > Date.now() / 1000) {
          setAdmin({
            id: payload.id,
            email: payload.email,
            role: payload.role
          });
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    } catch (error) {
      console.error('Admin token verification failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        // Handle non-JSON response (like rate limit messages)
        const text = await response.text();
        data = { message: text };
      }

      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify({
          name: data.admin?.name || data.name,
          email: email
        }));
        
        // Parse token to get admin info
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setAdmin({
          id: payload.id,
          email: email,
          name: data.admin?.name || data.name,
          role: payload.role
        });
        setIsAuthenticated(true);
        
        return { success: true, name: data.admin?.name || data.name };
      } else {
        return { success: false, error: data.error || data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Failed to connect to server' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    setIsAuthenticated(false);
    navigate('/admin');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const value = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthHeaders
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};