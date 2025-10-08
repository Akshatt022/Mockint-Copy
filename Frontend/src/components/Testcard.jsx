import React from 'react';
import { Clock, Users, BookOpen, ArrowRight, Award, Target } from 'lucide-react';

const TestCard = ({ 
  title, 
  subtitle = "Free Mock Test",
  duration = "120 mins",
  questions = "100",
  attempts = "12,345",
  difficulty = "Moderate",
  color = "emerald",
  icon: Icon = BookOpen
}) => {
  const colorClasses = {
    emerald: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      hover: 'hover:border-emerald-400/50 hover:bg-emerald-500/5'
    },
    purple: {
      gradient: 'from-purple-500 to-indigo-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      hover: 'hover:border-purple-400/50 hover:bg-purple-500/5'
    },
    blue: {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      hover: 'hover:border-blue-400/50 hover:bg-blue-500/5'
    }
  };

  const colors = colorClasses[color] || colorClasses.emerald;

  return (
    <div className={`group relative bg-dark-800/50 backdrop-blur-sm border ${colors.border} rounded-2xl p-6 transition-all duration-300 ${colors.hover} hover:transform hover:scale-[1.02] hover:shadow-xl cursor-pointer overflow-hidden`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <span className={`text-xs font-bold ${colors.text} ${colors.bg} ${colors.border} border px-3 py-1 rounded-full`}>
            {difficulty}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
          {subtitle}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Duration</span>
            </div>
            <p className="text-sm font-semibold text-gray-300">{duration}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Target className="w-3 h-3" />
              <span className="text-xs">Questions</span>
            </div>
            <p className="text-sm font-semibold text-gray-300">{questions}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs">Attempts</span>
            </div>
            <p className="text-sm font-semibold text-gray-300">{attempts}</p>
          </div>
        </div>

        {/* Button */}
        <button className={`w-full bg-gradient-to-r ${colors.gradient} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] hover:shadow-lg hover:shadow-${color}-500/25 flex items-center justify-center gap-2`}>
          <span>Start Test</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* Achievement Badge */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>Popular</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
