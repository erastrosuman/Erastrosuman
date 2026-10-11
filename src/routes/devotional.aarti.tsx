import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, Volume2, Square, Copy, Printer, X, Sparkles, Check } from "lucide-react";
import { AARTIS_DATA, type AartiItem } from "@/data/devotional-data";

export const Route = createFileRoute("/devotional/aarti")({
  head: () => ({
    meta: [
      { title: "Aarti Collection — संपूर्ण आरती संग्रह | SudnadiAstro" },
      {
        name: "description",
        content: "Explore a collection of 19 Hindu Aartis on SudnadiAstro for devotional reading, prayer, and audio reading.",
      },
    ],
  }),
  component: AartiPage,
});

export function AartiPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeAarti, setActiveAarti] = useState<AartiItem | null>(AARTIS_DATA[0]);
  const [fontSize, setFontSize] = useState<number>(18);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredAartis = useMemo(() => {
    return AARTIS_DATA.filter((a) => {
      const matchesCat = selectedCategory === "all" || a.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.deity.toLowerCase().includes(q) ||
        a.lyrics.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  const toggleAudio = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("क्षमा करें, आपका ब्राउज़र ऑडियो वाचन का समर्थन नहीं करता है।");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAarti = (aarti: AartiItem) => {
    stopAudio();
    setActiveAarti(aarti);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  return (
    <SiteShell>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#3f155f] via-[#2d0f44] to-[#1e072f] text-cream py-14 px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/devotional"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:underline mb-4 uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={14} /> भक्ति पीठ (Devotional Hub)
          </Link>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
            संपूर्ण आरती संग्रह
          </h1>
          <p className="mt-3 text-cream/75 max-w-xl mx-auto text-sm md:text-base">
            समस्त देवी-देवताओं की पावन एवं प्रामाणिक आरतियां — ऑडियो वाचन, फॉन्ट कस्टमाइजेशन एवं प्रिंट सुविधा सहित।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 space-y-8">
        {/* Active Aarti Reader Box */}
        {activeAarti && (
          <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-warm p-6 md:p-8 animate-fadeIn">
            {/* Top Reader Strip */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-border-light gap-3">
              <div>
                <span className="text-xs uppercase font-mono text-saffron font-bold">
                  {activeAarti.category} • {activeAarti.deity}
                </span>
                <h2 className="font-display text-2xl font-bold text-text-head mt-0.5">
                  {activeAarti.title}
                </h2>
              </div>

              {/* Reader Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAudio(activeAarti.lyrics)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isPlaying
                      ? "bg-amber-500 text-white shadow-md animate-pulse"
                      : "bg-slate-100 text-text-head hover:bg-slate-200"
                  }`}
                >
                  <Volume2 size={15} />
                  {isPlaying ? "रोकें (Stop)" : "आरती सुनें (Audio)"}
                </button>

                <div className="flex items-center border border-border-light rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                    className="px-2.5 py-1.5 text-xs font-bold text-text-body hover:bg-slate-200"
                    title="छोटा आकार"
                  >
                    A-
                  </button>
                  <span className="px-2 text-xs font-mono text-text-muted">{fontSize}px</span>
                  <button
                    type="button"
                    onClick={() => setFontSize((s) => Math.min(26, s + 2))}
                    className="px-2.5 py-1.5 text-xs font-bold text-text-body hover:bg-slate-200"
                    title="बड़ा आकार"
                  >
                    A+
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(activeAarti.lyrics)}
                  className="px-3 py-2 rounded-xl border border-border-light text-xs font-semibold text-text-body hover:bg-slate-50 flex items-center gap-1"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? "कॉपी हुआ!" : "कॉपी"}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl border border-border-light text-xs font-semibold text-text-body hover:bg-slate-50 flex items-center gap-1"
                >
                  <Printer size={14} /> प्रिंट
                </button>
              </div>
            </div>

            {/* Lyrics content */}
            <div className="mt-6 p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60 max-h-[460px] overflow-y-auto text-center">
              <pre
                className="font-hindi text-text-head leading-loose whitespace-pre-wrap font-medium"
                style={{ fontSize: `${fontSize}px` }}
              >
                {activeAarti.lyrics}
              </pre>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-border-light shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 text-text-muted" size={17} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="देवी-देवता या आरती खोजें..."
              className="w-full rounded-xl border border-border-light pl-10 pr-3.5 py-2 text-sm focus:border-saffron focus:outline-none"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {[
              { id: "all", label: "सभी आरतियां" },
              { id: "देव", label: "देव" },
              { id: "देवी", label: "देवी" },
              { id: "विशेष", label: "विशेष / नवग्रह" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-indigo-deep text-white shadow-sm"
                    : "bg-slate-100 text-text-body hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Aarti Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAartis.map((aarti) => {
            const isSelected = activeAarti?.id === aarti.id;
            return (
              <div
                key={aarti.id}
                onClick={() => handleSelectAarti(aarti)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-1 ${
                  isSelected
                    ? "bg-amber-50/80 border-amber-400 shadow-md ring-2 ring-amber-300"
                    : "bg-white border-border-light shadow-warm hover:shadow-tilt"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-text-muted font-mono">
                    {aarti.category}
                  </span>
                  <span className="text-xs font-semibold text-saffron">{aarti.deity}</span>
                </div>
                <h3 className="font-display font-bold text-base text-text-head mb-2">
                  {aarti.title}
                </h3>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {aarti.lyrics.replace(/\n/g, " ").substring(0, 90)}...
                </p>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-border-light text-xs font-semibold text-saffron">
                  <span>आरती पढ़ें →</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAarti(aarti);
                      toggleAudio(aarti.lyrics);
                    }}
                    className="p-1.5 rounded-lg hover:bg-amber-100 text-text-body"
                    title="ऑडियो सुनें"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAartis.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-border-light p-6">
            <p className="text-text-muted text-sm">कोई आरती नहीं मिली। कृपया कोई अन्य शब्द खोजें।</p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
