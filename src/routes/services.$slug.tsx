import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { SectionEyebrow } from "@/components/Ornaments";
import { services, categoryColors, categoryLabel } from "@/data/services";
import { useCart } from "@/lib/cart";
import { CartBar } from "@/components/CartBar";
import {
  ArrowRight,
  Check,
  Clock,
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const s = services.find((x) => x.slug === params.slug);
    if (!s) return { meta: [{ title: "Reading not found — SudnadiAstro" }] };
    return {
      meta: [
        { title: `${s.name} — ₹${s.price} — SudnadiAstro` },
        { name: "description", content: `${s.tagline}. ${s.desc}` },
        { property: "og:title", content: `${s.name} — SudnadiAstro` },
        { property: "og:description", content: s.desc },
      ],
    };
  },
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-indigo-deep">Reading not found</h1>
        <p className="mt-4 text-text-body">The reading you're looking for doesn't exist.</p>
        <Link
          to="/services"
          className="mt-6 inline-block text-saffron font-semibold border-b-2 border-saffron-border hover:border-saffron"
        >
          See all readings
        </Link>
      </div>
    </SiteShell>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData() as { service: (typeof services)[number] };
  const navigate = useNavigate();
  const cart = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { bg, text } = categoryColors[service.category];

  const book = () => {
    cart.add(service.slug);
    navigate({ to: "/checkout" });
  };
  const isSelected = cart.isSelected(service.slug);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative bg-cream-warm/50 pt-8 md:pt-12 pb-14 md:pb-20 border-b border-border-light">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <nav aria-label="Breadcrumb" className="text-[13px] text-text-muted mb-6">
            <Link to="/" className="hover:text-saffron">
              Home
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <Link to="/services" className="hover:text-saffron">
              Readings
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-text-body">{service.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span
                className={`inline-block ${bg} ${text} text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full`}
              >
                {categoryLabel[service.category]}
              </span>
              <h1 className="mt-4 font-display text-[40px] md:text-[56px] leading-[1.05] text-indigo-deep font-semibold">
                {service.name}
              </h1>
              <p className="mt-3 font-display italic text-[20px] md:text-[22px] text-saffron-hover">
                {service.tagline}
              </p>
              <p className="mt-5 text-[16.5px] text-text-body leading-relaxed max-w-xl">
                {service.desc}
              </p>

              <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[44px] text-gold font-semibold leading-none">
                  ₹{service.price}
                </span>
                <span className="text-text-muted text-sm">· one-time, all-inclusive</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-text-body">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-saffron" aria-hidden /> {service.delivery}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-saffron" aria-hidden /> Details kept
                  private
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={14} className="text-saffron" aria-hidden /> Follow-up
                  included
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={book}
                  className="inline-flex items-center gap-2 bg-saffron text-white px-7 py-4 rounded-full font-semibold text-[15px] hover:bg-saffron-hover transition-all hover:-translate-y-0.5"
                >
                  Book this reading · ₹{service.price} <ArrowRight size={16} aria-hidden />
                </button>
                <a
                  href={`https://wa.me/919717691644?text=Hi%20Sudhansu%20ji%2C%20I%E2%80%99d%20like%20to%20ask%20about%20the%20${encodeURIComponent(service.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-saffron text-saffron px-7 py-[14px] rounded-full font-semibold text-[15px] hover:bg-saffron-ghost"
                >
                  Ask first on WhatsApp
                </a>
              </div>
              <button
                type="button"
                onClick={() => cart.toggle(service.slug)}
                className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-text-muted hover:text-saffron transition-colors"
              >
                {isSelected ? (
                  <>
                    <Check size={14} className="text-saffron" aria-hidden /> Added — combine with
                    other readings at checkout
                  </>
                ) : (
                  <>
                    <Plus size={14} aria-hidden /> Add to combine with other readings
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <div className="aspect-[5/4] rounded-lg overflow-hidden border border-border-warm shadow-tilt bg-cream">
                <img
                  src={service.image}
                  alt={`Illustration for ${service.name}`}
                  width={800}
                  height={640}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT COVERS / WHAT YOU GET */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-6 grid md:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <SectionEyebrow>What it covers</SectionEyebrow>
            <h2 className="font-display text-[30px] md:text-[36px] text-indigo-deep font-semibold leading-tight">
              The questions this reading answers
            </h2>
            <ul className="mt-6 space-y-3">
              {service.covers.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-1 w-5 h-5 rounded-full bg-saffron-ghost text-saffron-hover inline-flex items-center justify-center shrink-0">
                    <Check size={12} aria-hidden />
                  </span>
                  <span className="text-text-body">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-parchment-grain rounded-lg p-7 md:p-9 border border-border-warm">
            <SectionEyebrow>What you receive</SectionEyebrow>
            <h2 className="font-display text-[26px] md:text-[30px] text-indigo-deep font-semibold">
              Delivered to your inbox
            </h2>
            <ul className="mt-5 space-y-3">
              {service.receive.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[15px]">
                  <span className="text-saffron" aria-hidden>
                    ✦
                  </span>
                  <span className="text-text-body">{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 pt-5 border-t border-border-warm flex items-center justify-between">
              <span className="text-sm text-text-muted">Delivery</span>
              <span className="font-semibold text-indigo-deep">{service.delivery}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-warm/40 py-16 md:py-20 border-y border-border-light">
        <div className="mx-auto max-w-3xl px-5 md:px-6">
          <SectionEyebrow>Questions</SectionEyebrow>
          <h2 className="font-display text-[30px] md:text-[40px] text-indigo-deep font-semibold">
            Common questions
          </h2>
          <div className="mt-8 space-y-3">
            {service.faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white border border-border-light rounded-md overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left p-5 hover:bg-cream"
                  >
                    <span className="font-display text-[18px] text-indigo-deep">{f.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-saffron shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-text-body leading-relaxed text-[15px]">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-deep py-16 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-[32px] md:text-[40px] text-cream font-semibold">
            Ready when you are.
          </h2>
          <p className="mt-3 text-cream/75">
            Book your {service.name.toLowerCase()} now — pay securely, share birth details, receive
            your report.
          </p>
          <button
            type="button"
            onClick={book}
            className="mt-7 inline-flex items-center gap-2 bg-saffron text-white px-8 py-4 rounded-full font-semibold hover:bg-saffron-hover transition-colors"
          >
            Book · ₹{service.price} <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </section>

      {/* Sticky mobile booking bar — Swiggy/Zomato style. Hidden once the
          multi-select CartBar takes over (avoids two stacked bottom bars). */}
      {cart.count === 0 && (
        <div
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-light shadow-[0_-4px_20px_rgba(19,19,58,0.08)] px-4 py-3 flex items-center justify-between gap-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-text-muted font-mono leading-tight">
              {service.name}
            </p>
            <p className="font-display text-xl text-gold font-semibold leading-none mt-0.5">
              ₹{service.price}
            </p>
          </div>
          <button
            type="button"
            onClick={book}
            className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 bg-saffron text-white h-12 rounded-full font-semibold text-[15px] hover:bg-saffron-hover transition-all active:scale-95"
          >
            Book now <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      )}
      <CartBar />
    </SiteShell>
  );
}
