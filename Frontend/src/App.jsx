import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './index.css'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TestsSection from "./pages/TestSection";
import AdminLogin from "./pages/Admin"
import AdminDashboard from "./pages/Admin_Dashboard";
import { ThemeProvider } from './contexts/ThemeContext';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const AdminPanel = import.meta.env.VITE_ADMIN_MODE;
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

    if (isAuthenticated === null) {
    // Optional: add a loading spinner or skeleton screen here
    return <div className="text-center text-white mt-20">Checking authentication...</div>;
  }
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route
          path="/admin/login"
          element={(AdminPanel === "ADMIN") ?<AdminLogin/>:<Navigate to="/login" />}
        />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard/>}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard />: <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/register"
          element={ <Register />}
        />
        <Route
          path="/testSection"
          element={ isAuthenticated ? <TestsSection/> : <Navigate to="/login" />}
        />
        
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
