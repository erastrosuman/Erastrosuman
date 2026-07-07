import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { SectionEyebrow, OrnamentDivider, ConstellationBg } from "@/components/Ornaments";
import { services } from "@/data/services";
import { blogPosts } from "@/data/blogPosts";
import { useCountUp } from "@/hooks/useCountUp";
import { ArrowRight, Star, Sparkles, ShieldCheck, Clock, MessageCircle, Compass, HeartHandshake, Briefcase, HelpingHand, PenLine, Mail, CalendarClock } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import astrologerImg from "@/assets/astrologer.jpg";

const helpItems = [
  { icon: Compass, title: "Find clarity on big decisions", text: "Job switch, marriage, relocation, study abroad — get a grounded astrological perspective before you commit." },
  { icon: Briefcase, title: "Time your career moves", text: "Know which windows in the next 24 months favour change, growth, or staying put — based on your dasha and transits." },
  { icon: HeartHandshake, title: "Understand your relationship", text: "Honest Guna milan plus emotional, financial and karmic compatibility — not just a number." },
  { icon: HelpingHand, title: "Get remedies you can actually do", text: "Simple, sustainable practices tailored to your chart. No expensive prescriptions, no fear-talk." },
];

const steps = [
  { icon: PenLine, title: "Pick your reading", text: "Choose from nine focused services — or message on WhatsApp and Sudhansu will suggest one." },
  { icon: CalendarClock, title: "Share birth details", text: "Date, exact time, and place of birth. Takes under two minutes — kept fully private." },
  { icon: Mail, title: "Receive your report", text: "A hand-written PDF lands in your inbox in 1–5 days, with one round of WhatsApp follow-up included." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SudnadiAstro — Personalised Vedic Astrology Readings by Sudhansu Suman" },
      {
        name: "description",
        content:
          "Hand-written Kundli, Career, Marriage and Nadi readings starting at ₹151. Trusted by 500+ clients. Delivered to your inbox in 1–5 days.",
      },
      { property: "og:title", content: "SudnadiAstro — Personalised Vedic Astrology" },
      {
        property: "og:description",
        content:
          "Hand-written Kundli, Career, Marriage and Nadi readings by Sudhansu Suman. From ₹151.",
      },
    ],
  }),
  component: Home,
});

function Stat({ value, suffix, label, decimals }: { value: number; suffix: string; label: string; decimals?: number }) {
  const ref = useCountUp(value, 1800, decimals ?? 0);
  return (
    <div className="text-center">
      <div className="font-display text-[44px] md:text-[56px] leading-none text-saffron-light font-semibold">
        <span ref={ref}>0</span>
        <span className="text-saffron">{suffix}</span>
      </div>
      <div className="mt-2 text-cream/70 text-sm tracking-wide uppercase">{label}</div>
    </div>
  );
}

