import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import TTSButton from '../components/TTSButton.jsx';
import BigButton from '../components/BigButton.jsx';
import NotifyFamilyButton from '../components/NotifyFamilyButton.jsx';

/**
 * UndoMeResultScreen — Shows the result of the "What did I just do?" flow.
 *
 * Uses the same analysis engine as the main flow, but with a different
 * framing: "here's what changed / what the current state means."
 * The mode='undome' flag in the API prompt tells the AI to focus on
 * explaining the current state rather than giving a next action.
 */
export default function UndoMeResultScreen() {
  const navigate = useNavigate();
  const { analysisResult, language, setMode } = useApp();
  const s = useLanguage(language);

  useEffect(() => {
    if (!analysisResult) {
      navigate('/', { replace: true });
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { reassurance, explanation, next_action } = analysisResult;

  const ttsText = [reassurance, explanation, next_action]
    .filter(Boolean)
    .join('. ');

  return (
    <main className="screen">
      {/* Header */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-4xl select-none">↩</span>
        <h1 className="text-elder-xl font-bold text-slate-100">{s.undomeTitle}</h1>
      </div>

      {/* Reassurance */}
      <div className="card-safe w-full">
        <p className="text-safe-500 text-elder-sm font-semibold uppercase tracking-wide mb-2">
          {s.reassurance}
        </p>
        <p className="text-slate-100 text-elder-lg font-semibold leading-relaxed">
          {reassurance || s.undomeSubtext}
        </p>
      </div>

      {/* Explanation of what happened */}
      <div className="card w-full">
        <p className="text-brand-300 text-elder-sm font-semibold uppercase tracking-wide mb-2">
          {s.whatItMeans}
        </p>
        <p className="text-slate-200 text-elder-base leading-relaxed">{explanation}</p>
      </div>

      {/* Recovery / next action if any */}
      {next_action && (
        <div className="w-full bg-brand-600/20 border-2 border-brand-500 rounded-3xl p-6">
          <p className="text-brand-300 text-elder-sm font-semibold uppercase tracking-wide mb-3">
            {s.whatToDo}
          </p>
          <div className="flex items-start gap-4">
            <span className="text-4xl mt-1 select-none" aria-hidden="true">👉</span>
            <p className="text-slate-100 text-elder-lg font-bold leading-relaxed">{next_action}</p>
          </div>
        </div>
      )}

      {/* TTS */}
      <TTSButton text={ttsText} autoPlay={true} />

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <NotifyFamilyButton />

        <div className="flex gap-3">
          <BigButton
            variant="secondary"
            fullWidth={false}
            className="flex-1"
            onClick={() => { setMode('stuck'); navigate('/'); }}
          >
            📸 {s.showScreen.replace('📸 ', '')}
          </BigButton>
          <BigButton
            variant="secondary"
            fullWidth={false}
            className="flex-1"
            onClick={() => navigate('/')}
          >
            {s.goHome}
          </BigButton>
        </div>
      </div>
    </main>
  );
}
