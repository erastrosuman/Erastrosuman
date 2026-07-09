import { createFileRoute } from "@tanstack/react-router";
import { services as staticServices } from "@/data/services";
import { blogPosts as staticBlogPosts } from "@/data/blogPosts";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Try to fetch live data from Supabase (server-side, no auth needed for public tables)
        let serviceSlugs: string[] = staticServices.map((s) => s.slug);
        let blogSlugs: string[] = staticBlogPosts.map((p) => p.slug);

        try {
          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

          if (supabaseUrl && supabaseAnonKey) {
            const [svcRes, blogRes] = await Promise.all([
              fetch(`${supabaseUrl}/rest/v1/services?select=slug&active=eq.true`, {
                headers: {
                  apikey: supabaseAnonKey,
                  Authorization: `Bearer ${supabaseAnonKey}`,
                },
              }),
              fetch(`${supabaseUrl}/rest/v1/blog_posts?select=slug&published=eq.true`, {
                headers: {
                  apikey: supabaseAnonKey,
                  Authorization: `Bearer ${supabaseAnonKey}`,
                },
              }),
            ]);

            if (svcRes.ok) {
              const rows = (await svcRes.json()) as { slug: string }[];
              if (rows.length > 0) serviceSlugs = rows.map((r) => r.slug);
            }
            if (blogRes.ok) {
              const rows = (await blogRes.json()) as { slug: string }[];
              if (rows.length > 0) blogSlugs = rows.map((r) => r.slug);
            }
          }
        } catch {
          // Fallback to static arrays already set above
        }

        const staticPaths = ["/", "/services", "/about", "/blog", "/contact"];
        const servicePaths = serviceSlugs.map((s) => `/services/${s}`);
        const blogPaths = blogSlugs.map((p) => `/blog/${p}`);
        const all = [...staticPaths, ...servicePaths, ...blogPaths];

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...all.map(
            (p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
