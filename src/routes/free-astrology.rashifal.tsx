import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState, useCallback } from "react";
import { ZODIAC_SIGNS } from "@/lib/astro/config";
import { generateHoroscope, MODE_LABELS, type HoroscopeMode, type HoroscopeResult } from "@/lib/astro/rashifal";
import { ArrowLeft, Sun, Calendar, Moon as MoonIcon, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/free-astrology/rashifal")({
  head: () => ({
    meta: [
      { title: "राशिफल — दैनिक, साप्ताहिक, मासिक, वार्षिक | SudnadiAstro" },
      {
        name: "description",
        content: "Read your daily, weekly, monthly and yearly Rashifal based on Moon sign transit calculations.",
      },
    ],
  }),
  component: RashifalPage,
});

const MODE_ICONS = {
  daily: Sun,
  weekly: Calendar,
  monthly: MoonIcon,
  yearly: Sparkles,
};

const MODE_CARDS: { mode: HoroscopeMode; title: string; desc: string }[] = [
  { mode: "daily", title: "दैनिक राशिफल", desc: "आज का चंद्र राशि आधारित फलादेश" },
  { mode: "weekly", title: "साप्ताहिक राशिफल", desc: "इस सप्ताह का सामान्य राशिफल" },
  { mode: "monthly", title: "मासिक राशिफल", desc: "इस महीने का राशि आधारित फलादेश" },
  { mode: "yearly", title: "वार्षिक राशिफल", desc: "इस वर्ष का सामान्य राशिफल" },
];

