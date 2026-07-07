import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. " +
      "Supabase client will not work until these are set in your .env file.",
  );
}

/**
 * Browser-safe Supabase client.
 *
 * Uses the **anon key** — all queries go through Row Level Security.
 * Only public data (published services, blogs, approved testimonials,
 * selected site settings) and anonymous inserts (contact messages) are
 * accessible without authentication.
 */
export const supabase = createClient<Database>(
  supabaseUrl ?? "",
  supabaseAnonKey ?? "",
);
