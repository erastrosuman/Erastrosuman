import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { ServiceCard } from "@/components/ServiceCard";
import { CartBar } from "@/components/CartBar";
import { SectionEyebrow, OrnamentDivider } from "@/components/Ornaments";
import { services, categoryLabel, type ServiceCategory } from "@/data/services";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "All Readings — SudnadiAstro" },
      {
        name: "description",
        content:
          "Nine personalised Vedic readings from ₹151 — Kundli, Career, Marriage, Gemstone, Nadi remedies and more. Hand-written, delivered in 1–5 days.",
      },
      { property: "og:title", content: "All Readings — SudnadiAstro" },
      { property: "og:description", content: "Nine hand-written Vedic readings from ₹151." },
    ],
  }),
  component: ServicesPage,
});

const categories: { id: "all" | ServiceCategory; label: string }[] = [
  { id: "all", label: "All readings" },
  { id: "personal", label: "Personal" },
  { id: "professional", label: "Career" },
  { id: "relationship", label: "Relationship" },
  { id: "remedies", label: "Remedies" },
  { id: "health", label: "Health" },
  { id: "specialized", label: "Specialised" },
  { id: "education", label: "Education" },
];

function ServicesPage() {
  const [cat, setCat] = useState<"all" | ServiceCategory>("all");
  const [q, setQ] = useState("");
  const cart = useCart();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return services.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (!query) return true;
      return (
        s.name.toLowerCase().includes(query) ||
        s.desc.toLowerCase().includes(query) ||
        categoryLabel[s.category].toLowerCase().includes(query)
      );
    });
  }, [cat, q]);

  return (
    <SiteShell>
      <section className="bg-cream pt-14 md:pt-20 pb-10">
        <div className="mx-auto max-w-5xl px-5 md:px-6 text-center" data-animate>
          <SectionEyebrow>Our Readings</SectionEyebrow>
          <h1 className="font-display text-[40px] md:text-[60px] leading-[1.05] text-indigo-deep font-semibold">
            Pick the reading <span className="italic text-saffron">made for your question.</span>
          </h1>
          <OrnamentDivider />
          <p className="text-text-body max-w-2xl mx-auto">
            Every reading is researched and written by hand. Prices stay simple — most are ₹151, a
            complete Kundli is ₹499. Pick as many as you like — you'll pay for everything in one
            checkout. Delivered to your inbox in 1–5 business days.
          </p>
        </div>
      </section>

      <section className={`pb-20 ${cart.count > 0 ? "pb-32" : ""}`}>
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="bg-white border border-border-light rounded-lg p-5 md:p-6 shadow-warm mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <label className="relative flex-1">
                <span className="sr-only">Search readings</span>
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                  aria-hidden
                />
                <input
                  type="search"
                  placeholder="Search e.g. marriage, career, gemstone…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 rounded-full bg-cream border border-border-light text-[15px] focus:outline-none focus:border-saffron"
                />
              </label>
            </div>
            <div
              className="mt-4 -mx-1 flex gap-2 overflow-x-auto pb-1"
              role="tablist"
              aria-label="Filter by category"
            >
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={cat === c.id}
                  onClick={() => setCat(c.id)}
                  className={`shrink-0 px-4 h-10 rounded-full text-[13.5px] font-medium transition-colors ${
                    cat === c.id
                      ? "bg-saffron text-white"
                      : "bg-cream-warm text-text-body hover:bg-saffron-ghost hover:text-saffron-hover"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-border-warm rounded-lg">
              <p className="font-display text-2xl text-indigo-deep">No readings match that yet.</p>
              <p className="text-text-muted mt-2">Try a different search or category.</p>
              <button
                type="button"
                onClick={() => {
                  setCat("all");
                  setQ("");
                }}
                className="mt-5 text-saffron font-semibold border-b-2 border-saffron-border hover:border-saffron pb-0.5"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, i) => (
                <ServiceCard key={s.id} service={s} delay={((i % 3) + 1) as 1 | 2 | 3} />
              ))}
            </div>
          )}

          <p className="mt-12 text-center text-sm text-text-muted">
            Still unsure?{" "}
            <Link
              to="/contact"
              className="text-saffron font-semibold underline-offset-4 hover:underline"
            >
              Ask Sudhansu directly
            </Link>{" "}
            and he'll recommend the right reading.
          </p>
        </div>
      </section>
      <CartBar />
    </SiteShell>
  );
}
