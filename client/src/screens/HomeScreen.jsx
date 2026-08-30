import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import { useAnalyze } from '../hooks/useAnalyze.js';
import LanguageSelector from '../components/LanguageSelector.jsx';
import BigButton from '../components/BigButton.jsx';
import ConsentBanner from '../components/ConsentBanner.jsx';

/**
 * HomeScreen — The app's entry point.
 *
 * Single primary action: upload/capture a screenshot.
 * Secondary action: UndoMe flow.
 * Language selector at the top.
 * Consent banner on first visit per session.
 */
export default function HomeScreen() {
  const { language, error, setError, resetAnalysis, setMode, consentGiven, setConsentGiven } = useApp();
  const s = useLanguage(language);
  const { submit, isLoading } = useAnalyze();
  const fileInputRef = useRef(null);
  const undoFileInputRef = useRef(null);

  // Reset any previous analysis state when arriving at home
  useEffect(() => {
    resetAnalysis();
  }, [resetAnalysis]);

  const handleFileChange = async (e, mode = 'stuck') => {
    const file = e.target.files?.[0];
    // Reset input so same file can be re-selected
    e.target.value = '';
    if (!file) return;

    // Validate type client-side before sending
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError(s.invalidFile);
      return;
    }

    setMode(mode);
    setError(null);
    await submit(file);
  };

  return (
    <>
      {/* Consent banner — shown once per session */}
      {!consentGiven && (
        <ConsentBanner onAccept={() => setConsentGiven(true)} />
      )}

      <main className="screen">
        {/* App logo + name */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <span className="text-7xl select-none" role="img" aria-label="Folded hands">🙏</span>
          <h1 className="text-elder-2xl font-bold text-slate-100">{s.appName}</h1>
          <p className="text-slate-400 text-elder-sm text-center">{s.tagline}</p>
        </div>

        {/* Language selector */}
        <section className="w-full" aria-label={s.changeLanguage}>
          <LanguageSelector />
        </section>

        {/* Demo mode banner */}
        <div className="w-full bg-brand-600/10 border border-brand-500/40 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🎮</span>
          <p className="text-brand-300 text-sm leading-snug">
            <strong>Demo Mode</strong> — Upload any image to see all screens. Each upload cycles through a different response type (normal → scam warning → escalation → email).
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="card-danger w-full flex items-start gap-3"
          >
            <span className="text-2xl">⚠️</span>
            <p className="text-danger-300 text-elder-sm">{error}</p>
          </div>
        )}

        {/* Primary action: Show Your Screen */}
        <section className="w-full flex flex-col gap-4">
          <label
            htmlFor="screenshot-upload"
            className={`btn-primary w-full cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={isLoading}
          >
            <span className="text-3xl">📸</span>
            <span>{s.showScreen}</span>
          </label>
          <input
            ref={fileInputRef}
            id="screenshot-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="sr-only"
            onChange={(e) => handleFileChange(e, 'stuck')}
            disabled={isLoading}
          />

          {/* Secondary action: UndoMe */}
          <label
            htmlFor="undome-upload"
            className={`btn-secondary w-full cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={isLoading}
          >
            <span className="text-2xl">↩</span>
            <span>{s.undoMe}</span>
          </label>
          <input
            ref={undoFileInputRef}
            id="undome-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="sr-only"
            onChange={(e) => handleFileChange(e, 'undome')}
            disabled={isLoading}
          />
        </section>

        {/* Privacy note */}
        <p className="text-slate-500 text-sm text-center pb-4">
          🔒 Your screenshot is deleted immediately after analysis
        </p>
      </main>
    </>
  );
}
