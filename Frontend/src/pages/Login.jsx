import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful! Redirecting...");
        setIsAuthenticated(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (e) {
      setMessage("Failed to connect to the server.",e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnRegister = () => {
    navigate('/register');
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16">
            <img src="/ChatGPT Image May 26, 2025, 01_25_37 PM.png" alt="Mockint Logo" className="h-20 w-25" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Mockint
          </h1>
          <p className="text-gray-600 text-lg">Welcome back! Please sign in to continue</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl"></div>
          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg border transition-all duration-300 ${
                message.includes('successful') 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {message.includes('successful') ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50' 
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-50/50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.password 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50' 
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={handleOnRegister}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure login powered by JWT authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
