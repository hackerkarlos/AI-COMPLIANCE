'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="rounded-full bg-red-100 p-5 dark:bg-red-900/20">
        <span className="text-4xl">!</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-[var(--color-muted-foreground)]">
          An unexpected error occurred. If this keeps happening, contact support.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-[var(--color-muted-foreground)]">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <button
        onClick={reset}
        className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
