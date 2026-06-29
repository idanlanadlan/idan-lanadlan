import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? anon;

export const isConfigured = !!(url && anon);

export function createClient() {
  return createSupabaseClient(url, anon);
}

export function createAdminClient() {
  return createSupabaseClient(url, service, {
    auth: { persistSession: false },
  });
}
