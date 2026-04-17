import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DEFAULT_REDIRECT = '/dashboard';

/**
 * Only accept same-origin, relative paths. Rejects absolute URLs,
 * protocol-relative URLs (//evil.com), and backslash variants that some
 * browsers normalise to a scheme.
 */
function safeRedirectPath(candidate: string | null): string {
  if (!candidate) return DEFAULT_REDIRECT;
  if (!candidate.startsWith('/')) return DEFAULT_REDIRECT;
  if (candidate.startsWith('//') || candidate.startsWith('/\\')) return DEFAULT_REDIRECT;
  return candidate;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeRedirectPath(url.searchParams.get('next'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth', url.origin));
}
