import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function isSupabasePortalEnabled(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

export function getSupabaseClient(): SupabaseClient {
  if (!isSupabasePortalEnabled()) {
    throw new Error("Supabase portal is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
  }
  if (!client) {
    client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    );
  }
  return client;
}

export function isPortalAdminUser(user: { app_metadata?: Record<string, unknown> } | null): boolean {
  return user?.app_metadata?.portal_role === "admin";
}
