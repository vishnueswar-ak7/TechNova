import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import TTSButton from '../components/TTSButton.jsx';
import BigButton from '../components/BigButton.jsx';
import NotifyFamilyButton from '../components/NotifyFamilyButton.jsx';

/**
 * ScamWarningScreen — Shown when the AI or rule engine detects a scam pattern.
 *
 * Distinct amber/orange visual palette — clearly different from normal result.
 * NO next-action instruction is shown.
 * Primary actions: call bank helpline, notify family.
 */
export default function ScamWarningScreen() {
  const navigate = useNavigate();
  const { analysisResult, language } = useApp();
  const s = useLanguage(language);

  useEffect(() => {
    if (!analysisResult) {
      navigate('/', { replace: true });
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { scam_reason, escalation_message } = analysisResult;

  const ttsText = [s.scamWarningTitle, escalation_message || scam_reason]
    .filter(Boolean)
    .join('. ');

  const warningText = escalation_message || scam_reason || s.scamWarningSubtext;

  return (
    <main className="screen">
      {/* Warning header */}
      <div className="w-full bg-warn-500/15 border-2 border-warn-500 rounded-3xl p-6 flex flex-col items-center gap-4 text-center">
        <span className="text-6xl animate-pulse-slow select-none" role="img" aria-label="Warning">
          ⚠️
        </span>
        <h1 className="text-elder-xl font-bold text-warn-400 leading-tight">
          {s.scamWarningTitle}
        </h1>
        <p className="text-slate-200 text-elder-sm leading-relaxed">{s.scamWarningSubtext}</p>
      </div>

      {/* What was flagged */}
      {scam_reason && (
        <div className="card-warn w-full">
          <p className="text-warn-400 text-elder-sm font-semibold mb-2">⚠️ What we noticed:</p>
          <p className="text-slate-200 text-elder-base leading-relaxed">{scam_reason}</p>
        </div>
      )}

      {/* Escalation instruction */}
      <div className="card w-full">
        <p className="text-slate-100 text-elder-base font-semibold leading-relaxed">
          {warningText}
        </p>
      </div>

      {/* TTS */}
      <TTSButton text={ttsText} autoPlay={true} />

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full">
        {/* Call bank */}
        <a
          href={`tel:${s.bankHelpline}`}
          className="btn-warn w-full"
          role="button"
        >
          {s.callBank}
        </a>

        {/* Notify family */}
        <NotifyFamilyButton
          summary={`IMPORTANT: ScreenSaathi detected a possible scam on your family member's screen. ${scam_reason || ''} They have been advised not to enter any information. Please call them to help.`}
        />

        {/* Go home */}
        <BigButton variant="secondary" onClick={() => navigate('/')}>
          {s.goHome}
        </BigButton>
      </div>
    </main>
  );
}
