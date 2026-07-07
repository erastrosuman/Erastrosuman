import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { blogPosts as staticBlogPosts } from "@/data/blogPosts";
import type { BlogPostRow } from "@/types/database";

/**
 * Fetch published blog posts from Supabase.
 * Falls back to static data if Supabase is unreachable.
 */
export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn("[useBlogPosts] Falling back to static data:", error?.message);
        return null;
      }

      return data as BlogPostRow[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Fetch a single blog post by slug.
 */
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        // Fallback to static
        const staticPost = staticBlogPosts.find((p) => p.slug === slug);
        return staticPost ?? null;
      }

      // Map to static-compatible format
      const post = data as BlogPostRow;
      return {
        id: 0,
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: post.published_at
          ? new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "",
        readTime: post.read_time,
        excerpt: post.excerpt,
        body: post.body.split("\n\n"), // convert back to paragraphs
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
