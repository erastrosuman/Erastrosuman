import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import type { TestimonialRow } from "@/types/database";

/**
 * Fetch approved testimonials from Supabase.
 * Falls back to static data if Supabase is unreachable.
 */
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("approved", true)
        .order("sort_order", { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn("[useTestimonials] Falling back to static data:", error?.message);
        return null;
      }

      return data as TestimonialRow[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Returns testimonials in the format expected by existing frontend components.
 */
export function useTestimonialsWithFallback() {
  const query = useTestimonials();

  const testimonials = query.data
    ? query.data.map((t) => ({
        id: 0,
        name: t.name,
        label: `Verified Client · ${t.location}`,
        rating: t.rating,
        text: t.review,
      }))
    : staticTestimonials;

  return { testimonials, isLoading: query.isLoading, isFromSupabase: !!query.data };
}
