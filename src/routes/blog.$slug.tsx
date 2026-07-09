import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { blogPosts as staticBlogPosts } from "@/data/blogPosts";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { BlogPostRow } from "@/types/database";
import { mapDbPostToDisplay, mapStaticPostToDisplay, type DisplayPost } from "@/lib/blog-mapping";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<{ post: DisplayPost; related: DisplayPost[] }> => {
    // 1. Try Supabase first
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", params.slug)
        .eq("published", true)
        .single();

      if (!error && data) {
        // Also fetch related posts (other published posts, up to 3)
        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .neq("slug", params.slug)
          .order("published_at", { ascending: false })
          .limit(3);

        const related = ((relatedData ?? []) as BlogPostRow[]).map(mapDbPostToDisplay);
        return { post: mapDbPostToDisplay(data as BlogPostRow), related };
      }
    } catch {
      // Network/env error — fall through to static
    }

    // 2. Fallback to static array
    const staticPost = staticBlogPosts.find((p) => p.slug === params.slug);
    if (staticPost) {
      const related = staticBlogPosts
        .filter((p) => p.slug !== params.slug)
        .slice(0, 3)
        .map(mapStaticPostToDisplay);
      return { post: mapStaticPostToDisplay(staticPost), related };
    }

    // 3. Not found anywhere
    throw notFound();
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) return { meta: [{ title: "Article not found — SudnadiAstro" }] };
    const p = loaderData.post;
    return {
      meta: [
        { title: `${p.title} — SudnadiAstro` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        ...(p.heroImageUrl ? [{ property: "og:image", content: p.heroImageUrl }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-indigo-deep">Article not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-saffron font-semibold border-b-2 border-saffron-border hover:border-saffron">
          Back to all articles
        </Link>
      </div>
    </SiteShell>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post, related } = Route.useLoaderData();

  return (
    <SiteShell>
      <article>
        <header className="bg-cream-warm/40 border-b border-border-light pt-10 md:pt-14 pb-10">
          <div className="mx-auto max-w-3xl px-5 md:px-6">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-saffron text-sm font-semibold hover:gap-2 transition-all mb-6">
              <ArrowLeft size={14} aria-hidden /> All articles
            </Link>
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-saffron-ghost text-saffron-hover px-3 py-1 rounded-full font-semibold uppercase tracking-widest text-[10.5px]">
                {post.category}
              </span>
              <span className="text-text-muted">{post.date}</span>
              <span className="text-text-muted">· {post.readTime} min read</span>
            </div>
            <h1 className="mt-4 font-display text-[34px] md:text-[52px] leading-[1.1] text-indigo-deep font-semibold">
              {post.title}
            </h1>
            <p className="mt-5 text-[17px] text-text-body leading-relaxed">{post.excerpt}</p>
          </div>
        </header>

        {/* Hero image — only shown when present */}
        {post.heroImageUrl && (
          <div className="mx-auto max-w-3xl px-5 md:px-6 pt-8">
            <img
              src={post.heroImageUrl}
              alt={post.title}
              className="w-full rounded-lg object-cover max-h-[420px]"
            />
          </div>
        )}

        <div className="mx-auto max-w-2xl px-5 md:px-6 py-12 md:py-16">
          {/* HTML body from CMS (Tiptap) */}
          {post.bodyHtml && (
            <div
              className="prose-blog space-y-6 text-[17px] leading-[1.8] text-text-body"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
          )}

          {/* Static paragraph fallback */}
          {post.bodyParagraphs && !post.bodyHtml && (
            <div className="space-y-6 text-[17px] leading-[1.8] text-text-body">
              {post.bodyParagraphs.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "first-letter:font-display first-letter:text-[58px] first-letter:text-saffron first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]"
                      : ""
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          )}

          <div className="mt-12 p-6 bg-saffron-ghost border border-saffron-border rounded-lg flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl text-indigo-deep">Want a reading on this?</p>
              <p className="text-text-body text-sm mt-1">Sudhansu can apply this to your specific chart.</p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-saffron text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-saffron-hover transition-colors shrink-0"
            >
              Browse readings <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-border-light py-16 bg-cream-warm/30">
          <div className="mx-auto max-w-6xl px-5 md:px-6">
            <h2 className="font-display text-[26px] md:text-[32px] text-indigo-deep font-semibold mb-8">
              Keep reading
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group bg-white border border-border-light rounded-lg overflow-hidden hover:shadow-warm transition-shadow"
                >
                  {/* Thumbnail / placeholder */}
                  <div className="aspect-[16/9] overflow-hidden">
                    {p.heroImageUrl ? (
                      <img
                        src={p.heroImageUrl}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-saffron-ghost via-cream-warm to-parchment flex items-center justify-center">
                        <span className="font-display text-5xl text-saffron/30 select-none" aria-hidden>✦</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="bg-saffron-ghost text-saffron-hover text-[10.5px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full">
                      {p.category}
                    </span>
                    <h3 className="mt-3 font-display text-[18px] leading-snug text-indigo-deep group-hover:text-saffron transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-xs text-text-muted">{p.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-cream-warm border-y border-border-warm py-14 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <MessageCircle size={28} className="mx-auto text-[#25D366] mb-3" aria-hidden />
          <h2 className="font-display text-[26px] text-indigo-deep font-semibold">
            Have a follow-up question?
          </h2>
          <a
            href="https://wa.me/919717691644"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1faa54]"
          >
            <MessageCircle size={16} aria-hidden /> Ask on WhatsApp
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
