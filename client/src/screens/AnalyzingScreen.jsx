import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import { useAnalyze } from '../hooks/useAnalyze.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import BigButton from '../components/BigButton.jsx';

/**
 * AnalyzingScreen — Shown while the AI is processing the screenshot.
 *
 * Displays a friendly "thinking" animation and a cancel button.
 * If somehow reached without an active request (e.g. direct navigation),
 * redirects to home immediately.
 */
export default function AnalyzingScreen() {
  const { language } = useApp();
  const s = useLanguage(language);
  const navigate = useNavigate();
  const { cancel } = useAnalyze();

  // Safety: if no request is in flight (e.g. user refreshed on this page),
  // send them home so they don't see a stuck spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      // If we're still here after 40s, something went wrong — go home
    }, 40_000);
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    cancel();
    navigate('/');
  };

  return (
    <main className="screen items-center justify-center gap-10">
      {/* Thinking animation */}
      <div className="flex flex-col items-center gap-8">
        <span className="text-8xl animate-bounce-slow select-none" role="img" aria-hidden="true">
          🔍
        </span>
        <LoadingSpinner label={s.analyzingSubtext} />
      </div>

      {/* Status text */}
      <div className="text-center">
        <p className="text-elder-xl font-semibold text-slate-200">{s.analyzing}</p>
        <p className="text-slate-400 text-elder-sm mt-2">{s.analyzingSubtext}</p>
      </div>

      {/* Cancel button */}
      <BigButton variant="secondary" onClick={handleCancel} className="max-w-xs">
        {s.cancel}
      </BigButton>
    </main>
  );
}
