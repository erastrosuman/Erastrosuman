import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { SectionEyebrow, OrnamentDivider } from "@/components/Ornaments";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight } from "lucide-react";

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
  component: BlogPage,
});

const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

function BlogPage() {
  const [cat, setCat] = useState<string>("All");
  const featured = blogPosts[0];
  const filtered = useMemo(
    () => (cat === "All" ? blogPosts.slice(1) : blogPosts.filter((p) => p.category === cat && p.id !== featured.id)),
    [cat, featured.id],
  );

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
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
                  <span className="font-display text-[140px] md:text-[180px] text-saffron/30 select-none">✦</span>
                </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <article key={p.id} className="bg-white border border-border-light rounded-lg p-6 hover:shadow-warm transition-shadow flex flex-col">
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
        </div>
      </section>
    </SiteShell>
  );
}
