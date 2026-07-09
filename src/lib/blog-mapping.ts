import type { BlogPostRow } from "@/types/database";
import type { BlogPost } from "@/data/blogPosts";

// ─── Normalised display shape ────────────────────────────────
// This is the shape the blog JSX already expects.  Both the static
// fallback array and DB rows are normalised into this before rendering.

export type DisplayPost = {
  id: string | number;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: number;
  excerpt: string;
  heroImageUrl: string | null;
  /** HTML string (from Tiptap / CMS) — render with dangerouslySetInnerHTML */
  bodyHtml: string | null;
  /** Plain-text paragraphs (static fallback only) — render as <p> list */
  bodyParagraphs: string[] | null;
};

// ─── Map a Supabase DB row → DisplayPost ─────────────────────

export function mapDbPostToDisplay(row: BlogPostRow): DisplayPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(row.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    readTime: row.read_time,
    excerpt: row.excerpt,
    heroImageUrl: row.hero_image_url,
    bodyHtml: row.body || null,
    bodyParagraphs: null,
  };
}

// ─── Map a static BlogPost → DisplayPost ─────────────────────

export function mapStaticPostToDisplay(post: BlogPost): DisplayPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    category: post.category,
    date: post.date,
    readTime: post.readTime,
    excerpt: post.excerpt,
    heroImageUrl: null,
    bodyHtml: null,
    bodyParagraphs: post.body,
  };
}

// ─── Slug generation ─────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Reading time ─────────────────────────────────────────────
// Strips HTML tags before counting, then applies ~200 wpm.

export function calculateReadTime(text: string): number {
  const stripped = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = stripped ? stripped.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}

// ─── Auto-excerpt ─────────────────────────────────────────────
// Strips HTML, trims to maxChars, appends ellipsis if truncated.

export function autoExcerpt(html: string, maxChars = 160): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxChars) return text;
  return text.slice(0, text.lastIndexOf(" ", maxChars)) + "…";
}
