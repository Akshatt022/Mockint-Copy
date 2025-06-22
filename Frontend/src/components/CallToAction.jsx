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
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-400 rounded-full animate-float opacity-60"></div>
        <div
          className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-400 rounded-full animate-float opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-float opacity-50"
          style={{ animationDelay: "2s" }}
        ></div>
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
          <h2 className="text-5xl lg:text-7xl font-bold mb-8">
            <span className="text-white">Ready to</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Ace Your Exam?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join{" "}
            <span className="text-emerald-400 font-semibold">
              50,000+ students
            </span>{" "}
            who are already boosting their preparation with AI-powered mock
            tests. Your success story starts here!
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
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
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <span className="relative z-10">Start Free Test Now</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
            </Link>

            <button className="group inline-flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-emerald-500/50 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm">
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Email Signup Section */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 max-w-2xl mx-auto">
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
                    className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
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
          <div className="mt-16 pt-8 border-t border-slate-700">
            <div className="flex items-center justify-center gap-8 text-slate-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-sm">App Store Rating</div>
              </div>
              <div className="w-px h-12 bg-slate-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm">Happy Students</div>
              </div>
              <div className="w-px h-12 bg-slate-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm">Tests Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
