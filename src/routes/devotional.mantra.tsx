import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, Volume2, Copy, Check, Sparkles, Sun } from "lucide-react";
import { MANTRAS_DATA, type MantraItem } from "@/data/devotional-data";

export const Route = createFileRoute("/devotional/mantra")({
  head: () => ({
    meta: [
      { title: "Vedic & Navagraha Mantras — नवग्रह एवं वैदिक मंत्र संग्रह | SudnadiAstro" },
      {
        name: "description",
        content: "Explore authentic Navagraha mantras (Beej, Gayatri, Mool, Pauranik), Shiva Mahamrityunjaya, Ganesha and Vastu mantras with audio reading.",
      },
    ],
  }),
  component: MantraPage,
});

export function MantraPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [playingMantra, setPlayingMantra] = useState<string | null>(null);
  const [copiedMantra, setCopiedMantra] = useState<string | null>(null);

  const filteredMantras = useMemo(() => {
    return MANTRAS_DATA.filter((item) => {
      let matchesCat = true;
      if (category === "navagraha") matchesCat = item.category === "navagraha";
      else if (category === "gods") matchesCat = item.category === "gods";
      else if (category === "bhavan") matchesCat = item.category === "bhavan";
      else if (category === "gayatri") matchesCat = item.content.some((c) => c.type.includes("गायत्री"));
      else if (category === "beej") matchesCat = item.content.some((c) => c.type.includes("बीज"));

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.content.some(
          (c) =>
            c.mantra.toLowerCase().includes(q) ||
            c.type.toLowerCase().includes(q) ||
            c.desc.toLowerCase().includes(q)
        );

      return matchesCat && matchesSearch;
    });
  }, [search, category]);

  const toggleAudio = (mantraText: string) => {
    if (!("speechSynthesis" in window)) {
      alert("क्षमा करें, आपका ब्राउज़र ऑडियो वाचन का समर्थन नहीं करता है।");
      return;
    }

    if (window.speechSynthesis.speaking && playingMantra === mantraText) {
      window.speechSynthesis.cancel();
      setPlayingMantra(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(mantraText);
    utterance.lang = "hi-IN";
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    utterance.onend = () => setPlayingMantra(null);
    utterance.onerror = () => setPlayingMantra(null);

    window.speechSynthesis.speak(utterance);
    setPlayingMantra(mantraText);
  };

  const handleCopy = (mantraText: string) => {
    navigator.clipboard.writeText(mantraText);
    setCopiedMantra(mantraText);
    setTimeout(() => setCopiedMantra(null), 2000);
  };

  return (
    <SiteShell>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-cream py-14 px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/devotional"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:underline mb-4 uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={14} /> भक्ति पीठ (Devotional Hub)
          </Link>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
            वैदिक एवं नवग्रह मंत्र संग्रह
          </h1>
          <p className="mt-3 text-cream/75 max-w-xl mx-auto text-sm md:text-base">
            समस्त नवग्रहों के बीज, गायत्री, मूल एवं पौराणिक मंत्र, महामृत्युंजय एवं गणेश विघ्नहर्ता मंत्र।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 space-y-8">
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl border border-border-light shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 text-text-muted" size={17} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ग्रह, देवता या मंत्र खोजें..."
              className="w-full rounded-xl border border-border-light pl-10 pr-3.5 py-2 text-sm focus:border-saffron focus:outline-none"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {[
              { id: "all", label: "सभी मंत्र" },
              { id: "navagraha", label: "नवग्रह मंत्र" },
              { id: "gods", label: "देव मंत्र" },
              { id: "gayatri", label: "गायत्री मंत्र" },
              { id: "beej", label: "बीज मंत्र" },
              { id: "bhavan", label: "वास्तु मंत्र" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat.id
                    ? "bg-indigo-deep text-white shadow-sm"
                    : "bg-slate-100 text-text-body hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mantra Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredMantras.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-border-light shadow-warm p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-border-light mb-4">
                  <span className="text-3xl p-2 bg-amber-50 rounded-xl border border-amber-200">
                    {item.icon}
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-lg text-text-head">
                      {item.title}
                    </h2>
                    <span className="text-[11px] text-saffron font-medium">
                      SudnadiAstro Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {item.content.map((c, i) => {
                    const isAudioPlaying = playingMantra === c.mantra;
                    const isCopied = copiedMantra === c.mantra;
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                            {c.type}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleAudio(c.mantra)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                isAudioPlaying
                                  ? "bg-amber-500 text-white animate-pulse"
                                  : "bg-white border border-border-light text-text-body hover:bg-slate-100"
                              }`}
                            >
                              <Volume2 size={13} />
                              {isAudioPlaying ? "रोकें" : "सुनें"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(c.mantra)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-border-light text-text-body hover:bg-slate-100 flex items-center gap-1"
                            >
                              {isCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                              {isCopied ? "कॉपी!" : "कॉपी"}
                            </button>
                          </div>
                        </div>

                        <p className="font-hindi text-base md:text-lg font-bold text-text-head my-2 leading-relaxed">
                          {c.mantra}
                        </p>
                        <p className="text-xs text-text-muted italic border-t border-slate-200/60 pt-2">
                          💡 {c.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMantras.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-border-light p-6">
            <p className="text-text-muted text-sm">कोई मंत्र नहीं मिला। कृपया कोई अन्य शब्द खोजें।</p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
