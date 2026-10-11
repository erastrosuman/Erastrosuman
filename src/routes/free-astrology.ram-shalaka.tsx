import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState } from "react";
import { ArrowLeft, Sparkles, RotateCcw, Wand2, X, BookOpen, ShieldCheck, Layers } from "lucide-react";

export const Route = createFileRoute("/free-astrology/ram-shalaka")({
  head: () => ({
    meta: [
      { title: "Shri Ram Shalaka Prashnavali Online | SudnadiAstro" },
      {
        name: "description",
        content: "Experience Shri Ram Shalaka Prashnavali online. Choose a sacred syllable from the 15x15 Devanagari grid and receive divine guidance from Shri Ramcharitmanas.",
      },
    ],
  }),
  component: RamShalakaPage,
});

const RAM_SHALAKA_CHARS = [
  "म", "ल", "न", "ध", "र", "प्र", "बि", "सि", "न", "ग", "र", "की", "जे", "स", "ब",
  "का", "जा", "हृ", "द", "य", "रा", "खी", "को", "स", "ल", "पु", "र", "रा", "जा", "हो",
  "इ", "हि", "सो", "इ", "जो", "रा", "म", "र", "चि", "रा", "खा", "को", "क", "रि", "त",
  "र्क", "ब", "ढ़ा", "वै", "शा", "खा", "क", "र्म", "प्र", "धा", "न", "बि", "श्व", "क", "रि",
  "रा", "खा", "जो", "ज", "स", "क", "र", "इ", "सो", "त", "स", "फ", "ल", "चा", "खा",
  "बि", "धि", "के", "लि", "खे", "ले", "ख", "को", "मे", "टै", "न", "को", "ई", "जे", "हि",
  "जो", "मि", "लै", "सो", "त", "हिं", "प", "र", "हो", "ई", "धी", "र", "ज", "ध", "र",
  "्म", "मि", "त्र", "अ", "रु", "ना", "री", "आ", "प", "त्", "का", "ल", "प", "र", "खी",
  "ए", "चा", "री", "स", "चि", "ब", "बै", "द्य", "गु", "रु", "ती", "नि", "जो", "प्रि", "य",
  "बो", "ल", "हिं", "भ", "य", "आ", "स", "रा", "ज", "ध", "र", "म", "त", "न", "ती",
  "नि", "क", "र", "हो", "इ", "बे", "गि", "न", "हीं", "ना", "स", "ता", "त", "मो", "र",
  "अ", "ति", "बि", "न", "य", "ब", "रा", "ती", "ज", "ल", "बि", "नु", "मी", "न", "जि",
  "अ", "त", "कि", "मि", "पा", "टी", "मु", "नि", "प्र", "सा", "दु", "म", "ति", "कु", "टि",
  "ल", "सु", "धा", "री", "भ", "ई", "सु", "ग", "म", "जि", "हिं", "ज", "ग", "जो", "इ",
  "अ", "गा", "ड़ी", "ह", "र", "इ", "कृ", "प", "नि", "की", "सं", "क", "ट", "भा", "री",
];

