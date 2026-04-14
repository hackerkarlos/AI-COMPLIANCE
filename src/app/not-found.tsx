import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="space-y-2">
        <p className="font-mono text-6xl font-bold text-[var(--color-muted-foreground)]">404</p>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="max-w-sm text-sm text-[var(--color-muted-foreground)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
