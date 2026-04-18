import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect non-api routes (let API calls work normally)
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api/') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const basicAuth = request.headers.get('authorization');
  const expectedUsername = process.env.BASIC_AUTH_USERNAME || 'admin';
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD || '';

  if (!expectedPassword) {
    // If no password is set, allow access without protection
    return NextResponse.next();
  }

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      if (!authValue) {
        throw new Error('Invalid auth format');
      }
      const [user, pwd] = atob(authValue).split(':');

      if (user === expectedUsername && pwd === expectedPassword) {
        return NextResponse.next();
      }
    } catch (error) {
      // Invalid basic auth header format
    }
  }

  // Return 401 with WWW-Authenticate header
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="EUComply Development"',
    },
  });
}

// Run middleware on all routes except API and _next
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