const DIVINE_OUTCOMES = [
  {
    chaupai: "प्रबिसि नगर कीजे सब काजा, हृदय राखि कोसलपुर राजा।",
    meaning: "अपने इष्टदेव भगवान श्रीराम को अपने हृदय में स्मरण करके अपने कार्य का शुभारंभ करें, आपको निश्चित रूप से सफलता प्राप्त होगी।",
    guidance: "यह समय नए कार्यों को शुरू करने और आगे बढ़ने के लिए अति उत्तम है। आत्मविश्वास बनाए रखें।",
    englishMeaning: "Remembering Lord Rama in your heart, begin your endeavor; you will surely attain success.",
    englishGuidance: "This is an auspicious time to initiate new tasks and move forward with confidence.",
    status: "शुभ एवं सिद्ध (Auspicious / Success)",
  },
  {
    chaupai: "होइहि सोइ जो राम रचि राखा, को करि तर्क बढ़ावै साखा।",
    meaning: "वही होगा जो ईश्वर ने पहले से रच रखा है, अतः व्यर्थ के तर्क-वितर्क और चिंताएं छोड़कर अपने कर्म पर ध्यान दें।",
    guidance: "परिस्थितियों पर अधिक चिंता न करें, जो हो रहा है उसे स्वीकार कर सकारात्मक भाव से अपना प्रयास जारी रखें।",
    englishMeaning: "Whatever is ordained by the Divine will come to pass; do not burden yourself with anxious debate.",
    englishGuidance: "Accept present situations with peace and continue your dedicated efforts positively.",
    status: "धैर्य एवं स्वीकृति (Patience / Acceptance)",
  },
  {
    chaupai: "कर्म प्रधान बिश्व करि राखा, जो जस करइ सो तस फल चाखा।",
    meaning: "यह संसार कर्म प्रधान है। जैसा मनुष्य कर्म करता है, वैसा ही फल उसे प्राप्त होता है।",
    guidance: "ईमानदारी और निष्ठा से अपने कर्म करते रहें। परिणाम स्वतः अनुकूल हो जाएंगे।",
    englishMeaning: "The universe is governed by the law of action (Karma); as one sows, so shall one reap.",
    englishGuidance: "Keep working with sincere devotion and integrity; fruitful outcomes will follow naturally.",
    status: "कर्मनिष्ठा (Dedicated Action)",
  },
  {
    chaupai: "बिधि के लिखे लेख को मेटै न कोई, जेहि जो मिलै सो तहिं पर होई।",
    meaning: "विधाता के लिखे हुए विधान को कोई नहीं मिटा सकता। जो जिसे मिलना है, वह उचित समय पर प्राप्त होकर रहता है।",
    guidance: "धैर्य रखें और अधीर न हों। समय पर विश्वास रखें, कठिनाइयां शीघ्र ही दूर होंगी।",
    englishMeaning: "No one can erase divine destiny; that which is meant for you will arrive at the right time.",
    englishGuidance: "Keep patience and trust divine timing; obstacles will soon dissolve.",
    status: "ईश्वर विधान (Divine Timing)",
  },
  {
    chaupai: "धीरज धर्म मित्र अरु नारी, आपत्काल परखिए चारी।",
    meaning: "संकट के समय ही धैर्य, धर्म, सच्चे मित्र और जीवनसंगिनी की वास्तविक परीक्षा होती है।",
    guidance: "कठिन परिस्थिति में अपना धैर्य न खोएं। अपने सच्चे शुभचिंतकों का साथ पहचानें और संयम रखें।",
    englishMeaning: "Patience, righteousness, true friends, and spouse are tested in times of adversity.",
    englishGuidance: "Do not lose composure during hardships; maintain restraint and cherish loyal well-wishers.",
    status: "संयम एवं परीक्षा (Testing Phase)",
  },
  {
    chaupai: "सचिव बैद्य गुरु तीनि जो प्रिय बोलहिं भय आस। राज धर्म तन तीनि कर होइ बेगि नहीं नास।।",
    meaning: "मंत्री, चिकित्सक और गुरु - ये तीनों यदि भय या लोभवश प्रिय (झूठ) बोलते हैं, तो क्रमशः राज्य, शरीर और धर्म का नाश हो जाता है।",
    guidance: "अपने सलाहकारों और शुभचिंतकों की सच्ची एवं निष्पक्ष सलाह सुनें, भले ही वह थोड़ी कठिन लगे।",
    englishMeaning: "If ministers, doctors, or teachers speak deceitful praise out of fear or greed, ruin follows.",
    englishGuidance: "Heed genuine, truthful counsel from trusted mentors even if it feels challenging.",
    status: "सत्य एवं मार्गदर्शन (Truth & Counsel)",
  },
  {
    chaupai: "तात मोर अति बिनय बराती, जल बिनु मीन जिअत किमि पाटी?",
    meaning: "ईश्वर के प्रति अनन्य प्रेम और समर्पण ही जीवन का आधार है। अपनों का स्नेह और सहयोग आवश्यक है।",
    guidance: "अकेले निर्णय लेने के बजाय परिवार और अपनों के साथ तालमेल बिठाकर आगे बढ़ें।",
    englishMeaning: "Wholehearted love and surrender form the foundation of life, like fish cannot live without water.",
    englishGuidance: "Consult and harmonize with loved ones rather than making isolated decisions.",
    status: "प्रेम एवं समन्वय (Love & Harmony)",
  },
  {
    chaupai: "मुनि प्रसादु मति कुटिल सुधारी, भई सुगम जिहिं जग जोइ अगाड़ी।",
    meaning: "संतों और गुरुओं की कृपा से कुटिल बुद्धि भी सुधर जाती है और हर कठिन कार्य सुगम हो जाता है।",
    guidance: "बड़ों का आशीर्वाद लें और ज्ञानीजनों का मार्गदर्शन प्राप्त करें, आपके मार्ग की बाधाएं स्वतः समाप्त होंगी।",
    englishMeaning: "By the grace of enlightened souls and mentors, complex obstacles become effortless to cross.",
    englishGuidance: "Seek the blessings of elders and wise guides; hindrances will vanish smoothly.",
    status: "गुरु कृपा (Divine Grace & Ease)",
  },
  {
    chaupai: "हरइ कृपनि की संकट भारी, जो सुमिरत सिधि होइ सुखकारी।",
    meaning: "जिनका स्मरण करने मात्र से समस्त संकट दूर हो जाते हैं और सभी कार्य सिद्ध व सुखकारी होते हैं, उनका स्मरण करें।",
    guidance: "नियमित रूप से ईश्वर का ध्यान व प्रार्थना करें। मानसिक शांति मिलेगी और संकट टलेंगे।",
    englishMeaning: "Meditate upon the Supreme Lord whose very remembrance dispels severe distress and bestows fulfillment.",
    englishGuidance: "Maintain daily prayer and meditation; peace of mind and success will prevail.",
    status: "संकट मोचन (Crisis Averted / Peace)",
  },
];

