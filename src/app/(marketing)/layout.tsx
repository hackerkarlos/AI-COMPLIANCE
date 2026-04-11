import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--color-border)]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold tracking-tight">
            EUComply
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            >
              Log in
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-[var(--color-muted-foreground)]">
          EUComply — Automated EU compliance for Danish SMBs
        </div>
      </footer>
    </div>
  );
}
