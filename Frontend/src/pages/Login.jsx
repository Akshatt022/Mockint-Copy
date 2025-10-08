// src/pages/Login.jsx - Enhanced Modern UI with Animations
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Loader, Shield, User, Sparkles, ArrowRight, Brain, Target, Award, Zap, Chrome } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createOAuthUrl } from "../config/api";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  const defaultRedirectUri = typeof window !== 'undefined' ? `${window.location.origin}/oauth-success` : '';
  const oauthRedirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URL || defaultRedirectUri;
  const oauthProviders = [
    {
      id: 'google',
      label: 'Continue with Google',
      description: 'Use your Google account',
      icon: Chrome,
    },
  ];


  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: inputValue }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear general message when user starts typing
    if (message) setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if too many failed attempts
    if (loginAttempts >= 5) {
      setMessage("Too many failed attempts. Please try again later.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await login(formData.email.trim().toLowerCase(), formData.password);

      if (result.success) {
        // Handle remember me
        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        setMessage("Login successful! Redirecting...");
        setLoginAttempts(0); // Reset attempts on success
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        setMessage(result.error || "Login failed");
        setLoginAttempts(prev => prev + 1);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Failed to connect to the server. Please check your connection and try again.");
      setLoginAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      setMessage("Please enter your email address first.");
      return;
    }
    setMessage("Password reset feature coming soon!");
  };

  const handleOAuthLogin = (provider) => {
    const params = {};

    if (oauthRedirectUri) {
      params.redirect = oauthRedirectUri;
    }

    window.location.href = createOAuthUrl(provider, params);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            >
              <div className={`w-2 h-2 bg-emerald-400 rounded-full opacity-30 ${i % 3 === 0 ? 'animate-pulse' : ''}`}></div>
            </div>
          ))}
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="h-full w-full" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      </div>

      {/* Left Side - Animated Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-lg">
          {/* Animated Logo */}
          <div className="flex items-center gap-4 mb-12 animate-slide-down">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 animate-pulse-glow">
                <span className="text-white font-bold text-3xl">M</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-pulse flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Mockint</h1>
              <p className="text-gray-400">Ace Your Exams</p>
            </div>
          </div>

          {/* Welcome Text with Animation */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Welcome back to your
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              success journey
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 leading-relaxed animate-slide-up animation-delay-200">
            Join 50,000+ students who are transforming their exam preparation with AI-powered mock tests and personalized learning paths.
          </p>

          {/* Animated Features */}
          <div className="space-y-4">
            {[
              { icon: Brain, text: "AI-Powered Learning", desc: "Smart recommendations for better results", delay: "0" },
              { icon: Target, text: "Targeted Practice", desc: "Focus on your weak areas", delay: "100" },
              { icon: Award, text: "Track Progress", desc: "Detailed analytics and insights", delay: "200" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 group animate-slide-right"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-xl flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-400 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">{feature.text}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Animated Stats */}
          <div className="mt-12 flex items-center gap-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 animate-scale-up">50K+</div>
              <div className="text-xs sm:text-sm text-gray-400">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 animate-scale-up" style={{ animationDelay: '200ms' }}>98%</div>
              <div className="text-xs sm:text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-pink-400 animate-scale-up" style={{ animationDelay: '400ms' }}>4.9★</div>
              <div className="text-xs sm:text-sm text-gray-400">App Rating</div>
            </div>
          </div>
        </div>

        {/* Floating Icons Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="absolute bottom-1/4 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-emerald-500/30">
              <Brain className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md animate-scale-up">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Mockint</h1>
            </div>
          </div>

          {/* Login Card with Glassmorphism */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-500 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-gray-400">Sign in to continue your learning journey</p>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl border transition-all duration-300 animate-slide-down ${
                message.includes('successful') 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <div className="flex items-center gap-3">
                  {message.includes('successful') ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className={`relative group ${focusedField === 'email' ? 'scale-[1.02]' : ''} transition-transform duration-200`}>
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-emerald-400' : 'text-gray-500'
                  }`} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-field ${
                      errors.email ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {/* Focus Glow Effect */}
                  {focusedField === 'email' && (
                    <div className="absolute inset-0 rounded-lg bg-emerald-500/20 blur-xl -z-10 animate-pulse-glow" />
                  )}
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-slide-down">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className={`relative group ${focusedField === 'password' ? 'scale-[1.02]' : ''} transition-transform duration-200`}>
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-emerald-400' : 'text-gray-500'
                  }`} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-field pr-12 ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {/* Focus Glow Effect */}
                  {focusedField === 'password' && (
                    <div className="absolute inset-0 rounded-lg bg-emerald-500/20 blur-xl -z-10 animate-pulse-glow" />
                  )}
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-slide-down">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-500 border-gray-600 rounded focus:ring-emerald-500 bg-gray-700 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline transition-all duration-200"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || loginAttempts >= 5}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center">
                <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
                <span className="px-4 text-xs font-semibold tracking-[0.3em] uppercase text-gray-500">Or continue with</span>
                <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-1">
                {oauthProviders.map(({ id, label, description, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleOAuthLogin(id)}
                    className="group flex items-center justify-start gap-4 rounded-xl border border-gray-700 bg-gray-800/40 px-4 py-3 text-sm font-semibold text-gray-100 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label={description || label}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/80 transition-colors duration-300 group-hover:bg-gray-900">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-left">
                      <span className="block font-semibold">{label}</span>
                      {description && (
                        <span className="block text-xs text-gray-400 group-hover:text-gray-300">{description}</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                New to Mockint?{' '}
                <Link
                  to="/register"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-all duration-200 inline-flex items-center gap-1 group"
                >
                  Create an account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secured with 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;