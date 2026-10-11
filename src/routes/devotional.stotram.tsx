import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Search, Star, Volume2, Copy, Check, Printer, BookOpen, Sparkles } from "lucide-react";
import { STOTRAMS_DATA, type StotramItem } from "@/data/devotional-data";

export const Route = createFileRoute("/devotional/stotram")({
  head: () => ({
    meta: [
      { title: "Vedic Stotram Collection — संपूर्ण स्तोत्र संग्रह | SudnadiAstro" },
      {
        name: "description",
        content: "Explore traditional Vedic and classical Hindu Stotrams: Shiva Tandava, Rudrashtakam, Shree Suktam, Kanakadhara, Ram Raksha and Navagraha Stotrams.",
      },
    ],
  }),
  component: StotramPage,
});

export function StotramPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeStotram, setActiveStotram] = useState<StotramItem | null>(STOTRAMS_DATA[0]);
  const [fontSize, setFontSize] = useState<number>(18);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sudnadi_stotram_favs");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("sudnadi_stotram_favs", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const filteredStotrams = useMemo(() => {
    return STOTRAMS_DATA.filter((s) => {
      let matchesCat = true;
      if (activeCategory === "devta") matchesCat = s.category === "devta";
      else if (activeCategory === "devi") matchesCat = s.category === "devi";
      else if (activeCategory === "graha") matchesCat = s.category === "graha";
      else if (activeCategory === "favorite") matchesCat = favorites.includes(s.id);

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.deity.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.verses.some((v) => v.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory, favorites]);

  const toggleAudio = (verses: string[]) => {
    if (!("speechSynthesis" in window)) {
      alert("क्षमा करें, आपका ब्राउज़र ऑडियो वाचन का समर्थन नहीं करता है।");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const text = verses.join("\n\n");
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

  const handleCopy = (verses: string[]) => {
    navigator.clipboard.writeText(verses.join("\n\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectStotram = (s: StotramItem) => {
    stopAudio();
    setActiveStotram(s);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  return (
    <SiteShell>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1c0508] via-[#4a1500] to-[#7c2d12] text-cream py-14 px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/devotional"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:underline mb-4 uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={14} /> भक्ति पीठ (Devotional Hub)
          </Link>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-amber-100">
            वैदिक महास्तोत्र संग्रह
          </h1>
          <p className="mt-3 text-amber-200/80 max-w-xl mx-auto text-sm md:text-base">
            शिव तांडव, रुद्राष्टकम्, श्री सूक्तम्, कनकधारा, राम रक्षा एवं नवग्रह पीड़ा हर स्तोत्र — शुद्ध संस्कृत श्लोकों सहित।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 space-y-8">
        {/* Active Stotram Reader Card */}
        {activeStotram && (
          <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-warm p-6 md:p-8 animate-fadeIn">
            {/* Top Reader Strip */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-border-light gap-3">
              <div>
                <span className="text-xs uppercase font-mono text-saffron font-bold">
                  {activeStotram.deity} • {activeStotram.subtitle}
                </span>
                <h2 className="font-display text-2xl font-bold text-text-head mt-0.5">
                  {activeStotram.title}
                </h2>
                <p className="text-xs text-text-muted mt-1 max-w-2xl">{activeStotram.desc}</p>
              </div>

              {/* Reader Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAudio(activeStotram.verses)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isPlaying
                      ? "bg-amber-500 text-white shadow-md animate-pulse"
                      : "bg-slate-100 text-text-head hover:bg-slate-200"
                  }`}
                >
                  <Volume2 size={15} />
                  {isPlaying ? "रोकें (Stop)" : "स्तोत्र पाठ सुनें"}
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
                  onClick={() => toggleFavorite(activeStotram.id)}
                  className={`p-2 rounded-xl border border-border-light transition-colors ${
                    favorites.includes(activeStotram.id)
                      ? "bg-amber-100 text-amber-600 border-amber-300"
                      : "text-text-muted hover:bg-slate-50"
                  }`}
                  title="पसंदीदा में जोड़ें"
                >
                  <Star size={16} fill={favorites.includes(activeStotram.id) ? "currentColor" : "none"} />
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(activeStotram.verses)}
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

            {/* Verses */}
            <div className="mt-6 p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60 max-h-[480px] overflow-y-auto text-center space-y-6">
              {activeStotram.verses.map((verse, index) => (
                <div key={index} className="p-4 bg-white/70 rounded-xl border border-amber-200/40 shadow-sm">
                  <pre
                    className="font-hindi text-text-head leading-loose whitespace-pre-wrap font-medium"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {verse}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl border border-border-light shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 text-text-muted" size={17} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="स्तोत्र, भगवान या श्लोक खोजें..."
              className="w-full rounded-xl border border-border-light pl-10 pr-3.5 py-2 text-sm focus:border-saffron focus:outline-none"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {[
              { id: "all", label: "सभी स्तोत्र" },
              { id: "devta", label: "देवता" },
              { id: "devi", label: "देवी" },
              { id: "graha", label: "नवग्रह" },
              { id: "favorite", label: `पसंदीदा (${favorites.length})` },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-amber-700 text-white shadow-sm"
                    : "bg-slate-100 text-text-body hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stotram Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStotrams.map((stotram) => {
            const isSelected = activeStotram?.id === stotram.id;
            const isFav = favorites.includes(stotram.id);
            return (
              <div
                key={stotram.id}
                onClick={() => handleSelectStotram(stotram)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-1 relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-50/80 border-amber-400 shadow-md ring-2 ring-amber-300"
                    : "bg-white border-border-light shadow-warm hover:shadow-tilt"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-text-muted font-mono">
                      {stotram.deity}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(stotram.id, e)}
                      className="text-amber-500 hover:scale-110 transition-transform p-1"
                    >
                      <Star size={16} fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <h3 className="font-display font-bold text-base text-text-head mb-1">
                    {stotram.title}
                  </h3>
                  <p className="text-[11px] font-mono text-saffron mb-2">{stotram.subtitle}</p>
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {stotram.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between text-xs font-semibold text-amber-700">
                  <span>स्तोत्र पाठ खोलें →</span>
                  <span className="text-[11px] text-text-muted font-mono">{stotram.verses.length} श्लोक</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStotrams.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-border-light p-6">
            <p className="text-text-muted text-sm">कोई स्तोत्र नहीं मिला। कृपया कोई अन्य शब्द खोजें।</p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
