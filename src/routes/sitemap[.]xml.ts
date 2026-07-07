import { createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/data/blogPosts";
import { services } from "@/data/services";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/services", "/about", "/blog", "/contact"];
        const servicePaths = services.map((s) => `/services/${s.slug}`);
        const blogPaths = blogPosts.map((p) => `/blog/${p.slug}`);
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
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
