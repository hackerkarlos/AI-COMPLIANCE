'use client';

import type { MatchResult } from '@/lib/regulations/matching';

interface StepConfirmProps {
  companyName: string;
  matches: MatchResult[];
}

export function StepConfirm({ companyName, matches }: StepConfirmProps) {
  const applicable = matches.filter((m) => m.is_applicable);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Confirm & Complete</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Review your setup and complete onboarding to start tracking compliance.
        </p>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h3 className="font-semibold">{companyName}</h3>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
              What happens next
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex gap-2">
                <span>📋</span>
                <span>
                  <span className="font-medium">{applicable.length} regulation{applicable.length === 1 ? '' : 's'}</span>{' '}
                  will be tracked for your company
                </span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>
                  Compliance checklists will be initialized for each applicable regulation
                </span>
              </li>
              <li className="flex gap-2">
                <span>📊</span>
                <span>
                  Your dashboard will show compliance progress and urgent actions
                </span>
              </li>
              <li className="flex gap-2">
                <span>🤖</span>
                <span>
                  AI-powered assessments will help identify gaps and prioritize actions
                </span>
              </li>
            </ul>
          </div>

          {applicable.length > 0 && (
            <div className="border-t border-[var(--color-border)] pt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Applicable Regulations
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {applicable.map((m) => (
                  <span
                    key={m.regulation_id}
                    className="inline-flex rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 px-3 py-1 text-xs font-medium"
                  >
                    {m.short_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-[var(--color-muted-foreground)]">
        You can update your company profile and re-evaluate regulations at any time from Settings.
      </p>
    </div>
  );
}
