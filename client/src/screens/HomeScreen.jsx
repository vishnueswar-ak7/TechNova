import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import { useAnalyze } from '../hooks/useAnalyze.js';
import { useSpeechInput } from '../hooks/useSpeechInput.js';
import LanguageSelector from '../components/LanguageSelector.jsx';
import BigButton from '../components/BigButton.jsx';
import ConsentBanner from '../components/ConsentBanner.jsx';

export default function HomeScreen() {
  const { language, error, setError, resetAnalysis, setMode, consentGiven, setConsentGiven, highContrast, setHighContrast, user, handleLogout } = useApp();
  const s = useLanguage(language);
  const { submit, isLoading } = useAnalyze();
  const fileInputRef = useRef(null);
  const undoFileInputRef = useRef(null);

  // Clear previous state on mount
  useEffect(() => {
    resetAnalysis();
  }, [resetAnalysis]);

  // Handle standard file upload
  const handleFileChange = (e, flowMode) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(s.imageTooLarge);
      return;
    }
    setMode(flowMode);
    submit(file, flowMode);
  };

  const handleLiveShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Wait for video to load metadata and play
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Give it a tiny delay to ensure the screen frame is actually rendered
      await new Promise(r => setTimeout(r, 500));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Stop all tracks to end screen sharing immediately
      stream.getTracks().forEach(track => track.stop());

      canvas.toBlob((blob) => {
        if (!blob) {
          setError(s.errorTitle);
          return;
        }
        const file = new File([blob], 'screenshot.png', { type: 'image/png' });
        setMode('stuck');
        submit(file, 'stuck');
      }, 'image/png');
    } catch (err) {
      console.error(err);
      if (err.name !== 'NotAllowedError') {
        setError(s.errorTitle);
      }
    }
  };

  // Handle Voice Input
  const handleVoiceCommand = (transcript) => {
    console.log("Heard:", transcript);
    // Simple heuristic: if they mention undo, back, what did I do
    const lower = transcript.toLowerCase();
    if (lower.includes('undo') || lower.includes('what') || lower.includes('back')) {
      // Trigger undo flow upload
      if (undoFileInputRef.current) {
        undoFileInputRef.current.click();
      }
    } else {
      // Default stuck flow
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const { start: startVoice, isListening, isSupported: isVoiceSupported } = useSpeechInput(language, handleVoiceCommand);

  if (!consentGiven) {
    return <ConsentBanner onAccept={() => setConsentGiven(true)} />;
  }

  return (
    <div className="screen items-center justify-start pb-8">
      <main className="w-full max-w-md mx-auto flex flex-col gap-6 pt-4">
        
        {/* Top Controls: Profile, Logout & High Contrast */}
        <div className="flex justify-between items-center w-full px-2">
          {user && (
            <div className="flex items-center gap-2">
              {user.picture ? (
                <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full border border-slate-600" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs border border-slate-600">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200 leading-tight">{user.name?.split(' ')[0] || 'User'}</span>
                <button onClick={handleLogout} className="text-[10px] text-slate-400 hover:text-white text-left underline">Log out</button>
              </div>
            </div>
          )}
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className="text-sm font-medium border border-slate-600 rounded-full px-4 py-1.5 text-slate-300 hover:bg-slate-800 ml-auto"
          >
            {highContrast ? '🎨 Normal Mode' : '👁️ ' + s.highContrastMode}
          </button>
        </div>

        {/* App logo + name */}
        <div className="flex flex-col items-center gap-3 mt-2">
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
            <strong>Demo Mode</strong> — Upload any image to see all screens.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div role="alert" className="card-danger w-full flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-danger-300 text-elder-sm">{error}</p>
          </div>
        )}

        {/* Primary actions */}
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

          {/* Live Screen Share (Web) */}
          {navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && (
            <button
              onClick={handleLiveShare}
              disabled={isLoading}
              className="btn-primary bg-indigo-600 border-indigo-500 text-white shadow-indigo-900/40 hover:bg-indigo-500 w-full"
            >
              <span className="text-3xl">🔴</span>
              <span>{s.liveScreen || 'Share Live Screen'}</span>
            </button>
          )}

          {/* Voice Command */}
          {isVoiceSupported && (
            <button
              onClick={isListening ? undefined : startVoice}
              disabled={isLoading}
              className={`btn-secondary w-full ${isListening ? 'bg-green-600 border-green-500 text-white animate-pulse' : ''}`}
            >
              <span className="text-3xl">🎤</span>
              <span>{isListening ? s.analyzing : s.speak}</span>
            </button>
          )}

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
    </div>
  );
}
