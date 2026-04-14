import { createBrowserClient } from '@supabase/ssr';

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * Supabase client for use in Client Components.
 * Reads anon key from public env vars.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