function RashifalPage() {
  const [selectedMode, setSelectedMode] = useState<HoroscopeMode | null>(null);
  const [result, setResult] = useState<HoroscopeResult | null>(null);

  const handleSignClick = useCallback(
    (signIndex: number) => {
      if (!selectedMode) return;
      const r = generateHoroscope(signIndex, selectedMode);
      setResult(r);
    },
    [selectedMode]
  );

  const goBack = () => {
    if (result) {
      setResult(null);
    } else {
      setSelectedMode(null);
    }
  };

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-deep via-[#1a1a5e] to-[#2d1470] text-cream py-14 md:py-20 px-6">
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            राशिफल Dashboard
          </h1>
          <p className="mt-4 text-cream/70 max-w-2xl mx-auto">
            अपनी चंद्र राशि चुनकर सामान्य राशिफल देखें।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 md:px-6 py-12">
        {/* Breadcrumb / Back */}
        <div className="mb-8 flex items-center gap-3">
          {selectedMode ? (
            <button onClick={goBack} className="inline-flex items-center gap-2 text-saffron font-semibold text-sm hover:underline">
              <ArrowLeft size={16} /> {result ? MODE_LABELS[selectedMode] : "Dashboard"}
            </button>
          ) : (
            <Link to="/free-astrology" className="inline-flex items-center gap-2 text-saffron font-semibold text-sm hover:underline">
              <ArrowLeft size={16} /> Free Astrology
            </Link>
          )}
        </div>

        {/* Dashboard: Mode selection */}
        {!selectedMode && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MODE_CARDS.map((card) => {
              const Icon = MODE_ICONS[card.mode];
              return (
                <button
                  key={card.mode}
                  onClick={() => setSelectedMode(card.mode)}
                  className="group text-left rounded-2xl bg-white border border-border-light shadow-warm p-6 transition-all hover:-translate-y-1 hover:shadow-tilt hover:border-saffron-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron to-saffron-hover text-white flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-lg font-display font-semibold text-text-head">{card.title}</h2>
                  <p className="mt-2 text-sm text-text-muted">{card.desc}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Zodiac sign selection */}
        {selectedMode && !result && (
          <div>
            <h2 className="text-2xl font-display font-semibold text-text-head mb-2">{MODE_LABELS[selectedMode]}</h2>
            <p className="text-text-muted text-sm mb-8">अपनी चंद्र राशि पर क्लिक करें — राशिफल तुरंत दिखेगा।</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {ZODIAC_SIGNS.map((sign, i) => (
                <button
                  key={sign.en}
                  onClick={() => handleSignClick(i)}
                  className="group rounded-xl bg-white border border-border-light p-4 text-center transition-all hover:border-saffron hover:shadow-warm hover:-translate-y-0.5"
                >
                  <span className="text-3xl block">{sign.icon}</span>
                  <span className="block mt-2 text-sm font-semibold text-text-head">{sign.hi}</span>
                  <span className="block text-xs text-text-muted">{sign.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result view */}
        {result && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white border border-border-light shadow-warm overflow-hidden">
              {/* Result header */}
              <div className="bg-gradient-to-r from-indigo-deep to-[#2d1470] text-cream px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-4xl mr-3">{result.sign.icon}</span>
                    <span className="text-2xl font-display font-bold">{result.sign.hi}</span>
                    <span className="text-cream/60 ml-2">({result.sign.en})</span>
                  </div>
                  <button onClick={() => setResult(null)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                    <X size={18} />
                  </button>
                </div>
                <p className="mt-2 text-cream/70 text-sm">
                  <span className="font-semibold text-gold-light">{MODE_LABELS[result.mode]}</span> • {result.periodText} • तत्व: {result.sign.element}
                </p>
              </div>

              {/* Result body */}
              <div className="p-8 space-y-5">
                {/* Overall tone */}
                <div className="flex items-center gap-3 bg-saffron-ghost rounded-xl px-5 py-3 border border-saffron-border">
                  <Sparkles size={18} className="text-saffron" />
                  <span className="text-sm font-semibold text-saffron-hover">
                    कुल प्रभाव: {result.overallTone}
                  </span>
                </div>

                {/* Lead */}
                <div>
                  <h3 className="text-base font-display font-semibold text-text-head mb-1">{result.lead}</h3>
                  <p className="text-sm text-text-body">{result.extra}</p>
                </div>

                {/* Categories */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-cream-warm p-5 border border-border-light">
                    <p className="text-xs font-semibold text-text-muted mb-1">💼 करियर</p>
                    <p className="text-sm text-text-body">{result.career}</p>
                  </div>
                  <div className="rounded-xl bg-cream-warm p-5 border border-border-light">
                    <p className="text-xs font-semibold text-text-muted mb-1">💰 धन</p>
                    <p className="text-sm text-text-body">{result.money}</p>
                  </div>
                  <div className="rounded-xl bg-cream-warm p-5 border border-border-light">
                    <p className="text-xs font-semibold text-text-muted mb-1">❤️ रिश्ते</p>
                    <p className="text-sm text-text-body">{result.relation}</p>
                  </div>
                  <div className="rounded-xl bg-cream-warm p-5 border border-border-light">
                    <p className="text-xs font-semibold text-text-muted mb-1">🌿 स्वास्थ्य</p>
                    <p className="text-sm text-text-body">{result.health}</p>
                  </div>
                </div>

                {/* Period advice */}
                <div className="rounded-xl bg-indigo-deep/5 p-5 border border-indigo-deep/10">
                  <p className="text-xs font-semibold text-indigo-deep mb-1">✨ अवधि-सुझाव</p>
                  <p className="text-sm text-text-body">{result.advice}</p>
                </div>

                {/* Transit summaries */}
                {result.transitSummaries.length > 0 && (
                  <div>
                    <h3 className="text-sm font-display font-semibold text-text-head mb-3">🪐 ग्रह गोचर विश्लेषण</h3>
                    <ul className="space-y-2">
                      {result.transitSummaries.map((s, i) => (
                        <li key={i} className="text-sm text-text-body pl-4 border-l-2 border-saffron/40 py-1">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                <p className="text-xs text-text-muted mt-6 pt-4 border-t border-border-light">
                  यह चंद्र राशि आधारित सामान्य ज्योतिषीय सामग्री है; इसे निश्चित घटना या पेशेवर चिकित्सा/वित्तीय सलाह न मानें।
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
