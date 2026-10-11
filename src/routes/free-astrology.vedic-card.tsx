import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState, useMemo } from "react";
import { ArrowLeft, Sparkles, RotateCcw, Shuffle, HelpCircle, CheckCircle, AlertTriangle, Info, Printer } from "lucide-react";

export const Route = createFileRoute("/free-astrology/vedic-card")({
  head: () => ({
    meta: [
      { title: "Free Vedic Card Reading | SudnadiAstro" },
      {
        name: "description",
        content: "Experience authentic Vedic Card Guidance online with 78 symbolic cards, planetary timing and strict Purna match astrological rules.",
      },
    ],
  }),
  component: VedicCardPage,
});

interface PlanetItem {
  id: string;
  hi: string;
  en: string;
  symbol: string;
  bg: string;
  border: string;
  text: string;
  durationText: string;
  yearsNum: number;
}

interface HouseItem {
  id: string;
  houseNo: number;
  houseName: string;
  houseHi: string;
  element: string;
  elementIcon: string;
  bg: string;
  border: string;
  text: string;
}

interface RashiItem {
  hi: string;
  en: string;
  symbol: string;
  bg: string;
  border: string;
  text: string;
}

const ALL_PLANETS: PlanetItem[] = [
  { id: "sun", hi: "सूर्य", en: "Sun", symbol: "🌅", bg: "#991b1b", border: "#f97316", text: "#ffedd5", durationText: "1 साल", yearsNum: 1 },
  { id: "moon", hi: "चंद्रमा", en: "Moon", symbol: "🌕", bg: "#1e293b", border: "#e2e8f0", text: "#ffffff", durationText: "1 महीना", yearsNum: 0.08 },
  { id: "mars", hi: "मंगल", en: "Mars", symbol: "♂", bg: "#7f1d1d", border: "#ef4444", text: "#fef2f2", durationText: "1 साल", yearsNum: 1 },
  { id: "mercury", hi: "बुध", en: "Mercury", symbol: "☿", bg: "#064e3b", border: "#10b981", text: "#ecfdf5", durationText: "1 साल", yearsNum: 1 },
  { id: "jupiter", hi: "बृहस्पति", en: "Jupiter", symbol: "♃", bg: "#78350f", border: "#f59e0b", text: "#fef3c7", durationText: "1 साल", yearsNum: 1 },
  { id: "venus", hi: "शुक्र", en: "Venus", symbol: "♀", bg: "#831843", border: "#f472b6", text: "#fdf2f8", durationText: "1 साल", yearsNum: 1 },
  { id: "saturn", hi: "शनि", en: "Saturn", symbol: "♄", bg: "#0f172a", border: "#3b82f6", text: "#eff6ff", durationText: "ढाई साल", yearsNum: 2.5 },
  { id: "rahu", hi: "राहु", en: "Rahu", symbol: "☊", bg: "#18181b", border: "#a1a1aa", text: "#f4f4f5", durationText: "डेढ़ साल", yearsNum: 1.5 },
  { id: "ketu", hi: "केतु", en: "Ketu", symbol: "☋", bg: "#4c1d95", border: "#c084fc", text: "#faf5ff", durationText: "डेढ़ साल", yearsNum: 1.5 },
  { id: "uranus", hi: "यूरेनस", en: "Pioneers/Uranus", symbol: "♅", bg: "#155e75", border: "#06b6d4", text: "#cff4fc", durationText: "3 साल", yearsNum: 3 },
  { id: "neptune", hi: "नेपच्यून", en: "Neptune", symbol: "♆", bg: "#1e1b4b", border: "#818cf8", text: "#e0e7ff", durationText: "3 साल", yearsNum: 3 },
  { id: "pluto", hi: "प्लूटो", en: "Pluto", symbol: "♇", bg: "#312e81", border: "#a5b4fc", text: "#e0e7ff", durationText: "3 साल", yearsNum: 3 },
];

const ELEMENTS = [
  { name: "Earth (पृथ्वी)", icon: "🌍", bg: "#064e3b", border: "#10b981", text: "#ecfdf5" },
  { name: "Fire (अग्नि)", icon: "🔥", bg: "#7f1d1d", border: "#f97316", text: "#ffedd5" },
  { name: "Air (वायु)", icon: "💨", bg: "#0c4a6e", border: "#38bdf8", text: "#e0f2fe" },
  { name: "Jal (जल)", icon: "💧", bg: "#134e4a", border: "#14b8a6", text: "#ccfbf1" },
];

