import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../context/AppContext.jsx';
import { loginWithGoogle } from '../services/api.js';

export default function LoginScreen() {
  const { user, setUser, isAuthLoading, highContrast } = useApp();
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  if (isAuthLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${highContrast ? 'theme-high-contrast' : ''}`}>
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  // If already logged in, redirect to dashboard (HomeScreen)
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSuccess = async (credentialResponse) => {
    setAuthError(null);
    const { data, error } = await loginWithGoogle(credentialResponse.credential);
    if (error) {
      setAuthError(error);
      return;
    }
    setUser(data.user);
    navigate('/');
  };

  const handleError = () => {
    setAuthError('Google Login Failed. Please try again.');
  };

  return (
    <div className={`screen flex items-center justify-center pb-8 ${highContrast ? 'theme-high-contrast' : ''}`}>
      <main className="w-full max-w-md mx-auto flex flex-col items-center gap-8 pt-12 px-6">
        
        {/* App logo + name */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-7xl select-none" role="img" aria-label="Folded hands">🙏</span>
          <h1 className="text-4xl font-bold text-slate-100">Trustwise</h1>
          <p className="text-slate-400 text-lg text-center font-medium">Your helpful screen companion</p>
        </div>

        <div className="w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 flex flex-col items-center shadow-2xl">
          <h2 className="text-xl text-white font-semibold mb-6">Sign in to continue</h2>
          
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="pill"
            theme="filled_black"
            size="large"
            text="continue_with"
          />

          {authError && (
            <div role="alert" className="mt-6 p-4 rounded-xl bg-red-900/40 border border-red-500/50 w-full text-center">
              <p className="text-red-300 text-sm font-medium">{authError}</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
