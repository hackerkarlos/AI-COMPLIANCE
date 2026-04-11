import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for use in Client Components.
 * Reads anon key from public env vars.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