const BASE_HOUSES = [
  { no: 1, name: "Self", hi: "पहला भाव" },
  { no: 2, name: "Profusion", hi: "दूसरा भाव" },
  { no: 3, name: "Interaction", hi: "तीसरा भाव" },
  { no: 4, name: "Earth", hi: "चौथा भाव" },
  { no: 5, name: "Love", hi: "पाँचवाँ भाव" },
  { no: 6, name: "Evil", hi: "छठा भाव" },
  { no: 7, name: "Companion", hi: "सातवाँ भाव" },
  { no: 8, name: "Mystic", hi: "आठवाँ भाव" },
  { no: 9, name: "Blessing", hi: "नौवाँ भाव" },
  { no: 10, name: "Authority", hi: "दसवाँ भाव" },
  { no: 11, name: "Gain / Desire", hi: "ग्यारहवाँ भाव" },
  { no: 12, name: "Death", hi: "बारहवाँ भाव" },
];

function generateHousePool(): HouseItem[] {
  const pool: HouseItem[] = [];
  let hId = 1;
  BASE_HOUSES.forEach((h) => {
    ELEMENTS.forEach((el) => {
      pool.push({
        id: `h_${hId++}`,
        houseNo: h.no,
        houseName: h.name,
        houseHi: h.hi,
        element: el.name,
        elementIcon: el.icon,
        bg: el.bg,
        border: el.border,
        text: el.text,
      });
    });
  });
  return pool;
}

const ALL_RASHIS: RashiItem[] = [
  { hi: "मेष", en: "Aries", symbol: "♈", bg: "#7f1d1d", border: "#ef4444", text: "#fef2f2" },
  { hi: "वृषभ", en: "Taurus", symbol: "♉", bg: "#831843", border: "#f472b6", text: "#fdf2f8" },
  { hi: "मिथुन", en: "Gemini", symbol: "♊", bg: "#064e3b", border: "#10b981", text: "#ecfdf5" },
  { hi: "कर्क", en: "Cancer", symbol: "♋", bg: "#1e293b", border: "#e2e8f0", text: "#ffffff" },
  { hi: "सिंह", en: "Leo", symbol: "♌", bg: "#991b1b", border: "#f97316", text: "#ffedd5" },
  { hi: "कन्या", en: "Virgo", symbol: "♍", bg: "#064e3b", border: "#10b981", text: "#ecfdf5" },
  { hi: "तुला", en: "Libra", symbol: "♎", bg: "#831843", border: "#f472b6", text: "#fdf2f8" },
  { hi: "वृश्चिक", en: "Scorpio", symbol: "♏", bg: "#7f1d1d", border: "#ef4444", text: "#fef2f2" },
  { hi: "धनु", en: "Sagittarius", symbol: "♐", bg: "#78350f", border: "#f59e0b", text: "#fef3c7" },
  { hi: "मकर", en: "Capricorn", symbol: "♑", bg: "#0f172a", border: "#3b82f6", text: "#eff6ff" },
  { hi: "कुंभ", en: "Aquarius", symbol: "♒", bg: "#0f172a", border: "#3b82f6", text: "#eff6ff" },
  { hi: "मीन", en: "Pisces", symbol: "♓", bg: "#78350f", border: "#f59e0b", text: "#fef3c7" },
];