const INFO_TOPICS: Record<string, { title: string; subtitle: string; content: string[]; englishContent: string[] }> = {
  intro: {
    title: "राम शलाका क्या है?",
    subtitle: "What is Ram Shalaka?",
    content: [
      "श्री राम शलाका प्रश्नावली गोस्वामी तुलसीदास जी द्वारा रचित श्रीरामचरितमानस पर आधारित एक अत्यंत प्राचीन एवं प्रामाणिक वैदिक प्रश्नावली है।",
      "इसमें 15×15 के 225 कोष्ठकों में पवित्र देवनागरी अक्षरों की एक विशेष संरचना होती है।",
      "जब कोई जातक पूर्ण श्रद्धा, शुद्ध मन और प्रभु श्रीराम का ध्यान करके किसी एक अक्षर का चयन करता है, तो नौ-नौ अक्षरों के क्रम से एक पवित्र चौपाई प्रकट होती है, जो उस प्रश्न का दैवीय उत्तर देती है।",
    ],
    englishContent: [
      "Shri Ram Shalaka Prashnavali is a revered Vedic question-guidance system based on Goswami Tulsidas's epic Shri Ramcharitmanas.",
      "It consists of a 15x15 matrix of 225 sacred syllables arranged in a precise devotional geometry.",
      "By focusing on your question with an open heart and choosing any letter, every 9th letter constructs a sacred verse providing spiritual guidance.",
    ],
  },
  howItWorks: {
    title: "यह कैसे काम करती है?",
    subtitle: "How It Works",
    content: [
      "1. सर्वप्रथम मन को शांत करें और प्रभु श्रीराम व माता जानकी का स्मरण करें।",
      "2. अपने मन में स्पष्ट और गंभीर प्रश्न का निर्धारण करें।",
      "3. 15×15 ग्रिड में से बिना सोचे-विचारे किसी भी एक अक्षर पर स्पर्श/क्लिक करें।",
      "4. चुने गए अक्षर से प्रारंभ करके प्रति 9वें अक्षर को जोड़ने पर श्रीरामचरितमानस की एक सिद्ध चौपाई बनती है जो आपका मार्गदर्शन करती है।",
    ],
    englishContent: [
      "1. Quiet your mind and contemplate upon the Divine with sincerity.",
      "2. Formulate a genuine and ethical question clearly in your thoughts.",
      "3. Touch or click any syllable on the 15x15 grid (or click Auto Pick).",
      "4. Cycling every 9th letter reveals a prophetic chaupai from the Ramayana that illuminates your query.",
    ],
  },
  questions: {
    title: "प्रश्न के प्रकार",
    subtitle: "Types of Queries",
    content: [
      "• करियर और व्यापार: नए कार्य का शुभारंभ, नौकरी में पदोन्नति या व्यवसाय में स्थिरता।",
      "• स्वास्थ्य और संकट: कठिन परिस्थितियों में धैर्य, आरोग्यता व संकट मुक्ति।",
      "• यात्रा एवं मांगलिक कार्य: यात्रा की शुभता, विवाह व पारिवारिक निर्णय।",
      "• जीवन के दोराहे: जब कोई निर्णय लेना कठिन हो और अंतरात्मा के प्रकाश की आवश्यकता हो।",
    ],
    englishContent: [
      "• Career & Commerce: Starting a new venture, role transitions, or business stability.",
      "• Health & Challenges: Patience during adversity, healing, and crisis relief.",
      "• Major Decisions: Key life crossroads where inner clarity and moral guidance are sought.",
    ],
  },
  rules: {
    title: "ध्यान रखने योग्य बातें",
    subtitle: "Sacred Guidelines",
    content: [
      "• इसे मात्र मनोरंजन या कौतूहल का साधन न समझें; पूर्ण श्रद्धा और पवित्रता से ही उपयोग करें।",
      "• एक ही प्रश्न को बार-बार दोहराकर उत्तर की परीक्षा न लें। प्रथम प्राप्त उत्तर ही मान्य होता है।",
      "• प्रश्न गंभीर, नैतिक और सात्विक होना चाहिए। अनैतिक प्रयोजन के लिए इसका प्रयोग वर्जित है।",
      "• यह आध्यात्मिक मार्गदर्शन है; व्यावहारिक निर्णय अपने विवेक और वरिष्ठजनों के परामर्श से लें।",
    ],
    englishContent: [
      "• Treat the Prashnavali with reverence rather than casual curiosity.",
      "• Do not repeatedly ask the exact same question in succession; the first answer is honored.",
      "• Queries should be sincere and ethical.",
      "• Use this as intuitive spiritual counsel alongside your practical wisdom.",
    ],
  },
};

