import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

/**
 * Refresh the Supabase session on every request so Server Components always
 * receive a valid, up-to-date session cookie.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     *   - _next/static  (static assets)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
};
