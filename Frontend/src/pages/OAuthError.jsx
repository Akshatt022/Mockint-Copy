import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertOctagon, RotateCcw } from 'lucide-react';

const OAuthError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const message = decodeURIComponent(params.get('message') || 'Authentication failed. Please try again.');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-rose-950/30 to-slate-950 text-white px-4">
      <div className="bg-slate-900/60 backdrop-blur-sm border border-rose-500/40 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <span className="bg-rose-900/40 rounded-full p-4">
            <AlertOctagon className="h-10 w-10 text-rose-400" />
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-3">We hit a snag</h1>
        <p className="text-slate-300 mb-8">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition-colors"
          >
            Back to Login
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthError;
