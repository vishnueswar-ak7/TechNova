import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
];

/**
 * LanguageSelector — Three large toggle buttons for language selection.
 * The selected language is highlighted. Switching language updates global context.
 */
export default function LanguageSelector() {
  const { language, setLanguage } = useApp();

  return (
    <div className="flex gap-2 w-full" role="group" aria-label="Select language">
      {LANGUAGES.map((lang) => {
        const isSelected = language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            aria-pressed={isSelected}
            className={`
              flex-1 flex flex-col items-center justify-center gap-1
              min-h-[64px] rounded-2xl border-2 font-semibold
              text-elder-sm transition-all duration-150 active:scale-95 select-none
              ${isSelected
                ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/30'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
              }
            `}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}
