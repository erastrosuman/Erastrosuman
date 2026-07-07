import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server-only Supabase admin client.
 *
 * Uses the **service role key** which bypasses Row Level Security.
 * Use this for operations that must not be restricted by RLS:
 *   - Updating payment/order statuses from callbacks
 *   - Admin dashboard queries
 *   - Inserting audit logs
 *   - Any write that anonymous users should not perform directly
 *
 * The `.server.ts` suffix ensures Vite tree-shakes this file from the
 * client bundle — the service role key never reaches the browser.
 *
 * The client is cached per-process to avoid creating a new instance
 * (and HTTP connection pool) on every server function call.
 */

let cachedClient: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (cachedClient) return cachedClient;

  const url = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    const missing = [];
    if (!url) missing.push("VITE_SUPABASE_URL");
    if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    throw new Error(
      `[supabase.server] Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Set them in your .env file and in your Vercel project settings. " +
        "Without these, all database operations (payments, bookings, contacts) will fail."
    );
  }

  cachedClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