const CATEGORIES = [
  { title: "विवाह", enTitle: "Marriage", icon: "💍", question: "मेरी शादी कब होगी?", enQuestion: "When will I get married?", req: [2, 7, 11], neg: [1, 6, 10, 12] },
  { title: "प्रेम", enTitle: "Love & Relationship", icon: "❤️", question: "क्या मेरा प्रेम संबंध सफल होगा?", enQuestion: "Will my love relationship succeed?", req: [5, 11], neg: [5, 8, 12] },
  { title: "डाइवोर्स", enTitle: "Divorce / Separation", icon: "⚖", question: "क्या हमारा डाइवोर्स होगा?", enQuestion: "Will there be separation or legal divorce?", req: [1, 6, 8, 10, 12], neg: [2, 7, 11] },
  { title: "नौकरी या व्यापार", enTitle: "Career & Business", icon: "💼", question: "क्या मुझे नई नौकरी या व्यापार में लाभ मिलेगा?", enQuestion: "Will I get a new job or business prosperity?", req: [2, 6, 10, 11], neg: [5, 8, 12] },
  { title: "शिक्षा", enTitle: "Education & Exams", icon: "🎓", question: "क्या मैं परीक्षा में पास हो जाऊंगा?", enQuestion: "Will I pass my examinations successfully?", req: [4, 9, 11], neg: [6, 8, 12] },
  { title: "संपत्ति", enTitle: "Property & Real Estate", icon: "🏠", question: "क्या मैं नई संपत्ति खरीद पाऊंगा?", enQuestion: "Will I be able to purchase property or a home?", req: [4, 11, 12], neg: [3, 5, 10] },
  { title: "वाहन", enTitle: "Vehicle Purchase", icon: "🚗", question: "क्या मैं नई गाड़ी खरीदूंगा?", enQuestion: "Will I buy a new vehicle or car?", req: [4, 11, 12], neg: [4, 8, 12] },
  { title: "स्वास्थ्य", enTitle: "Health & Vitality", icon: "🌿", question: "मेरी सेहत कब सुधरेगी?", enQuestion: "When will my health and wellbeing improve?", req: [1, 5, 9, 11], neg: [1, 6, 8, 12] },
  { title: "यात्रा और वीज़ा", enTitle: "Travel & Visa", icon: "✈", question: "क्या मेरी विदेश यात्रा या वीज़ा स्वीकृत होगा?", enQuestion: "Will my visa or foreign journey be approved?", req: [3, 9, 11, 12], neg: [6, 8, 12] },
  { title: "कारावास / केस", enTitle: "Legal Disputes / Court", icon: "🏛", question: "क्या कानूनी कार्यवाही या कारावास का योग है?", enQuestion: "Is there indication of legal disputes or custody?", req: [2, 3, 8, 12], neg: [6, 10, 11] },
  { title: "संतान सुख", enTitle: "Children & Progeny", icon: "👶", question: "क्या संतान सुख प्राप्त होगा?", enQuestion: "Will we be blessed with child happiness?", req: [2, 5, 11], neg: [1, 4, 10, 6, 8, 12] },
];

