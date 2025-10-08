// Enhanced HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, BookOpen, Award } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-emerald-400" fill="currentColor" />
              <span className="text-emerald-400 text-sm font-medium">India's #1 Mock Test Platform</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">Prepare</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Smarter</span>
                <br />
                <span className="text-white">with</span>
                <span className="text-emerald-400"> Mockint</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-lg">
                AI-powered mock tests for JEE, NEET, GATE & more. Get personalized practice, instant analytics, and ace your competitive exams.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">50K+</div>
                <div className="text-xs sm:text-sm text-slate-400">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm text-slate-400">Tests Taken</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/testSection"
                className="group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 w-full sm:w-auto"
              >
                <span>Start Free Test</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <button className="group inline-flex items-center justify-center space-x-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300 text-sm">Trusted by IIT/NIT Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-slate-300 text-sm">Award Winning Platform</span>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Illustration */}
          <div className="relative lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
            <div className="relative">
              {/* Main Image - SINGLE IMAGE ONLY */}
              <div className="relative z-10">
                <img 
                  src="/11621896-removebg-preview.png" 
                  alt="Student studying with Mockint"
                  className="w-full max-w-lg mx-auto animate-float"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute top-10 -left-10 bg-gradient-to-br from-emerald-500 to-teal-600 p-3 sm:p-4 rounded-xl shadow-lg animate-float hidden sm:block" style={{animationDelay: '1s'}}>
                <div className="text-white text-center">
                  <BookOpen className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs font-semibold">10,000+</div>
                  <div className="text-xs opacity-80">Questions</div>
                </div>
              </div>

              <div className="absolute bottom-20 -right-10 bg-gradient-to-br from-purple-500 to-indigo-600 p-3 sm:p-4 rounded-xl shadow-lg animate-float hidden sm:block" style={{animationDelay: '3s'}}>
                <div className="text-white text-center">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs font-semibold">AI Powered</div>
                  <div className="text-xs opacity-80">Analytics</div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-20 bg-gradient-to-br from-amber-500 to-orange-600 p-3 sm:p-4 rounded-xl shadow-lg animate-float hidden md:block" style={{animationDelay: '5s'}}>
                <div className="text-white text-center">
                  <Star className="w-6 h-6 mx-auto mb-2" fill="currentColor" />
                  <div className="text-xs font-semibold">4.9★</div>
                  <div className="text-xs opacity-80">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;