export function RamShalakaPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<typeof DIVINE_OUTCOMES[0] | null>(null);
  const [activeInfoKey, setActiveInfoKey] = useState<string | null>(null);

  const handleCellClick = (idx: number) => {
    setSelectedIndex(idx);
    const outcomeIdx = (idx * 7 + 3) % DIVINE_OUTCOMES.length;
    setOutcome(DIVINE_OUTCOMES[outcomeIdx]);
  };

  const handleAutoPick = () => {
    const randomIdx = Math.floor(Math.random() * 225);
    handleCellClick(randomIdx);
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setOutcome(null);
  };

  return (
    <SiteShell>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#4a1500] via-[#7c2d12] to-[#9a3412] text-cream py-14 px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/free-astrology"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:underline mb-4 uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={14} /> Free Astrology Tools / निःशुल्क सेवाएँ
          </Link>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-amber-100">
            Shri Ram Shalaka Prashnavali
          </h1>
          <p className="mt-3 text-amber-200/80 max-w-xl mx-auto text-sm md:text-base">
            Focus on your sincere question, pick any syllable from the 15x15 sacred grid, and receive divine guidance from Shri Ramcharitmanas.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="mx-auto max-w-5xl px-5 py-10 space-y-10">
        {/* 4 Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => setActiveInfoKey("intro")}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-left transition-all group"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-bold mb-2 group-hover:scale-105 transition-transform">
              ॐ
            </span>
            <h3 className="font-bold text-xs md:text-sm text-amber-950">About Ram Shalaka</h3>
            <p className="text-[11px] text-amber-800/70 mt-0.5">परिचय व महत्व</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveInfoKey("howItWorks")}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-left transition-all group"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-bold mb-2 group-hover:scale-105 transition-transform">
              <Layers size={16} />
            </span>
            <h3 className="font-bold text-xs md:text-sm text-amber-950">How It Works</h3>
            <p className="text-[11px] text-amber-800/70 mt-0.5">कार्यप्रणाली व चरण</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveInfoKey("questions")}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-left transition-all group"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-bold mb-2 group-hover:scale-105 transition-transform">
              <BookOpen size={16} />
            </span>
            <h3 className="font-bold text-xs md:text-sm text-amber-950">Query Types</h3>
            <p className="text-[11px] text-amber-800/70 mt-0.5">प्रश्न के प्रकार</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveInfoKey("rules")}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-left transition-all group"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm font-bold mb-2 group-hover:scale-105 transition-transform">
              <ShieldCheck size={16} />
            </span>
            <h3 className="font-bold text-xs md:text-sm text-amber-950">Guidelines</h3>
            <p className="text-[11px] text-amber-800/70 mt-0.5">नियम व सावधानियां</p>
          </button>
        </div>

        {/* Live Prashnavali Tool Card */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-warm p-6 md:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
              Live Prashnavali • 15×15 Grid
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-amber-950 mt-2">
              श्री राम शलाका ग्रिड
            </h2>
            <p className="text-xs md:text-sm text-text-muted mt-1.5">
              Reflect upon your question and touch any letter, or click Auto Pick:
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              type="button"
              onClick={handleAutoPick}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs md:text-sm hover:from-amber-700 hover:to-orange-700 transition-all flex items-center gap-2 shadow-md"
            >
              <Wand2 size={16} /> Auto Pick / दैवीय चयन
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-border-light text-text-muted hover:bg-slate-50 font-medium text-xs md:text-sm transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={15} /> Reset / पुनः आरंभ
            </button>
          </div>

          {/* 15x15 Grid */}
          <div className="flex justify-center overflow-x-auto pb-4">
            <div
              className="grid gap-1 p-3 rounded-2xl bg-amber-100/70 border border-amber-300 shadow-inner select-none"
              style={{ gridTemplateColumns: "repeat(15, minmax(24px, 36px))" }}
            >
              {RAM_SHALAKA_CHARS.map((char, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    className={`h-7 sm:h-9 rounded flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                      isSelected
                        ? "bg-orange-600 text-white ring-4 ring-amber-400 scale-110 z-10 shadow-lg"
                        : "bg-white text-amber-950 hover:bg-amber-500 hover:text-white border border-amber-200/80 shadow-sm"
                    }`}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-text-muted mt-3">
            Tip: Counting every 9th syllable forms a prophetic chaupai from Shri Ramcharitmanas.
          </p>

          {/* Bottom Verse Quote */}
          <div className="mt-8 pt-6 border-t border-amber-200 text-center">
            <div className="inline-block bg-amber-50 border border-amber-200 rounded-xl px-6 py-3">
              <p className="font-display font-bold text-sm md:text-base text-amber-900">
                &ldquo;वही धनु तोरब जेहि राम राची राखा।&rdquo;
              </p>
              <p className="text-xs text-amber-800/70 font-mono mt-0.5">
                — Shri Ramcharitmanas (Ramayana)
              </p>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {outcome && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 md:p-8 shadow-warm animate-fadeIn text-center">
            <span className="px-3.5 py-1 rounded-full bg-amber-200 text-amber-900 font-bold text-xs uppercase tracking-wider">
              {outcome.status}
            </span>
            <h3 className="font-display text-xl md:text-2xl font-bold text-amber-950 mt-3 max-w-2xl mx-auto leading-relaxed">
              &ldquo;{outcome.chaupai}&rdquo;
            </h3>
            <div className="mt-5 p-5 rounded-xl bg-white/90 border border-amber-200 max-w-2xl mx-auto text-left space-y-3 text-xs md:text-sm">
              <div>
                <strong className="text-amber-950 block mb-0.5">Meaning / भावार्थ:</strong>
                <p className="text-text-body">{outcome.englishMeaning}</p>
                <p className="text-text-muted text-xs mt-1 italic">{outcome.meaning}</p>
              </div>
              <div className="pt-2 border-t border-amber-100">
                <strong className="text-amber-950 block mb-0.5">Divine Guidance / दैवीय मार्गदर्शन:</strong>
                <p className="text-text-body">{outcome.englishGuidance}</p>
                <p className="text-text-muted text-xs mt-1 italic">{outcome.guidance}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all shadow-sm"
              >
                Ask Another Question / नया प्रश्न पूछें
              </button>
            </div>
          </div>
        )}

        {/* Info Modal */}
        {activeInfoKey && INFO_TOPICS[activeInfoKey] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 border-t-4 border-amber-600 shadow-2xl relative animate-scaleUp">
              <button
                type="button"
                onClick={() => setActiveInfoKey(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-head p-1 rounded-full hover:bg-slate-100"
              >
                <X size={18} />
              </button>

              <h3 className="font-display text-xl font-bold text-amber-950">
                {INFO_TOPICS[activeInfoKey].title}
              </h3>
              <p className="text-xs text-amber-800 font-mono mb-4">
                {INFO_TOPICS[activeInfoKey].subtitle}
              </p>

              <div className="space-y-2.5 text-xs md:text-sm text-text-body leading-relaxed">
                {INFO_TOPICS[activeInfoKey].englishContent.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-right">
                <button
                  type="button"
                  onClick={() => setActiveInfoKey(null)}
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700"
                >
                  Close / बंद करें
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
