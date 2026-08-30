import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import TTSButton from '../components/TTSButton.jsx';
import BigButton from '../components/BigButton.jsx';
import NotifyFamilyButton from '../components/NotifyFamilyButton.jsx';

/**
 * EscalationScreen — Shown when AI confidence is too low, or it's a money
 * screen with borderline confidence.
 *
 * Honest, non-alarming. Does NOT make up an answer.
 * Offers: call bank, call family, try clearer photo.
 */
export default function EscalationScreen() {
  const navigate = useNavigate();
  const { analysisResult, language } = useApp();
  const s = useLanguage(language);

  useEffect(() => {
    if (!analysisResult) {
      navigate('/', { replace: true });
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { escalation_message, involves_money, confidence } = analysisResult;

  const mainMessage =
    escalation_message ||
    (involves_money
      ? `This screen looks like it might involve money or banking. I'm not confident enough to give you advice — please call your bank helpline or ask a family member.`
      : `I couldn't fully understand this screen. Please call your bank helpline or ask a family member before doing anything.`);

  const ttsText = [s.escalationTitle, mainMessage].join('. ');

  return (
    <main className="screen">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-7xl select-none" role="img" aria-label="Thinking">🤔</span>
        <h1 className="text-elder-xl font-bold text-slate-100">{s.escalationTitle}</h1>
        <p className="text-slate-400 text-elder-sm">{s.escalationSubtext}</p>
      </div>

      {/* Money warning badge */}
      {involves_money && (
        <div className="card-warn w-full flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <p className="text-warn-300 text-elder-sm font-medium">
            This screen looks like it involves money or banking — extra caution is wise.
          </p>
        </div>
      )}

      {/* Main message */}
      <div className="card w-full">
        <p className="text-slate-100 text-elder-base leading-relaxed">{mainMessage}</p>
      </div>

      {/* TTS */}
      <TTSButton text={ttsText} autoPlay={true} />

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full">
        <a href={`tel:${s.bankHelpline}`} className="btn-primary w-full" role="button">
          {s.callBank}
        </a>

        <NotifyFamilyButton
          summary={`Your family member was confused by a screen and ScreenSaathi was not sure what to advise. ${involves_money ? 'The screen may involve money or banking. ' : ''}Please call them to help.`}
        />

        <BigButton variant="secondary" onClick={() => navigate('/')}>
          {s.tryBetterPhoto}
        </BigButton>
      </div>
    </main>
  );
}
