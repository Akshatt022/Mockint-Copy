// components/LoadingStates.jsx
import React from 'react';

// Skeleton Components
export const SkeletonCard = () => (
  <div className="bg-slate-800/50 border border-slate-600/30 rounded-2xl p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-6 bg-slate-700 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3 mt-1"></div>
      </div>
      <div className="ml-4 flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-slate-700 rounded"></div>
        ))}
      </div>
    </div>
    
    <div className="flex items-center space-x-4 mb-4">
      <div className="h-4 bg-slate-700 rounded w-16"></div>
      <div className="h-4 bg-slate-700 rounded w-16"></div>
      <div className="h-4 bg-slate-700 rounded w-16"></div>
    </div>
    
    <div className="h-6 bg-slate-700 rounded w-24 mb-6"></div>
    <div className="h-12 bg-slate-700 rounded-xl"></div>
  </div>
);

export const SkeletonTestGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(count)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonNavbar = () => (
  <div className="bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
          <div className="w-24 h-6 bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-16 h-4 bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="w-24 h-8 bg-slate-700 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Enhanced Loading Button
export const LoadingButton = ({ loading, children, ...props }) => (
  <button
    {...props}
    disabled={loading}
    className={`${props.className} relative`}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    )}
    <span className={loading ? 'opacity-0' : 'opacity-100'}>
      {children}
    </span>
  </button>
);

// Page Loading Overlay
export const PageLoader = () => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-600 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-white font-medium">Loading...</div>
        <div className="text-slate-400 text-sm">Please wait while we prepare your content</div>
      </div>
    </div>
  </div>
);