function getHouseRule(planet: PlanetItem | null) {
  if (!planet) return { count: 2, isDuplicateRule: false };
  if (["Pluto", "Neptune", "Pioneers/Uranus", "Moon", "Sun"].includes(planet.en)) {
    return { count: 2, isDuplicateRule: false };
  }
  if (["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].includes(planet.en)) {
    return { count: 3, isDuplicateRule: false };
  }
  if (["Rahu", "Ketu"].includes(planet.en)) {
    return { count: null, isDuplicateRule: true };
  }
  return { count: 2, isDuplicateRule: false };
}

type StepType =
  | "category"
  | "question"
  | "past-planet"
  | "past-houses"
  | "present-planet"
  | "present-houses"
  | "future-planet"
  | "future-houses"
  | "rashi"
  | "calculating"
  | "result";

export function VedicCardPage() {
  const [step, setStep] = useState<StepType>("category");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [question, setQuestion] = useState("");
  const [shuffleNotice, setShuffleNotice] = useState(false);

  // Available pools
  const [availPlanets, setAvailPlanets] = useState<PlanetItem[]>([...ALL_PLANETS]);
  const [availHouses, setAvailHouses] = useState<HouseItem[]>(generateHousePool());
  const [availRashis, setAvailRashis] = useState<RashiItem[]>([...ALL_RASHIS]);

  // Selections
  const [pastPlanet, setPastPlanet] = useState<PlanetItem | null>(null);
  const [pastHouses, setPastHouses] = useState<HouseItem[]>([]);

  const [presentPlanet, setPresentPlanet] = useState<PlanetItem | null>(null);
  const [presentHouses, setPresentHouses] = useState<HouseItem[]>([]);

  const [futurePlanet, setFuturePlanet] = useState<PlanetItem | null>(null);
  const [futureHouses, setFutureHouses] = useState<HouseItem[]>([]);

  const [finalRashi, setFinalRashi] = useState<RashiItem | null>(null);

  const handleSelectCategory = (cat: typeof CATEGORIES[0]) => {
    setSelectedCategory(cat);
    setQuestion(cat.question);
    setStep("question");
  };

  const handleShuffle = () => {
    setAvailPlanets((prev) => [...prev].sort(() => Math.random() - 0.5));
    setAvailHouses((prev) => [...prev].sort(() => Math.random() - 0.5));
    setAvailRashis((prev) => [...prev].sort(() => Math.random() - 0.5));
    setShuffleNotice(true);
    setTimeout(() => setShuffleNotice(false), 2000);
  };

  const startReading = () => {
    if (!question.trim()) {
      alert("कृपया पहले अपना प्रश्न लिखें!");
      return;
    }
    setStep("past-planet");
  };

  const handlePickPlanet = (row: "past" | "present" | "future", planet: PlanetItem) => {
    setAvailPlanets((prev) => prev.filter((p) => p.id !== planet.id));
    if (row === "past") {
      setPastPlanet(planet);
      setStep("past-houses");
    } else if (row === "present") {
      setPresentPlanet(planet);
      setStep("present-houses");
    } else if (row === "future") {
      setFuturePlanet(planet);
      setStep("future-houses");
    }
  };

  const handlePickHouse = (row: "past" | "present" | "future", item: HouseItem) => {
    const currentPlanet = row === "past" ? pastPlanet : row === "present" ? presentPlanet : futurePlanet;
    const currentHouses = row === "past" ? pastHouses : row === "present" ? presentHouses : futureHouses;
    const rule = getHouseRule(currentPlanet);

    const isDuplicate = currentHouses.some((h) => h.houseNo === item.houseNo);
    const updated = [...currentHouses, item];
    setAvailHouses((prev) => prev.filter((h) => h.id !== item.id));

    if (row === "past") setPastHouses(updated);
    if (row === "present") setPresentHouses(updated);
    if (row === "future") setFutureHouses(updated);

    if (rule.isDuplicateRule) {
      if (isDuplicate) {
        setTimeout(() => {
          if (row === "past") setStep("present-planet");
          if (row === "present") setStep("future-planet");
          if (row === "future") setStep("rashi");
        }, 600);
      }
    } else {
      if (updated.length >= (rule.count || 2)) {
        setTimeout(() => {
          if (row === "past") setStep("present-planet");
          if (row === "present") setStep("future-planet");
          if (row === "future") setStep("rashi");
        }, 600);
      }
    }
  };

  const handlePickRashi = (r: RashiItem) => {
    setFinalRashi(r);
    setAvailRashis((prev) => prev.filter((item) => item.en !== r.en));
    setStep("calculating");
    setTimeout(() => {
      setStep("result");
    }, 1200);
  };

  const resetAll = () => {
    setAvailPlanets([...ALL_PLANETS]);
    setAvailHouses(generateHousePool());
    setAvailRashis([...ALL_RASHIS]);
    setPastPlanet(null);
    setPastHouses([]);
    setPresentPlanet(null);
    setPresentHouses([]);
    setFuturePlanet(null);
    setFutureHouses([]);
    setFinalRashi(null);
    setStep("category");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Outcome computation
  const outcome = useMemo(() => {
    if (step !== "result") return null;

    const fHouses = futureHouses.map((h) => h.houseNo);
    const req = selectedCategory.req;
    const neg = selectedCategory.neg;

    const isPurnaMatch = req.every((h) => fHouses.includes(h));
    const isNegativeMatch = neg.some((h) => fHouses.includes(h));

    const durationStr = pastPlanet ? pastPlanet.durationText : "1 साल";

    let verdict = "";
    let englishVerdict = "";
    let statusType: "success" | "warning" | "neutral" = "neutral";

    if (isPurnaMatch) {
      statusType = "success";
      verdict = `✨ आपके द्वारा पूछे गए प्रश्न के विषय में, ${selectedCategory.title} (${selectedCategory.enTitle}) के सभी आवश्यक कॉम्बिनेशन पूरी तरह से आपस में मेल खाते हैं। इस कार्य में सफलता और शुभ परिणाम प्राप्त होने के स्पष्ट योग बन रहे हैं (${durationStr} के दौरान)।`;
      englishVerdict = `✨ Regarding your inquiry on ${selectedCategory.enTitle}, all required astrological house combinations align perfectly (Purna Match). Strong indications for auspicious success within the timeframe of ${durationStr}.`;
    } else if (isNegativeMatch) {
      statusType = "warning";
      verdict = `⚠️ आपके द्वारा पूछे गए प्रश्न के विषय में, ${selectedCategory.title} (${selectedCategory.enTitle}) से जुड़े मामले में कुछ नकारात्मक बाधाएं या प्रतिकूल परिणाम संकेतित हो रहे हैं। इस अवधि में सतर्कता एवं धैर्य रखने की आवश्यकता है (${durationStr} के दौरान)।`;
      englishVerdict = `⚠️ Regarding your inquiry on ${selectedCategory.enTitle}, adverse indicators or obstacle-inducing houses are present. Prudence, patience, and remedial awareness are advised within ${durationStr}.`;
    } else {
      statusType = "neutral";
      verdict = `📋 आपके द्वारा पूछे गए प्रश्न के विषय में, आवश्यक कॉम्बिनेशन पूर्ण रूप से मेल नहीं खा रहे हैं। स्थिति सामान्य तथा यथावत बनी रहेगी (${durationStr} के दौरान)।`;
      englishVerdict = `📋 Regarding your inquiry on ${selectedCategory.enTitle}, the required combinations do not achieve full alignment. The status remains moderate and progressive within ${durationStr}.`;
    }

    return {
      isPurnaMatch,
      isNegativeMatch,
      verdict,
      englishVerdict,
      statusType,
      durationStr,
      req,
      fHouses,
    };
  }, [step, futureHouses, selectedCategory, pastPlanet]);

  return (
    <SiteShell>
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-deep via-[#1a1a5e] to-[#2d1470] text-cream py-14 px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/free-astrology"
            className="inline-flex items-center gap-1.5 text-xs text-saffron hover:underline mb-4 uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={14} /> फ्री ज्योतिष उपकरण (Free Tools)
          </Link>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            Free Vedic Card Guidance
          </h1>
          <p className="mt-3 text-cream/75 max-w-xl mx-auto text-sm md:text-base">
            78 कार्ड्स के पवित्र वैदिक डेक से सटीक मार्गदर्शन, ग्रह समय चक्र एवं पूर्ण भाव मिलान नियम।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 min-h-[500px]">
        {/* Step 1: Category Selector */}
        {step === "category" && (
          <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-wider font-mono text-saffron font-bold">चरण 1</span>
              <h2 className="font-display text-2xl font-bold text-text-head mt-1">
                🎴 मुख्य विषय चुनें (Select Topic)
              </h2>
              <p className="text-text-muted text-sm mt-1">
                अपनी जिज्ञासा के अनुसार नीचे दिए गए किसी एक विषय पर क्लिक करें:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.title}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className="p-4 rounded-xl border border-border-light bg-slate-50 hover:bg-white hover:border-saffron hover:shadow-tilt text-center transition-all group"
                >
                  <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <h3 className="font-display font-bold text-sm text-text-head group-hover:text-saffron">
                    {cat.title}
                  </h3>
                  <span className="text-[11px] text-text-muted block mt-0.5">
                    {cat.enTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Question & Shuffle */}
        {step === "question" && (
          <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-5">
              <span className="font-bold text-saffron text-sm flex items-center gap-1.5">
                विषय: {selectedCategory.icon} {selectedCategory.title}
              </span>
              <button
                type="button"
                onClick={() => setStep("category")}
                className="text-xs text-text-muted hover:text-text-head underline"
              >
                विषय बदलें
              </button>
            </div>

            <p className="text-xs text-text-muted mb-4">
              78 कार्ड्स का पवित्र वैदिक डेक शफल करने के लिए तैयार है।
            </p>

            <div className="mb-5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleShuffle}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-text-head flex items-center gap-1.5 transition-all"
              >
                <Shuffle size={14} /> शफल करें (Shuffle)
              </button>
              {shuffleNotice && (
                <span className="text-xs font-semibold text-emerald-600 animate-fadeIn">
                  ✨ डेक सफलतापूर्वक शफल हुआ!
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-text-head mb-1.5">
                अपना विशिष्ट प्रश्न दर्ज करें (Enter Question):
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") startReading();
                }}
                className="w-full rounded-xl border border-border-light px-3.5 py-2.5 text-sm focus:border-saffron focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={startReading}
              className="w-full py-3 rounded-xl bg-saffron text-white font-bold text-sm hover:bg-saffron-hover transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> प्रश्न सबमिट करें और रीडिंग शुरू करें
            </button>
          </div>
        )}

        {/* Step: Card Selection (Past / Present / Future Planets & Houses) */}
        {step.includes("planet") && (
          <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <div>
                <span className="text-xs uppercase font-mono text-saffron font-bold">
                  {step === "past-planet" && "पंक्ति 1: भूतकाल / वर्तमान स्थिति (Past Row)"}
                  {step === "present-planet" && "पंक्ति 2: मार्ग एवं प्रयास (Present Row)"}
                  {step === "future-planet" && "पंक्ति 3: परिणाम एवं अंतिम फलादेश (Future Row)"}
                </span>
                <h3 className="font-display text-lg font-bold text-text-head mt-0.5">
                  प्लैनेट कार्ड चुनें (Pick 1 Planet Card)
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-text-muted font-mono">
                उपलब्ध: {availPlanets.length} कार्ड
              </span>
            </div>

            <p className="text-xs text-text-muted mb-6">
              पवित्र ॐ प्रतीक पर क्लिक करके अपना ग्रह चुनें:
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availPlanets.map((planet) => (
                <button
                  key={planet.id}
                  type="button"
                  onClick={() => {
                    const row = step.startsWith("past") ? "past" : step.startsWith("present") ? "present" : "future";
                    handlePickPlanet(row, planet);
                  }}
                  className="h-28 rounded-xl border border-border-light bg-gradient-to-b from-slate-900 to-indigo-950 text-white flex flex-col items-center justify-center p-2 hover:-translate-y-1 hover:shadow-lg transition-all group"
                >
                  <span className="text-2xl mb-1 group-hover:scale-125 transition-transform text-amber-400">
                    ॐ
                  </span>
                  <span className="text-[11px] font-mono opacity-60">PLANET</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step.includes("houses") && (
          <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8 animate-fadeIn">
            {(() => {
              const row = step.startsWith("past") ? "past" : step.startsWith("present") ? "present" : "future";
              const currentPlanet = row === "past" ? pastPlanet : row === "present" ? presentPlanet : futurePlanet;
              const currentHouses = row === "past" ? pastHouses : row === "present" ? presentHouses : futureHouses;
              const rule = getHouseRule(currentPlanet);

              return (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold mb-1">
                        🪐 चुना गया ग्रह: {currentPlanet?.hi} ({currentPlanet?.en})
                      </div>
                      <h3 className="font-display text-lg font-bold text-text-head">
                        हाउस कार्ड्स चुनें (भाव कार्ड)
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-saffron">
                        चुने गए: {currentHouses.length}{" "}
                        {rule.isDuplicateRule ? "(डुप्लीकेट भाव मिलने तक)" : `/ ${rule.count}`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted mb-6">
                    नीचे दिए गए डेक में से अपने हाउस कार्ड्स पर क्लिक करें:
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-[360px] overflow-y-auto p-1">
                    {availHouses.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handlePickHouse(row, item)}
                        className="h-24 rounded-xl border border-border-light bg-gradient-to-b from-slate-800 to-slate-950 text-white flex flex-col items-center justify-center p-1.5 hover:-translate-y-1 hover:border-saffron transition-all"
                      >
                        <span className="text-xl mb-0.5 text-sky-400">🕉️</span>
                        <span className="text-[10px] font-mono opacity-60">HOUSE</span>
                      </button>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Step: Final Rashi (Timing Lock) */}
        {step === "rashi" && (
          <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
              <div>
                <span className="text-xs uppercase font-mono text-saffron font-bold">अंतिम चरण: टाइमिंग लॉक</span>
                <h3 className="font-display text-lg font-bold text-text-head mt-0.5">
                  अपनी राशि चुनें (Select Rashi Card)
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-text-muted font-mono">
                12 राशियां
              </span>
            </div>

            <p className="text-xs text-text-muted mb-6">
              कार्ड्स में से एक राशि कार्ड चुनकर समय चक्र को लॉक करें:
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availRashis.map((r) => (
                <button
                  key={r.en}
                  type="button"
                  onClick={() => handlePickRashi(r)}
                  className="h-28 rounded-xl border border-border-light bg-gradient-to-b from-amber-950 to-orange-950 text-white flex flex-col items-center justify-center p-2 hover:-translate-y-1 hover:shadow-lg transition-all group"
                >
                  <span className="text-2xl mb-1 text-amber-300 group-hover:scale-125 transition-transform">
                    {r.symbol}
                  </span>
                  <span className="text-xs font-bold text-amber-200">{r.hi}</span>
                  <span className="text-[10px] font-mono opacity-60">{r.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calculating screen */}
        {step === "calculating" && (
          <div className="bg-white rounded-2xl border border-border-light shadow-warm p-12 text-center animate-fadeIn max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full border-4 border-saffron border-t-transparent animate-spin mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-text-head">
              ✨ ट्रांसपेरेंट कैलकुलेशन जारी है...
            </h3>
            <p className="text-xs text-text-muted mt-2">
              कीवर्ड, वैदिक हाउस डिक्शनरी और पूर्ण कॉम्बिनेशन मिलान प्रोसेस हो रहा है...
            </p>
          </div>
        )}

        {/* Step: Result / Prediction */}
        {step === "result" && outcome && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header info */}
            <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-border-light gap-3">
                <div>
                  <span className="text-xs uppercase font-mono text-saffron font-bold">सटीक फलादेश रिपोर्ट</span>
                  <h2 className="font-display text-2xl font-bold text-text-head mt-0.5">
                    वैदिक कार्ड रीडिंग निष्कर्ष
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg border border-border-light text-xs font-semibold text-text-body hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Printer size={13} /> प्रिंट / PDF
                  </button>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="px-3.5 py-1.5 rounded-lg bg-saffron text-white text-xs font-semibold hover:bg-saffron-hover flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} /> नई रीडिंग
                  </button>
                </div>
              </div>

              {/* Selected Cards Display */}
              <div className="mt-6 space-y-4">
                {/* Past Row */}
                <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-mono font-bold text-text-muted w-20">Past Row:</span>
                  {pastPlanet && (
                    <div className="px-3 py-1.5 rounded-lg bg-red-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span>{pastPlanet.symbol}</span>
                      <span>{pastPlanet.hi}</span>
                      <span className="text-[10px] opacity-75">({pastPlanet.durationText})</span>
                    </div>
                  )}
                  {pastHouses.map((h) => (
                    <div
                      key={h.id}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-900 text-sky-100 text-xs font-bold flex items-center gap-1"
                    >
                      <span>{h.elementIcon}</span>
                      <span>भाव {h.houseNo}</span>
                    </div>
                  ))}
                </div>

                {/* Present Row */}
                <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-mono font-bold text-text-muted w-20">Present Row:</span>
                  {presentPlanet && (
                    <div className="px-3 py-1.5 rounded-lg bg-red-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span>{presentPlanet.symbol}</span>
                      <span>{presentPlanet.hi}</span>
                    </div>
                  )}
                  {presentHouses.map((h) => (
                    <div
                      key={h.id}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-900 text-sky-100 text-xs font-bold flex items-center gap-1"
                    >
                      <span>{h.elementIcon}</span>
                      <span>भाव {h.houseNo}</span>
                    </div>
                  ))}
                </div>

                {/* Future Row */}
                <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-mono font-bold text-text-muted w-20">Future Row:</span>
                  {futurePlanet && (
                    <div className="px-3 py-1.5 rounded-lg bg-red-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span>{futurePlanet.symbol}</span>
                      <span>{futurePlanet.hi}</span>
                    </div>
                  )}
                  {futureHouses.map((h) => (
                    <div
                      key={h.id}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-900 text-sky-100 text-xs font-bold flex items-center gap-1"
                    >
                      <span>{h.elementIcon}</span>
                      <span>भाव {h.houseNo}</span>
                    </div>
                  ))}
                </div>

                {/* Rashi timing */}
                {finalRashi && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-xs font-mono font-bold text-amber-800 w-20">Rashi Lock:</span>
                    <div className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5">
                      <span>{finalRashi.symbol}</span>
                      <span>{finalRashi.hi} ({finalRashi.en})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Question summary */}
              <div className="mt-6 p-4 rounded-xl bg-slate-100 text-text-body text-xs md:text-sm">
                <strong>📌 चयनित विषय / Topic:</strong> {selectedCategory.title} ({selectedCategory.enTitle}) | <strong>❓ प्रश्न / Question:</strong> &ldquo;{question}&rdquo;
              </div>

              {/* Prediction result box */}
              <div
                className={`mt-6 p-5 rounded-xl border ${
                  outcome.statusType === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : outcome.statusType === "warning"
                    ? "bg-rose-50 border-rose-200 text-rose-950"
                    : "bg-amber-50 border-amber-200 text-amber-950"
                }`}
              >
                <div className="flex items-start gap-3">
                  {outcome.statusType === "success" ? (
                    <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                  ) : outcome.statusType === "warning" ? (
                    <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
                  ) : (
                    <Info className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  )}
                  <div>
                    <h4 className="font-bold text-base mb-1">
                      {outcome.statusType === "success"
                        ? "सकारात्मक एवं सिद्ध योग (Auspicious Alignment)"
                        : outcome.statusType === "warning"
                        ? "बाधा एवं धैर्य का संकेत (Obstacle & Caution)"
                        : "सामान्य एवं यथावत स्थिति (Moderate / Neutral)"}
                    </h4>
                    <p className="text-sm leading-relaxed mb-2">{outcome.verdict}</p>
                    <p className="text-xs leading-relaxed text-text-muted font-sans border-t border-black/10 pt-2 italic">
                      {outcome.englishVerdict}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strict Purna Match Calculation Breakdown */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-text-body">
                <strong className="text-text-head block mb-2 font-mono">
                  🔢 ट्रांसपेरेंट कैलकुलेशन इंजन (Strict Purna Match Rule):
                </strong>
                <ul className="space-y-1 ml-4 list-disc text-text-muted">
                  <li>
                    <strong>चयनित विषय:</strong> {selectedCategory.title}
                  </li>
                  <li>
                    <strong>अपेक्षित पूर्ण कॉम्बिनेशन:</strong> भाव [{outcome.req.join(", ")}]
                  </li>
                  <li>
                    <strong>निकाले गए Future कार्ड्स के भाव:</strong> भाव [{outcome.fHouses.join(", ")}]
                  </li>
                  <li>
                    <strong>मैच स्थिति:</strong>{" "}
                    {outcome.isPurnaMatch
                      ? "पूर्ण मिलान (Purna Match) — सभी आवश्यक भाव उपस्थित हैं"
                      : outcome.isNegativeMatch
                      ? "नकारात्मक भाव मिलान (Negative Indicator House Present)"
                      : "आंशिक / सामान्य स्थिति (Partial alignment)"}
                  </li>
                </ul>
              </div>
            </div>

            {/* Consulting CTA */}
            <div className="bg-gradient-to-r from-saffron to-amber-600 rounded-2xl p-6 text-white text-center shadow-lg">
              <h3 className="font-display text-xl font-bold">
                गहन व्यक्तिगत प्रश्न का समाधान चाहिए?
              </h3>
              <p className="mt-2 text-white/90 text-sm max-w-xl mx-auto">
                सुधांशु सुमन जी से व्यक्तिगत नाड़ी ज्योतिष एवं वैदिक कार्ड रीडिंग सत्र बुक करें।
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link
                  to="/services"
                  className="px-6 py-2.5 rounded-full bg-white text-indigo-deep font-bold text-sm hover:bg-cream transition-all shadow-md"
                >
                  रीडिंग बुक करें (Book a Reading)
                </Link>
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-5 py-2.5 rounded-full bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-all"
                >
                  नया विषय चुनें
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
