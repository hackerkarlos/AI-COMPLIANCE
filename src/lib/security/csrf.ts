import { NextResponse } from 'next/server';

/**
 * App Router route handlers do not enforce CSRF by default. For state-changing
 * endpoints (POST/PUT/PATCH/DELETE), require the browser-set Origin header to
 * match the request host. Browsers refuse to let cross-site attackers forge
 * Origin, so a same-origin match is a reliable defence for form/fetch CSRF.
 */
export function verifySameOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get('origin');
  if (!origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const requestHost =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    new URL(request.url).host;

  if (originHost !== requestHost) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
