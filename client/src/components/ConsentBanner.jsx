import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import BigButton from './BigButton.jsx';

/**
 * ConsentBanner — Shown once per session on first use.
 * Explains data handling in plain language in the user's selected language.
 * No localStorage — shown every new session (intentional, keeps it honest).
 */
export default function ConsentBanner({ onAccept }) {
  const { language } = useApp();
  const s = useLanguage(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4">
      <div className="card max-w-md w-full flex flex-col gap-6">
        {/* Icon */}
        <div className="text-center text-6xl">🙏</div>

        {/* Title */}
        <h2 className="text-elder-xl font-bold text-center text-slate-100">
          {s.consentTitle}
        </h2>

        {/* Body */}
        <p className="text-elder-base text-slate-300 text-center leading-relaxed">
          {s.consentText}
        </p>

        {/* Privacy points */}
        <ul className="flex flex-col gap-3">
          {[
            '🔒 Your screenshots are deleted immediately after analysis',
            '🚫 Nothing is stored or shared',
            '👨‍👩‍👧 Family notifications send only a text summary — never your image',
          ].map((point) => (
            <li key={point} className="flex items-start gap-3 text-slate-400 text-elder-sm">
              <span className="text-xl leading-none mt-0.5">{point.slice(0, 2)}</span>
              <span>{point.slice(2).trim()}</span>
            </li>
          ))}
        </ul>

        {/* Accept button */}
        <BigButton onClick={onAccept} variant="primary">
          {s.consentButton}
        </BigButton>
      </div>
    </div>
  );
}
