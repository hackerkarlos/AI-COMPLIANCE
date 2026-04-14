import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * Supabase client for use in Server Components, Route Handlers, and Server Actions.
 * Bound to the current request's cookies via next/headers.
 *
 * Note: setAll() is wrapped in try/catch because Server Components cannot mutate
 * cookies — the error is swallowed safely since middleware refreshes the session.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components can't set cookies — middleware handles refresh.
          }
        },
      },
    },
  );
}
