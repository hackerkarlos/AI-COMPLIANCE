'use client';

import { Badge } from '@/components/ui';
import type { MatchResult } from '@/lib/regulations/matching';

interface StepReviewProps {
  matches: MatchResult[];
}

export function StepReview({ matches }: StepReviewProps) {
  const applicable = matches.filter((m) => m.is_applicable);
  const notApplicable = matches.filter((m) => !m.is_applicable);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Applicable Regulations</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Based on your answers, we&apos;ve identified {applicable.length} regulation
          {applicable.length === 1 ? '' : 's'} that apply to your business.
        </p>
      </div>

      {applicable.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            ✓ Applies to You ({applicable.length})
          </h3>
          <div className="space-y-2">
            {applicable.map((m) => (
              <div
                key={m.regulation_id}
                className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{m.short_name}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                      {m.name}
                    </p>
                  </div>
                  <Badge variant={m.risk_level as 'low' | 'medium' | 'high' | 'critical'}>
                    {m.risk_level}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                  <span className="font-medium text-[var(--color-foreground)]">Why:</span>{' '}
                  {m.reason}
                </p>
                {m.enforcement_date && (
                  <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                    Enforcement date:{' '}
                    {new Date(m.enforcement_date).toLocaleDateString('en-DK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {notApplicable.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Not Applicable ({notApplicable.length})
          </h3>
          <div className="space-y-2">
            {notApplicable.map((m) => (
              <div
                key={m.regulation_id}
                className="rounded-lg border border-[var(--color-border)] p-4 opacity-60"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{m.short_name}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                      {m.name}
                    </p>
                  </div>
                  <Badge variant={m.risk_level as 'low' | 'medium' | 'high' | 'critical'}>
                    {m.risk_level}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
