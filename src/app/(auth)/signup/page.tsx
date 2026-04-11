import Link from 'next/link';

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Create an account</h1>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
        Magic-link signup — no password needed.
      </p>
      <form className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@company.dk"
            className="mt-1 block w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] hover:opacity-90"
        >
          Send magic link
        </button>
      </form>
      <p className="mt-6 text-xs text-[var(--color-muted-foreground)]">
        Already have an account?{' '}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
