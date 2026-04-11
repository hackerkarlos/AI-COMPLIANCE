import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        EU compliance, on autopilot.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
        GDPR, Bogforingsloven, NIS2 and the EU AI Act — assessed by AI, tailored
        to Danish SMBs. Know where you stand in minutes, not weeks.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/signup"
          className="rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] hover:opacity-90"
        >
          Start free assessment
        </Link>
        <Link
          href="/pricing"
          className="rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-muted)]"
        >
          See pricing
        </Link>
      </div>
    </section>
  );
}
