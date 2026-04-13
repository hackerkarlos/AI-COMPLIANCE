'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Creating your compliance profile\u2026',
  'Matching applicable regulations\u2026',
  'Initialising compliance checklists\u2026',
  'Running initial assessment\u2026',
  'Preparing your dashboard\u2026',
];

const MESSAGE_INTERVAL_MS = 1_600;

interface ComplianceLoadingProps {
  /** Called once the minimum display time has elapsed AND the API has returned. */
  onReady: () => void;
  /** Set to true when the API call is complete (success path). */
  apiDone: boolean;
  minDisplayMs?: number;
}

export function ComplianceLoading({
  onReady,
  apiDone,
  minDisplayMs = 4_000,
}: ComplianceLoadingProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [minElapsed, setMinElapsed] = useState(false);

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Minimum display timer
  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), minDisplayMs);
    return () => clearTimeout(timer);
  }, [minDisplayMs]);

  // Redirect once BOTH conditions are met
  useEffect(() => {
    if (apiDone && minElapsed) {
      onReady();
    }
  }, [apiDone, minElapsed, onReady]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-8 py-16">
      {/* Animated spinner */}
      <div className="relative h-20 w-20">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="var(--color-border)"
            strokeWidth="6"
          />
          {/* Animated arc */}
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="var(--color-accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="213.6"
            strokeDashoffset="53.4"
            className="origin-center animate-spin"
            style={{ animationDuration: '1.2s' }}
          />
        </svg>
        {/* Shield icon centred inside the spinner */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl" aria-hidden="true">
          🛡️
        </div>
      </div>

      {/* Status message */}
      <div className="text-center">
        <p
          key={msgIndex}
          className="animate-pulse text-base font-medium text-[var(--color-foreground)]"
        >
          {MESSAGES[msgIndex]}
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          This only takes a moment
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5" aria-hidden="true">
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              i <= msgIndex ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
