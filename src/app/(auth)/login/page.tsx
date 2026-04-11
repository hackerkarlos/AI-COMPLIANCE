export default function LoginPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Log in</h1>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
        We&apos;ll send you a magic link.
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
    </div>
  );
}
