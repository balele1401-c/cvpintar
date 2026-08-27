import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Admin client for trusted server-side operations.
 * Prioritizes SUPABASE_SERVICE_ROLE_KEY for full RLS bypass.
 * If service_role is not yet configured, gracefully falls back to the active anon key.
 */
export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';

  const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isRealServiceKey =
    rawServiceKey &&
    rawServiceKey.trim() !== '' &&
    !rawServiceKey.includes('placeholder') &&
    !rawServiceKey.includes('your-supabase');

  const rawAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const keyToUse = isRealServiceKey
    ? rawServiceKey
    : rawAnonKey &&
      !rawAnonKey.includes('placeholder') &&
      !rawAnonKey.includes('your-supabase')
    ? rawAnonKey
    : 'placeholder-service-role-key';

  return createSupabaseClient(supabaseUrl, keyToUse, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
