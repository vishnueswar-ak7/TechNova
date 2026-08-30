import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import { notifyFamily } from '../services/api.js';
import BigButton from './BigButton.jsx';

/**
 * NotifyFamilyButton — One-tap family notification with a confirmation dialog.
 * Only sends a text summary — never the image.
 */
export default function NotifyFamilyButton({ summary }) {
  const { language, familyContact, setFamilyContact, analysisResult } = useApp();
  const s = useLanguage(language);
  const [showDialog, setShowDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleOpen = () => {
    setStatusMsg(null);
    setShowDialog(true);
  };

  const handleSend = async () => {
    if (!familyContact.email && !familyContact.phone) {
      setStatusMsg(s.notifyError);
      return;
    }

    setIsSending(true);
    setStatusMsg(null);

    const textSummary = summary || [
      analysisResult?.reassurance,
      analysisResult?.explanation,
      analysisResult?.next_action,
    ]
      .filter(Boolean)
      .join(' ');

    const { success, error } = await notifyFamily(textSummary, familyContact);

    setIsSending(false);

    if (success) {
      setStatusMsg(s.notifySent);
      setTimeout(() => setShowDialog(false), 2000);
    } else {
      setStatusMsg(error || s.notifyError);
    }
  };

  return (
    <>
      <BigButton variant="secondary" onClick={handleOpen}>
        {s.notifyFamily}
      </BigButton>

      {/* Modal dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md flex flex-col gap-5">
            <h3 className="text-elder-lg font-bold text-slate-100">{s.notifyFamilyTitle}</h3>
            <p className="text-slate-400 text-elder-sm">{s.notifyFamilyDesc}</p>

            {/* Email input */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-elder-sm font-medium">
                {s.contactEmail}
              </label>
              <input
                type="email"
                value={familyContact.email}
                onChange={(e) =>
                  setFamilyContact((c) => ({ ...c, email: e.target.value }))
                }
                placeholder="family@example.com"
                className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-elder-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-touch"
              />
            </div>

            {/* Phone input */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-elder-sm font-medium">
                {s.contactPhone}
              </label>
              <input
                type="tel"
                value={familyContact.phone}
                onChange={(e) =>
                  setFamilyContact((c) => ({ ...c, phone: e.target.value }))
                }
                placeholder="+91 98765 43210"
                className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-elder-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-touch"
              />
            </div>

            {/* Status message */}
            {statusMsg && (
              <p
                className={`text-elder-sm text-center ${
                  statusMsg.startsWith('✅') ? 'text-safe-500' : 'text-danger-500'
                }`}
              >
                {statusMsg}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <BigButton
                variant="secondary"
                fullWidth={false}
                className="flex-1"
                onClick={() => setShowDialog(false)}
                disabled={isSending}
              >
                {s.cancel}
              </BigButton>
              <BigButton
                variant="primary"
                fullWidth={false}
                className="flex-1"
                onClick={handleSend}
                disabled={isSending}
              >
                {isSending ? s.sending : s.send}
              </BigButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
