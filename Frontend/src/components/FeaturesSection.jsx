// Enhanced FeaturesSection.jsx - Improved Text Visibility
import React from 'react';
import { Brain, Target, BarChart3, Clock, Users, Award, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Test Generation',
    description: 'Smart algorithm creates personalized tests based on your performance and learning gaps.',
    color: 'from-emerald-500 to-teal-600',
    stats: '99% Accuracy'
  },
  {
    icon: Target,
    title: 'Multi-Stream Support',
    description: 'Comprehensive coverage for JEE, NEET, GATE, UPSC, CAT, and 50+ other competitive exams.',
    color: 'from-purple-500 to-indigo-600',
    stats: '50+ Exams'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Deep insights into your performance with AI-driven recommendations and progress tracking.',
    color: 'from-blue-500 to-cyan-600',
    stats: 'Real-time'
  },
  {
    icon: Clock,
    title: 'Adaptive Learning',
    description: 'Personalized study plans that adapt to your pace and learning style for maximum efficiency.',
    color: 'from-amber-500 to-orange-600',
    stats: '3x Faster'
  },
  {
    icon: Users,
    title: 'Peer Comparison',
    description: 'Compare your performance with thousands of students and see where you stand.',
    color: 'from-pink-500 to-rose-600',
    stats: '50K+ Users'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Bank-grade security with 99.9% uptime ensures your data is safe and accessible.',
    color: 'from-slate-500 to-slate-600',
    stats: '99.9% Uptime'
  }
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-800 dark">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Background Elements for Better Visual Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Enhanced Section Header */}
        <div className="text-center justify-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <Zap className="w-5 h-5 text-emerald-300" />
            <span className="text-emerald-300 text-sm font-semibold">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8">
            <span className="text-white">Why Choose </span>
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Mockint?</span>
          </h2>
          <p className="text-lg sm:text-xl text-center text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium px-4 sm:px-0">
            Experience the next generation of exam preparation with AI-powered insights,
            personalized learning paths, and comprehensive analytics.
           
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                {/* Enhanced Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Enhanced Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Enhanced Content */}
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 leading-tight">
                        {feature.title}
                      </h3>
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-full backdrop-blur-sm whitespace-nowrap ml-2">
                        {feature.stats}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed font-medium text-base">
                      {feature.description}
                    </p>
                  </div>

                  {/* Enhanced Bottom Accent */}
                  <div className={`mt-8 h-1.5 w-16 bg-gradient-to-r ${feature.color} rounded-full group-hover:w-full transition-all duration-500 shadow-lg`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-3 text-slate-200 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
            <Award className="w-6 h-6 text-emerald-400" />
            <span className="font-semibold text-lg text-gray-200">Trusted by 50,000+ students across India</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;