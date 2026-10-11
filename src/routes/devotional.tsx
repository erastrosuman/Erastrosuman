import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Flame, Sparkles, BookOpen, Sun } from "lucide-react";

export const Route = createFileRoute("/devotional")({
  head: () => ({
    meta: [
      { title: "Devotional Collection — Aarti, Mantras & Stotrams | SudnadiAstro" },
      {
        name: "description",
        content: "Explore authentic Hindu devotional resources: Aarti Sangrah (19 Aartis with audio), Navagraha & Vedic Mantras, and classical Sanskrit Stotrams.",
      },
      { property: "og:title", content: "Devotional Collection — SudnadiAstro" },
    ],
  }),
  component: DevotionalHubPage,
});

const devotionalSections = [
  {
    to: "/devotional/aarti",
    icon: Flame,
    title: "Aarti Collection",
    hindiTitle: "संपूर्ण आरती संग्रह",
    desc: "19 authentic Aartis including Lord Ganesha, Lakshmi, Shiva, Hanuman, and Durga with text-to-speech audio reader, font resize, and printing.",
    hindiDesc: "19 प्रमुख देवी-देवताओं की प्रामाणिक आरतियां, ऑडियो वाचन एवं प्रिंट सुविधा।",
    color: "from-amber-500 to-orange-600",
    badge: "19 Aartis / आरतियां",
  },
  {
    to: "/devotional/mantra",
    icon: Sun,
    title: "Vedic & Navagraha Mantras",
    hindiTitle: "वैदिक एवं नवग्रह मंत्र",
    desc: "Sacred mantras for all 9 planets (Beej, Gayatri, Mool, Pauranik) plus Lord Shiva Mahamrityunjaya, Ganesha, and Vastu Purush mantras.",
    hindiDesc: "सूर्य से शनि तक नवग्रहों के मंत्र, महामृत्युंजय एवं वास्तु मंत्र।",
    color: "from-indigo-600 to-purple-600",
    badge: "Navagraha & Devas",
  },
  {
    to: "/devotional/stotram",
    icon: BookOpen,
    title: "Stotram Collection",
    hindiTitle: "वैदिक महास्तोत्र संग्रह",
    desc: "Classical Sanskrit hymns including Shiva Tandava, Rudrashtakam, Shree Suktam, Kanakadhara, Ram Raksha, and Navagraha Peeda Har Stotrams.",
    hindiDesc: "शिव तांडव, रुद्राष्टकम्, श्री सूक्तम्, कनकधारा, राम रक्षा स्तोत्र।",
    color: "from-rose-600 to-amber-600",
    badge: "Sanskrit Hymns",
  },
];

export function DevotionalHubPage() {
  return (
    <SiteShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2e0813] via-[#4c0519] to-[#701a2b] text-cream py-20 md:py-28 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> Sacred Devotional Portal • सनातन भक्ति पीठ
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white">
            Devotional Collection
          </h1>
          <p className="mt-5 text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Sacred Hindu Aartis, Navagraha peace mantras, and uplifting Vedic Stotrams —
            preserved in authentic Sanskrit and Devanagari text with audio listening tools.
          </p>
        </div>
      </section>

      {/* Grid of Sections */}
      <section className="mx-auto max-w-6xl px-5 md:px-6 -mt-12 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {devotionalSections.map((sec) => (
            <Link
              key={sec.to}
              to={sec.to}
              className="group relative rounded-2xl bg-white border border-border-light shadow-warm p-7 transition-all hover:-translate-y-1.5 hover:shadow-tilt flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${sec.color} text-white shadow-lg`}>
                    <sec.icon size={26} />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-text-head font-medium">
                    {sec.badge}
                  </span>
                </div>
                <h2 className="text-xl font-display font-semibold text-text-head group-hover:text-saffron transition-colors">
                  {sec.title}
                </h2>
                <span className="text-xs font-semibold text-saffron block mt-0.5">{sec.hindiTitle}</span>
                <p className="mt-3 text-sm text-text-body leading-relaxed">{sec.desc}</p>
                <p className="mt-1 text-xs text-text-muted">{sec.hindiDesc}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-saffron text-sm font-semibold group-hover:gap-2.5 transition-all">
                Explore Collection / संग्रह खोलें →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
