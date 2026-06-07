import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getServiceEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function createSupabaseServiceClient(): SupabaseClient | null {
  const env = getServiceEnv();
  if (!env) {
    return null;
  }

  return createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
