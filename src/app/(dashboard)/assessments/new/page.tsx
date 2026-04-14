'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';

const ASSESSMENT_TYPE_MAP: Record<string, { slug: string; label: string }> = {
  gdpr_risk: { slug: 'gdpr', label: 'GDPR Risk Assessment' },
};

const LOADING_STEPS = [
  'Analysing your company profile...',
  'Evaluating GDPR compliance gaps...',
  'Building risk matrix...',
  'Generating prioritised recommendations...',
  'Finalising report...',
];

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? 'gdpr_risk';
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasStarted = useRef(false);

  const config = ASSESSMENT_TYPE_MAP[type];

  // Cycle through loading step labels while waiting
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Trigger the assessment exactly once on mount
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    if (!config) {
      setErrorMessage(`Unknown assessment type: "${type}"`);
      return;
    }

    fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regulation_slug: config.slug }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body: { error?: string }) => {
            throw new Error(body.error ?? `HTTP ${res.status}`);
          });
        }
        return res.json() as Promise<{ assessmentId: string }>;
      })
      .then(({ assessmentId }) => {
        router.push(`/assessments/${assessmentId}` as Route);
      })
      .catch((err: Error) => {
        setErrorMessage(err.message ?? 'Assessment failed. Please try again.');
      });
  }, [config, type, router]);

  if (errorMessage) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="rounded-full bg-red-100 p-5 dark:bg-red-900/20">
          <span className="text-4xl">!</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Assessment Failed</h1>
          <p className="max-w-sm text-sm text-[var(--color-muted-foreground)]">{errorMessage}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-muted)]"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      {/* Spinner */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-accent)]" />
        <span className="text-2xl">🔍</span>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Running {config?.label ?? 'Compliance Assessment'}
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Our AI is analysing your compliance profile. This typically takes 20–40 seconds.
        </p>
      </div>

      {/* Animated step indicator */}
      <div className="w-full max-w-sm space-y-2">
        {LOADING_STEPS.map((step, i) => (
          <div
            key={step}
            className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition-all duration-500 ${
              i < stepIndex
                ? 'text-[var(--color-muted-foreground)] line-through opacity-50'
                : i === stepIndex
                  ? 'bg-[var(--color-accent)]/10 font-medium text-[var(--color-accent)]'
                  : 'text-[var(--color-muted-foreground)] opacity-30'
            }`}
          >
            <span className="flex-shrink-0 text-base">
              {i < stepIndex ? '✓' : i === stepIndex ? '→' : '○'}
            </span>
            {step}
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--color-muted-foreground)]">
        Powered by Claude Sonnet — do not close this tab
      </p>
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-accent)]" />
        </div>
      }
    >
      <NewAssessmentContent />
    </Suspense>
  );
}
