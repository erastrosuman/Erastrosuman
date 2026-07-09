import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { SectionEyebrow, OrnamentDivider } from "@/components/Ornaments";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { blogPosts as staticBlogPosts } from "@/data/blogPosts";
import type { BlogPostRow } from "@/types/database";
import { mapDbPostToDisplay, mapStaticPostToDisplay, type DisplayPost } from "@/lib/blog-mapping";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Insights — SudnadiAstro" },
      {
        name: "description",
        content:
          "Articles on Nadi Astrology, Numerology, Kundli reading, marriage timing, gemstones and Vedic remedies — written by Sudhansu Suman.",
      },
      { property: "og:title", content: "SudnadiAstro Insights" },
      { property: "og:description", content: "Articles on Vedic astrology and remedies." },
    ],
  }),
  loader: async (): Promise<{ posts: DisplayPost[] }> => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return { posts: (data as BlogPostRow[]).map(mapDbPostToDisplay) };
      }
    } catch {
      // Network/env error — fall through to static
    }
    // Graceful fallback to static seed data
    return { posts: staticBlogPosts.map(mapStaticPostToDisplay) };
  },
  component: BlogPage,
});

function BlogPage() {
  const { posts } = Route.useLoaderData();
  const [cat, setCat] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts],
  );

  const featured = posts[0];
  const filtered = useMemo(
    () =>
      cat === "All"
        ? posts.slice(1)
        : posts.filter((p) => p.category === cat && p.id !== featured?.id),
    [cat, posts, featured],
  );

  if (!featured) {
    return (
      <SiteShell>
        <section className="py-32 text-center">
          <p className="text-text-muted">No articles published yet — check back soon.</p>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="bg-cream pt-14 md:pt-20 pb-10">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <SectionEyebrow>Insights</SectionEyebrow>
          <h1 className="font-display text-[40px] md:text-[60px] leading-[1.05] text-indigo-deep font-semibold">
            Read before you{" "}
            <span className="italic text-saffron">book.</span>
          </h1>
          <OrnamentDivider />
          <p className="text-text-body">
            Plain-language articles on Vedic astrology, numerology and the remedies that actually work.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group block bg-white border border-border-light rounded-lg overflow-hidden shadow-warm hover:shadow-tilt transition-shadow"
          >
            <div className="grid md:grid-cols-[1.3fr_1fr]">
              <div className="aspect-[16/10] md:aspect-auto bg-gradient-to-br from-saffron-ghost via-cream-warm to-parchment relative overflow-hidden">
                {featured.heroImageUrl ? (
                  <img
                    src={featured.heroImageUrl}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
                    <span className="font-display text-[140px] md:text-[180px] text-saffron/30 select-none">✦</span>
                  </div>
                )}
              </div>
              <div className="p-7 md:p-10 flex flex-col justify-center">
                <span className="bg-saffron-ghost text-saffron-hover px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest self-start">
                  Featured · {featured.category}
                </span>
                <h2 className="mt-4 font-display text-[28px] md:text-[36px] text-indigo-deep leading-tight group-hover:text-saffron transition-colors">
                  {featured.title}
                </h2>
                <p className="mt-4 text-text-body leading-relaxed">{featured.excerpt}</p>
                <div className="mt-5 flex items-center gap-3 text-xs text-text-muted">
                  <span>{featured.date}</span>
                  <span aria-hidden>·</span>
                  <span>{featured.readTime} min read</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FILTERS */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8" role="tablist" aria-label="Filter articles">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`shrink-0 px-4 h-10 rounded-full text-[13.5px] font-medium ${
                  cat === c ? "bg-saffron text-white" : "bg-cream-warm text-text-body hover:bg-saffron-ghost"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-text-muted py-16">
              No other articles in this category yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="bg-white border border-border-light rounded-lg p-6 hover:shadow-warm transition-shadow flex flex-col"
                >
                  {/* Thumbnail / Placeholder */}
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="block -mx-6 -mt-6 mb-5 rounded-t-lg overflow-hidden aspect-[16/9]">
                    {p.heroImageUrl ? (
                      <img
                        src={p.heroImageUrl}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-saffron-ghost via-cream-warm to-parchment flex items-center justify-center">
                        <span className="font-display text-6xl text-saffron/30 select-none" aria-hidden>✦</span>
                      </div>
                    )}
                  </Link>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="bg-saffron-ghost text-saffron-hover px-2.5 py-1 rounded-full font-semibold uppercase tracking-widest text-[10.5px]">
                      {p.category}
                    </span>
                    <span className="text-text-muted">{p.readTime} min</span>
                  </div>
                  <h3 className="font-display text-[22px] leading-tight text-indigo-deep mt-4">
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-saffron transition-colors">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-text-body text-[14.5px] line-clamp-3 leading-relaxed flex-1">{p.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-text-muted">{p.date}</span>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="inline-flex items-center gap-1.5 text-saffron font-semibold text-[13.5px] hover:gap-2 transition-all"
                    >
                      Read <ArrowRight size={14} aria-hidden />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
