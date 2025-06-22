// Enhanced Navbar.jsx with better spacing and padding
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, User, ChevronDown, LogOut, Settings, Award } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-md shadow-xl border-b border-slate-700/50' 
        : 'bg-slate-900/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo - More Compact */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Mockint
            </span>
          </Link>

          {/* Desktop Navigation - Compact */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 font-medium text-[15px] py-2 px-3 rounded-md hover:bg-slate-800/50"
            >
              Home
            </Link>
            <Link 
              to="/testSection" 
              className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 font-medium text-[15px] py-2 px-3 rounded-md hover:bg-slate-800/50"
            >
              Tests
            </Link>
            <Link 
              to="/about" 
              className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 font-medium text-[15px] py-2 px-3 rounded-md hover:bg-slate-800/50"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 font-medium text-[15px] py-2 px-3 rounded-md hover:bg-slate-800/50"
            >
              Contact
            </Link>
          </div>

          {/* User Actions - Compact */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-slate-800/70 hover:bg-slate-700/70 px-3 py-1.5 rounded-lg transition-all duration-200 border border-slate-600/30 hover:border-emerald-500/30"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <User size={12} className="text-white" />
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                
                {isProfileOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-44 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-xl py-1 z-20">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-700/50 hover:text-emerald-400 transition-colors duration-200 text-sm"
                        onClick={closeMenu}
                      >
                        <User size={14} />
                        <span>Profile</span>
                      </Link>
                      <Link 
                        to="/achievements" 
                        className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-700/50 hover:text-emerald-400 transition-colors duration-200 text-sm"
                        onClick={closeMenu}
                      >
                        <Award size={14} />
                        <span>Achievements</span>
                      </Link>
                      <Link 
                        to="/settings" 
                        className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-700/50 hover:text-emerald-400 transition-colors duration-200 text-sm"
                        onClick={closeMenu}
                      >
                        <Settings size={14} />
                        <span>Settings</span>
                      </Link>
                      <hr className="border-slate-700/50 my-1" />
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-slate-700/50 hover:text-red-300 w-full text-left transition-colors duration-200 text-sm"
                      >
                        <LogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 font-medium text-sm py-1.5 px-3 rounded-md hover:bg-slate-800/50"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - Compact */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-300 hover:text-emerald-400 transition-colors duration-200 p-1.5 rounded-md hover:bg-slate-800/50"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation - Improved */}
        {isMenuOpen && (
          <>
            {/* Mobile Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10 md:hidden" 
              onClick={closeMenu}
            />
            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-xl z-20 md:hidden">
              <div className="px-4 py-3 space-y-1">
                <Link 
                  to="/" 
                  className="block px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 rounded-md text-sm font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/testSection" 
                  className="block px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 rounded-md text-sm font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Tests
                </Link>
                <Link 
                  to="/about" 
                  className="block px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 rounded-md text-sm font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="block px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 rounded-md text-sm font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
                
                {/* Mobile Auth Section */}
                <div className="border-t border-slate-700/50 pt-3 mt-3">
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 rounded-md text-sm"
                        onClick={closeMenu}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      <Link 
                        to="/achievements" 
                        className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 rounded-md text-sm"
                        onClick={closeMenu}
                      >
                        <Award size={16} />
                        <span>Achievements</span>
                      </Link>
                      <Link 
                        to="/settings" 
                        className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 rounded-md text-sm"
                        onClick={closeMenu}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-slate-700/50 rounded-md text-sm w-full text-left"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link 
                        to="/login" 
                        className="block px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 rounded-md text-sm font-medium"
                        onClick={closeMenu}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="block px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md text-sm font-medium text-center"
                        onClick={closeMenu}
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar