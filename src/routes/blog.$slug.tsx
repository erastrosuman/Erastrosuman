import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const p = blogPosts.find((b) => b.slug === params.slug);
    if (!p) return { meta: [{ title: "Article not found — SudnadiAstro" }] };
    return {
      meta: [
        { title: `${p.title} — SudnadiAstro` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
      ],
    };
  },
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
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
  const { post } = Route.useLoaderData() as { post: (typeof blogPosts)[number] };
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

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

        <div className="mx-auto max-w-2xl px-5 md:px-6 py-12 md:py-16">
          <div className="space-y-6 text-[17px] leading-[1.8] text-text-body">
            {post.body.map((para, i) => (
              <p key={i} className={i === 0 ? "first-letter:font-display first-letter:text-[58px] first-letter:text-saffron first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]" : ""}>
                {para}
              </p>
            ))}
          </div>

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
                className="group bg-white border border-border-light rounded-lg p-5 hover:shadow-warm transition-shadow"
              >
                <span className="bg-saffron-ghost text-saffron-hover text-[10.5px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full">
                  {p.category}
                </span>
                <h3 className="mt-3 font-display text-[18px] leading-snug text-indigo-deep group-hover:text-saffron transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-text-muted">{p.readTime} min read</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
