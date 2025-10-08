import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const parseQuery = (search) => {
  const params = new URLSearchParams(search);
  return Object.fromEntries(params.entries());
};

const OAuthStatusCard = ({ icon: Icon, title, description, action }) => (
  <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
    <div className="flex justify-center mb-6">
      <span className="bg-slate-800/70 rounded-full p-4">
        <Icon className="h-10 w-10 text-emerald-400" />
      </span>
    </div>
    <h1 className="text-2xl font-semibold text-white mb-2">{title}</h1>
    <p className="text-slate-300 mb-6">{description}</p>
    {action}
  </div>
);

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyToken } = useAuth();
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const { token, error } = parseQuery(location.search);

    if (error) {
      setStatus('error');
      setErrorMessage(decodeURIComponent(error));
      return;
    }

    if (!token) {
      setStatus('error');
      setErrorMessage('Authentication token not found in the redirect URL.');
      return;
    }

    const handleToken = async () => {
      try {
        localStorage.setItem('token', token);
        const verified = await verifyToken();

        if (verified) {
          setStatus('success');
          setTimeout(() => navigate('/', { replace: true }), 800);
        } else {
          throw new Error('Token verification failed. Please try signing in again.');
        }
      } catch (err) {
        console.error('OAuth success handling failed:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Unexpected error while processing OAuth response.');
      }
    };

    handleToken();
  }, [location.search, navigate, verifyToken]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <OAuthStatusCard
          icon={Loader2}
          title="Signing you in..."
          description="Please wait while we finalize your secure login."
          action={<Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-400" />}
        />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <OAuthStatusCard
          icon={CheckCircle2}
          title="Login successful!"
          description="Redirecting you to your dashboard."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-rose-950/40 to-slate-950 text-white px-4">
      <OAuthStatusCard
        icon={AlertTriangle}
        title="We couldn't complete the sign-in"
        description={errorMessage || 'Something went wrong while processing your Google sign-in.'}
        action={(
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition-colors"
            >
              Back to Login
            </button>
            <button
              onClick={() => window.location.replace('/')}
              className="px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400 transition-colors"
            >
              Go Home
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default OAuthSuccess;
