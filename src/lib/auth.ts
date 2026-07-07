import { useEffect, useState } from "react";
import { supabase } from "./supabase";

/**
 * Hook to check if the current Supabase auth session belongs to an admin.
 *
 * Returns:
 *   - isAdmin: true if the user is authenticated and has an admin_profiles entry
 *   - isLoading: true while checking
 *   - user: the Supabase auth user object (if authenticated)
 *   - role: "admin" | "editor" | null
 */
export function useAdmin() {
  const [state, setState] = useState<{
    isAdmin: boolean;
    isLoading: boolean;
    user: { id: string; email?: string } | null;
    role: "admin" | "editor" | null;
  }>({
    isAdmin: false,
    isLoading: true,
    user: null,
    role: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || cancelled) {
          setState({ isAdmin: false, isLoading: false, user: null, role: null });
          return;
        }

        const { data: profile } = await supabase
          .from("admin_profiles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (cancelled) return;

        if (profile) {
          setState({
            isAdmin: true,
            isLoading: false,
            user: { id: user.id, email: user.email },
            role: profile.role as "admin" | "editor",
          });
        } else {
          setState({ isAdmin: false, isLoading: false, user: { id: user.id, email: user.email }, role: null });
        }
      } catch {
        if (!cancelled) {
          setState({ isAdmin: false, isLoading: false, user: null, role: null });
        }
      }
    }

    check();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

/**
 * Get the current auth session token.
 * Used to pass to server functions that require admin auth.
 */
export async function getAuthToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}
