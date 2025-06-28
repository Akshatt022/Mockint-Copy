// components/CallToActionSection.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Zap,
  Users,
  Award,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const CallToActionSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail("");
    }
  };

  const features = [
    { icon: Zap, text: "AI-Powered Test Generation" },
    { icon: Users, text: "50,000+ Active Students" },
    { icon: Award, text: "98% Success Rate" },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Enhanced Animated Background - Matching Login */}
      <div className="absolute inset-0">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">
              Join the Success Story
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8">
            <span className="text-white">Ready to</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Ace Your Exam?
            </span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Join{" "}
            <span className="text-emerald-400 font-semibold">
              50,000+ students
            </span>{" "}
            who are already boosting their preparation with AI-powered mock
            tests. Your success story starts here!
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-300"
                >
                  <IconComponent className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              to="/testSection"
              className="group relative inline-flex items-center justify-center gap-3 btn-primary text-base sm:text-lg font-bold overflow-hidden hover:shadow-glow-lg w-full sm:w-auto"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <span className="relative z-10">Start Free Test Now</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
            </Link>

            <button className="group inline-flex items-center gap-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-500/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Email Signup Section */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Get Started in 30 Seconds
            </h3>
            <p className="text-slate-300 mb-6">
              No credit card required. Start with our free tier and upgrade
              anytime.
            </p>

            {!isSubmitted ? (
              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-field px-6 py-4 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary whitespace-nowrap"
                >
                  Get Started Free
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">
                  Thanks! Check your email for next steps.
                </span>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-dark-700">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-slate-400">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">4.9★</div>
                <div className="text-xs sm:text-sm">App Store Rating</div>
              </div>
              <div className="w-px h-12 bg-slate-700 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">50K+</div>
                <div className="text-xs sm:text-sm">Happy Students</div>
              </div>
              <div className="w-px h-12 bg-slate-700 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">1M+</div>
                <div className="text-xs sm:text-sm">Tests Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
