import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Supabase magic-link callback handler.
 * Exchanges the code in the query string for a session, then redirects
 * to the dashboard (or `next` parameter if provided).
 */

/**
 * Validate that a redirect target is a safe relative path.
 * Rejects absolute URLs (http://, https://, //), protocol-relative paths,
 * and anything else that could redirect outside the app.
 */
function isSafeRedirect(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  // Ensure it doesn't carry a scheme (e.g. /\nhttp:// bypasses startsWith check)
  if (/^\/[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) return false;
  return true;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const nextParam = url.searchParams.get('next') ?? '/dashboard';
  const next = isSafeRedirect(nextParam) ? nextParam : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth', url.origin));
}
