import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useApp();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full" role="group" aria-label="Select language">
      {LANGUAGES.map((lang) => {
        const isSelected = language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            aria-pressed={isSelected}
            className={`
              flex items-center justify-center
              min-h-[56px] rounded-2xl border-2 font-semibold
              text-elder-sm transition-all duration-150 active:scale-95 select-none
              ${isSelected
                ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/30'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
              }
            `}
          >
            <span className="text-sm font-medium">{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}
