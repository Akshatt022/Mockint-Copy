import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.state.trim()) newErrors.state = 'State is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required.';
    } else if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian pincode.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage("");
    setIsSubmitting(true);

    if (!validateForm()) {
      setSubmissionMessage("Please correct the errors in the form.");
      setIsSubmitting(false);
      return;
    }

    const userPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      addresses: [
        {
          address: formData.address,
          state: formData.state,
          city: formData.city,
          pincode: Number(formData.pincode),
        },
      ],
    };

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmissionMessage("Registration successful! Redirecting to dashboard...");
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setSubmissionMessage(data.error || "Registration failed. Please try again.");
        if (data.errors) {
          const backendErrors = {};
          data.errors.forEach(err => {
            backendErrors[err.field] = err.message;
          });
          setErrors(prevErrors => ({ ...prevErrors, ...backendErrors }));
        }
      }
    } catch (err) {
      console.error("Registration API error:", err);
      setSubmissionMessage("Error connecting to server. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-2xl w-full space-y-3">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-0 mb-0">
            <img
              src="/ChatGPT Image May 26, 2025, 01_25_37 PM.png"
              alt="Mockint Logo"
              className="h-22 w-22"
            />
            <span className="text-[#93c572] text-3xl font-bold tracking-wide">
              Mockint
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
          <p className="text-gray-400">Join us and start your journey today</p>
        </div>

        {/* Form Container */}
        <div className="bg-[#1e1e1e] shadow-2xl rounded-2xl p-8 border border-gray-800">
          {/* Success/Error Message */}
          {submissionMessage && (
            <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
              submissionMessage.includes('successful') 
                ? 'bg-green-900/20 text-green-400 border border-green-800' 
                : 'bg-red-900/20 text-red-400 border border-red-800'
            }`}>
              {submissionMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  }`}
                  aria-invalid={errors.name ? "true" : "false"}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  }`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 ${
                    errors.phone ? 'border-red-500' : 'border-gray-700'
                  }`}
                  aria-invalid={errors.phone ? "true" : "false"}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-11 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-700'
                    }`}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-11 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                    }`}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 resize-none ${
                    errors.address ? 'border-red-500' : 'border-gray-700'
                  }`}
                  aria-invalid={errors.address ? "true" : "false"}
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 ${
                    errors.state ? 'border-red-500' : 'border-gray-700'
                  }`}
                  aria-invalid={errors.state ? "true" : "false"}
                />
                {errors.state && <p className="mt-1 text-sm text-red-400">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 ${
                    errors.city ? 'border-red-500' : 'border-gray-700'
                  }`}
                  aria-invalid={errors.city ? "true" : "false"}
                />
                {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-300 mb-2">
                  Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  pattern="\d{6}"
                  placeholder="123456"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:border-transparent transition duration-200 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-700'
                  }`}
                  aria-invalid={errors.pincode ? "true" : "false"}
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-400">{errors.pincode}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#93c572] hover:bg-[#7fa85a] text-[#121212] font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#93c572] focus:ring-offset-2 focus:ring-offset-[#1e1e1e] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#121212] mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-[#93c572] hover:text-[#7fa85a] font-medium transition duration-200 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;