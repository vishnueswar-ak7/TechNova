import React from 'react';
import { useTTS } from '../hooks/useTTS.js';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';

/**
 * TTSButton — Read-aloud toggle button.
 * Auto-plays on mount by default. Shows play/pause state clearly.
 */
export default function TTSButton({ text, autoPlay = true }) {
  const { language } = useApp();
  const s = useLanguage(language);
  const { play, stop, isPlaying, isSupported } = useTTS(text, language, autoPlay);

  if (!isSupported) return null;

  return (
    <button
      onClick={isPlaying ? stop : play}
      aria-label={isPlaying ? s.stopReading : s.readAloud}
      className={`
        inline-flex items-center justify-center gap-2
        min-h-touch px-6 py-3 rounded-2xl font-semibold text-elder-sm
        border-2 transition-all duration-150 active:scale-95 select-none w-full
        ${isPlaying
          ? 'bg-brand-600/20 border-brand-500 text-brand-300'
          : 'bg-slate-700 border-slate-600 text-slate-200 hover:border-slate-500'
        }
      `}
    >
      <span className="text-2xl">{isPlaying ? '⏸' : '🔊'}</span>
      <span>{isPlaying ? s.stopReading : s.readAloud}</span>
    </button>
  );
}
