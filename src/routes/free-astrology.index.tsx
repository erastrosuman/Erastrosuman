import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { SectionEyebrow } from "@/components/Ornaments";
import { Star, Sun, Calculator, Dices, CreditCard } from "lucide-react";

export const Route = createFileRoute("/free-astrology/")({
  head: () => ({
    meta: [
      { title: "Free Astrology Tools — Rashifal, Kundli, Numerology | SudnadiAstro" },
      {
        name: "description",
        content: "Explore free astrology tools including Daily Rashifal (horoscopes), free Kundli generation, Vedic Numerology (81 combinations), Ram Shalaka and Vedic Card readings.",
      },
      { property: "og:title", content: "Free Astrology — SudnadiAstro" },
    ],
  }),
  component: FreeAstrologyPage,
});

const features = [
  {
    to: "/free-astrology/rashifal",
    icon: Sun,
    title: "Rashifal Dashboard",
    hindiTitle: "राशिफल",
    desc: "Daily, weekly, monthly and yearly Moon sign horoscopes with planetary transit context.",
    hindiDesc: "दैनिक, साप्ताहिक, मासिक और वार्षिक राशिफल",
    color: "from-amber-500 to-orange-600",
  },
  {
    to: "/free-astrology/kundli",
    icon: Star,
    title: "Free Kundli Generator",
    hindiTitle: "फ्री जन्म कुंडली",
    desc: "Instant Vedic birth chart with planetary longitudes, nakshatras, lagna and Lahiri ayanamsa.",
    hindiDesc: "जन्म विवरण से निःशुल्क कुंडली, ग्रह स्थिति, नक्षत्र और लग्न",
    color: "from-indigo-500 to-purple-600",
  },
  {
    to: "/free-astrology/numerology",
    icon: Calculator,
    title: "Vedic Numerology Calculator",
    hindiTitle: "फ्री अंक ज्योतिष",
    desc: "Calculate your Driver (Mulank) and Destiny (Bhagyank) numbers with 81 combination analysis & 3x3 grid.",
    hindiDesc: "मूलांक, भाग्यांक, 81 कॉम्बिनेशन एवं 3×3 वैदिक ग्रिड",
    color: "from-emerald-500 to-teal-600",
  },
  {
    to: "/free-astrology/vedic-card",
    icon: CreditCard,
    title: "Vedic Card Guidance",
    hindiTitle: "वैदिक कार्ड रीडिंग",
    desc: "78-card sacred deck reading across 11 key life topics with planetary duration timing & Purna match rules.",
    hindiDesc: "11 विषयों पर आधारित 78 कार्ड्स का पवित्र वैदिक फलादेश",
    color: "from-rose-500 to-pink-600",
  },
  {
    to: "/free-astrology/ram-shalaka",
    icon: Dices,
    title: "Shri Ram Shalaka Prashnavali",
    hindiTitle: "श्री राम शलाका",
    desc: "Sacred 15x15 Devanagari grid providing divine guidance from Shri Ramcharitmanas chaupais.",
    hindiDesc: "प्रभु श्रीराम के दिव्य मार्गदर्शन से अपने प्रश्न का उत्तर पाएं",
    color: "from-amber-600 to-yellow-500",
  },
];

function FreeAstrologyPage() {
  return (
    <SiteShell>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-deep via-[#1a1a5e] to-[#2d1470] text-cream py-20 md:py-28 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,98,26,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <SectionEyebrow>Free Vedic Astrology Tools • निःशुल्क सेवाएँ</SectionEyebrow>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight">
            Free Astrology
          </h1>
          <p className="mt-5 text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Free Kundli generation, Daily Rashifal, Vedic Numerology, Ram Shalaka and Vedic Card readings —
            all powered by authentic astronomical calculations directly in your browser.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-6xl px-5 md:px-6 -mt-12 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group relative rounded-2xl bg-white border border-border-light shadow-warm p-7 transition-all hover:-translate-y-1 hover:shadow-tilt flex flex-col justify-between"
            >
              <div>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} text-white shadow-lg mb-5`}>
                  <f.icon size={26} />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-display font-semibold text-text-head group-hover:text-saffron transition-colors">
                    {f.title}
                  </h2>
                </div>
                <span className="text-xs font-semibold text-saffron block mt-0.5">{f.hindiTitle}</span>
                <p className="mt-3 text-sm text-text-body leading-relaxed">{f.desc}</p>
                <p className="mt-1 text-xs text-text-muted">{f.hindiDesc}</p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-saffron text-sm font-semibold group-hover:gap-2.5 transition-all">
                Open Tool / खोलें →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
