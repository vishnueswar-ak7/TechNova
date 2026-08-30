import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import TTSButton from '../components/TTSButton.jsx';
import BigButton from '../components/BigButton.jsx';
import NotifyFamilyButton from '../components/NotifyFamilyButton.jsx';

/**
 * ResultScreen — The main success output screen.
 *
 * Shows:
 *   1. Reassurance (green, prominent)
 *   2. What the screen means (explanation)
 *   3. ONE highlighted next action with arrow
 *   4. Read Aloud button (auto-plays)
 *   5. Notify Family button
 *   6. Try again / UndoMe buttons
 */
export default function ResultScreen() {
  const navigate = useNavigate();
  const { analysisResult, language, setMode } = useApp();
  const s = useLanguage(language);

  // Guard: if no result in context (e.g. refresh), go home
  useEffect(() => {
    if (!analysisResult) {
      navigate('/', { replace: true });
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { reassurance, explanation, next_action } = analysisResult;

  // Build the TTS text: reassurance + explanation + next action
  const ttsText = [reassurance, explanation, next_action]
    .filter(Boolean)
    .join('. ');

  const handleTryAgain = () => {
    setMode('stuck');
    navigate('/');
  };

  const handleUndoMe = () => {
    setMode('undome');
    navigate('/');
  };

  return (
    <main className="screen">
      {/* Header */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-4xl">✅</span>
        <h1 className="text-elder-xl font-bold text-slate-100">{s.appName}</h1>
      </div>

      {/* Reassurance card — shown first, largest, green */}
      <div className="card-safe w-full">
        <p className="text-safe-500 text-elder-sm font-semibold uppercase tracking-wide mb-2">
          {s.reassurance}
        </p>
        <p className="text-slate-100 text-elder-lg font-semibold leading-relaxed">
          {reassurance}
        </p>
      </div>

      {/* Explanation */}
      <div className="card w-full">
        <p className="text-brand-300 text-elder-sm font-semibold uppercase tracking-wide mb-2">
          {s.whatItMeans}
        </p>
        <p className="text-slate-200 text-elder-base leading-relaxed">{explanation}</p>
      </div>

      {/* Next action — highlighted, with arrow */}
      {next_action && (
        <div className="w-full bg-brand-600/20 border-2 border-brand-500 rounded-3xl p-6">
          <p className="text-brand-300 text-elder-sm font-semibold uppercase tracking-wide mb-3">
            {s.whatToDo}
          </p>
          <div className="flex items-start gap-4">
            <span className="text-4xl mt-1 select-none" role="img" aria-hidden="true">👉</span>
            <p className="text-slate-100 text-elder-lg font-bold leading-relaxed">{next_action}</p>
          </div>
        </div>
      )}

      {/* TTS Button */}
      <TTSButton text={ttsText} autoPlay={true} />

      {/* Secondary actions */}
      <div className="flex flex-col gap-3 w-full">
        <NotifyFamilyButton />

        <div className="flex gap-3">
          <BigButton
            variant="secondary"
            fullWidth={false}
            className="flex-1"
            onClick={handleUndoMe}
          >
            ↩ {s.undoMe}
          </BigButton>
          <BigButton
            variant="secondary"
            fullWidth={false}
            className="flex-1"
            onClick={handleTryAgain}
          >
            📸 {s.tryAgain.replace('📸 ', '')}
          </BigButton>
        </div>
      </div>
    </main>
  );
}
