import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { services as staticServices } from "@/data/services";
import type { ServiceRow } from "@/types/database";

/**
 * Fetch active services from Supabase.
 * Falls back to static data if Supabase is unreachable.
 */
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });

      if (error || !data || data.length === 0) {
        // Graceful fallback to static data
        console.warn("[useServices] Falling back to static data:", error?.message);
        return null; // signal to use static
      }

      return data as ServiceRow[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Get services — returns Supabase data if available, static data otherwise.
 */
export function useServicesWithFallback() {
  const query = useServices();

  const services = query.data
    ? query.data.map((s) => ({
        id: 0, // not used in frontend currently
        slug: s.slug,
        name: s.name,
        price: Number(s.price),
        category: s.category as import("@/data/services").ServiceCategory,
        tagline: s.tagline,
        desc: s.description,
        delivery: s.delivery_text,
        image: "", // images still come from static imports
        covers: s.covers as string[],
        receive: s.receive as string[],
        faqs: s.faqs as { q: string; a: string }[],
      }))
    : staticServices;

  return { services, isLoading: query.isLoading, isFromSupabase: !!query.data };
}
