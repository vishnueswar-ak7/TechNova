import React from 'react';

/**
 * LoadingSpinner — Three animated dots for the "thinking" state.
 * Friendly, non-alarming animation for elderly users.
 */
export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center gap-6" role="status" aria-label={label}>
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="thinking-dot w-5 h-5 rounded-full bg-brand-500"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="text-slate-400 text-elder-sm text-center">{label}</p>
    </div>
  );
}
