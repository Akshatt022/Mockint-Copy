import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TestsSection from "./pages/TestSection";
import OAuthSuccess from "./pages/OAuthSuccess";
import OAuthError from "./pages/OAuthError";
import AdminLogin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { FEATURES } from './config/environment';

function App() {
  const AdminPanel = FEATURES.ADMIN_MODE;

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={AdminPanel ? (
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                ) : (
                  <Navigate to="/login" />
                )}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="/oauth-error" element={<OAuthError />} />
              <Route
                path="/testSection"
                element={
                  <ProtectedRoute>
                    <TestsSection />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