function Home() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-cream pt-10 md:pt-16 pb-20 md:pb-28">
        <ConstellationBg className="opacity-60" />
        <div className="absolute -right-32 top-1/3 w-[520px] h-[520px] rounded-full border border-saffron/15 opacity-50 hidden md:block" aria-hidden />
        <div className="absolute -right-20 top-1/3 w-[360px] h-[360px] rounded-full border border-saffron/20 opacity-60 hidden md:block" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-5 md:px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
          <div>
            <div data-animate className="inline-flex items-center gap-2 bg-saffron-ghost border border-saffron-border rounded-full pl-2 pr-4 py-1.5 text-[12px] font-mono text-saffron-hover">
              <span className="bg-saffron text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]">✦</span>
              Nadi · Numerology · Vedic Cards
            </div>

            <h1
              data-animate
              data-animate-delay="1"
              className="mt-5 font-display font-semibold text-[44px] sm:text-[58px] lg:text-[76px] leading-[1.02] tracking-tight text-indigo-deep"
            >
              Astrology that finally{" "}
              <span className="italic text-saffron">tells you</span>{" "}
              <br className="hidden sm:block" />
              something specific.
            </h1>

            <p
              data-animate
              data-animate-delay="2"
              className="mt-6 text-[17px] md:text-[18px] text-text-body max-w-xl leading-[1.7]"
            >
              Hand-written readings by Sudhansu Suman — Nadi astrologer trained under Umang Taneja.
              No templates, no fear-talk, no fixed dates pulled from thin air. Just clear, grounded
              guidance on the next chapter of your life.
            </p>

            <div data-animate data-animate-delay="3" className="mt-7 flex items-center gap-4">
              <div className="flex -space-x-2" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-cream"
                    style={{
                      background: `linear-gradient(135deg, hsl(${20 + i * 12} 70% 55%), hsl(${260 + i * 6} 40% 35%))`,
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="fill-gold-light text-gold-light" aria-hidden />
                  ))}
                </div>
                <p className="text-[13px] text-text-body mt-0.5">
                  <span className="font-semibold text-indigo-deep">500+</span> readings delivered ·
                  <span className="font-semibold text-indigo-deep"> 4.9</span> average
                </p>
              </div>
            </div>

            <div data-animate data-animate-delay="4" className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-saffron text-white px-7 py-4 rounded-full font-semibold text-[15px] hover:bg-saffron-hover transition-all hover:-translate-y-0.5"
              >
                Browse readings <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                to="/services/$slug"
                params={{ slug: "kundli-report" }}
                className="inline-flex items-center bg-white border-2 border-saffron text-saffron px-7 py-[14px] rounded-full font-semibold text-[15px] hover:bg-saffron-ghost transition-all"
              >
                Start with a Kundli · ₹499
              </Link>
            </div>

            <div data-animate data-animate-delay="5" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-text-muted">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-saffron" aria-hidden /> Birth details kept private</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-saffron" aria-hidden /> Delivery in 1–5 days</span>
              <span className="flex items-center gap-1.5"><MessageCircle size={14} className="text-saffron" aria-hidden /> One round of follow-up</span>
            </div>
          </div>

          <div data-animate data-animate-delay="2" className="relative">
            <div className="relative aspect-square max-w-[520px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron-ghost via-cream-warm to-parchment rounded-full" aria-hidden />
              <img
                src={heroImg}
                alt="Hand holding a Vedic zodiac wheel"
                width={1024}
                height={1024}
                className="relative w-full h-full object-contain animate-float drop-shadow-[0_25px_40px_rgba(19,19,58,0.18)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP — value proposition */}
      <section className="py-20 md:py-24 bg-cream">

        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="max-w-2xl mb-12" data-animate>
            <SectionEyebrow>How SudnadiAstro helps you</SectionEyebrow>
            <h2 className="font-display text-[34px] md:text-[46px] leading-tight text-indigo-deep font-semibold">
              Real answers to the questions actually keeping you up.
            </h2>
            <p className="mt-4 text-text-body text-[16.5px] leading-relaxed">
              Not horoscopes. Not predictions copied from a book. A personal reading of your chart — applied to the decision in front of you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {helpItems.map((h, i) => (
              <div
                key={h.title}
                data-animate
                data-animate-delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className="bg-white border border-border-light rounded-lg p-6 hover:border-saffron-border hover:shadow-warm transition-all"
              >
                <span className="inline-flex w-11 h-11 rounded-full bg-saffron-ghost text-saffron items-center justify-center">
                  <h.icon size={20} aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-[20px] text-indigo-deep leading-snug">{h.title}</h3>
                <p className="mt-2 text-[14.5px] text-text-body leading-relaxed">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-cream-warm/40 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto" data-animate>
            <SectionEyebrow>The Readings</SectionEyebrow>
            <h2 className="font-display text-[36px] md:text-[48px] leading-tight text-indigo-deep font-semibold">
              Pick the reading that matches your question
            </h2>
            <OrnamentDivider />
            <p className="text-text-body">
              Nine focused services. Each one written by hand for your chart — never a templated PDF.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((s, i) => (
              <ServiceCard key={s.id} service={s} delay={(i % 3) + 1} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-saffron font-semibold text-[15px] border-b-2 border-saffron-border hover:border-saffron pb-1"
            >
              View all 9 readings <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14" data-animate>
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="font-display text-[34px] md:text-[44px] leading-tight text-indigo-deep font-semibold">
              Three small steps. One honest report.
            </h2>
          </div>
          <ol className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s, i) => (
              <li
                key={s.title}
                data-animate
                data-animate-delay={(i + 1) as 1 | 2 | 3}
                className="relative bg-white border border-border-light rounded-lg p-7"
              >
                <span className="absolute -top-4 left-7 font-display text-[40px] leading-none text-saffron/25 font-semibold">
                  0{i + 1}
                </span>
                <span className="inline-flex w-12 h-12 rounded-full bg-indigo-deep text-cream items-center justify-center">
                  <s.icon size={20} aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-[22px] text-indigo-deep">{s.title}</h3>
                <p className="mt-2 text-[14.5px] text-text-body leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-saffron text-white px-7 py-3.5 rounded-full font-semibold hover:bg-saffron-hover transition-colors"
            >
              Start your reading <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>


      {/* STATS */}
      <section className="relative bg-indigo-deep py-20 md:py-24 overflow-hidden">
        <ConstellationBg color="#F4854A" className="opacity-30" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value={500} suffix="+" label="Clients guided" />
          <Stat value={10} suffix="+" label="Years of practice" />
          <Stat value={9} suffix="" label="Focused services" />
          <Stat value={4.9} suffix="★" label="Average rating" decimals={1} />
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-6 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div data-animate className="relative">
            <div className="relative rounded-md overflow-hidden border border-border-warm shadow-warm bg-parchment">
              <img
                src={astrologerImg}
                alt="Portrait of Sudhansu Suman"
                width={800}
                height={900}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 md:-right-8 bg-white border border-border-light shadow-tilt rounded-md p-5 max-w-[230px]">
              <p className="text-[11px] uppercase tracking-widest text-text-muted font-mono">Mentored by</p>
              <p className="font-display text-xl text-indigo-deep mt-1">Umang Taneja</p>
              <p className="text-[12px] text-text-muted mt-1">Master Nadi Astrologer</p>
            </div>
          </div>

          <div data-animate data-animate-delay="2">
            <SectionEyebrow>About</SectionEyebrow>
            <h2 className="font-display text-[34px] md:text-[44px] leading-tight text-indigo-deep font-semibold">
              Sudhansu Suman — an IT graduate who answered an older calling.
            </h2>
            <p className="mt-5 text-text-body leading-relaxed">
              SudnadiAstro was founded by Sudhansu Suman after a decade of studying Nadi Astrology,
              Numerology and Vedic Card reading under master astrologer Umang Taneja. Every report
              that leaves this desk is researched on your specific chart and written by hand.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Nadi Astrology", "Numerology", "Vedic Cards", "Kundli", "Marriage", "Career", "Remedies"].map((s) => (
                <span key={s} className="text-[12.5px] bg-saffron-ghost text-saffron-hover px-3 py-1.5 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-1.5 text-saffron font-semibold text-[15px] border-b-2 border-saffron-border hover:border-saffron pb-1"
            >
              Read his full story <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-cream-warm/50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto" data-animate>
            <SectionEyebrow>Voices</SectionEyebrow>
            <h2 className="font-display text-[36px] md:text-[48px] leading-tight text-indigo-deep font-semibold">
              What clients say after a year, not after a week
            </h2>
            <OrnamentDivider />
          </div>
          <div className="mt-10" data-animate data-animate-delay="2">
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10" data-animate>
            <div>
              <SectionEyebrow>Insights</SectionEyebrow>
              <h2 className="font-display text-[34px] md:text-[44px] text-indigo-deep font-semibold">
                Read before you book
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden md:inline-flex items-center gap-1.5 text-saffron font-semibold text-[14px] border-b-2 border-saffron-border hover:border-saffron pb-0.5"
            >
              All articles <ArrowRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((p, i) => (
              <article
                key={p.id}
                data-animate
                data-animate-delay={(i + 1) as 1 | 2 | 3}
                className="bg-white border border-border-light rounded-lg p-6 hover:shadow-warm transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-3 text-xs">
                  <span className="bg-saffron-ghost text-saffron-hover px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider text-[10.5px]">
                    {p.category}
                  </span>
                  <span className="text-text-muted">{p.readTime} min read</span>
                </div>
                <h3 className="font-display text-[22px] leading-tight text-indigo-deep mt-4">
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-saffron transition-colors">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-3 text-text-body text-[14.5px] line-clamp-3 leading-relaxed flex-1">{p.excerpt}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="mt-5 inline-flex items-center gap-1.5 text-saffron font-semibold text-[13.5px] hover:gap-2 transition-all"
                >
                  Read article <ArrowRight size={14} aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP BAND */}
      <section className="bg-cream-warm border-y border-border-warm py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-6 text-center" data-animate>
          <div className="inline-flex w-14 h-14 rounded-full bg-[#25D366] text-white items-center justify-center mb-5">
            <MessageCircle size={26} aria-hidden />
          </div>
          <h2 className="font-display text-[30px] md:text-[38px] text-indigo-deep font-semibold">
            Not sure which reading you need?
          </h2>
          <p className="mt-3 text-text-body max-w-xl mx-auto">
            Send Sudhansu a quick message on WhatsApp. He'll point you to the right service — no obligation.
          </p>
          <a
            href="https://wa.me/919717691644?text=Hi%20Sudhansu%20ji%2C%20I%E2%80%99m%20not%20sure%20which%20reading%20fits%20me"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#1faa54] transition-colors"
          >
            <MessageCircle size={18} aria-hidden /> Chat on WhatsApp
          </a>
        </div>
      </section>

      <Sparkles className="hidden" aria-hidden />
    </SiteShell>
  );
}
