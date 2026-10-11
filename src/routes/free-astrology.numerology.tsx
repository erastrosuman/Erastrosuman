import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState } from "react";
import { ArrowLeft, Sparkles, RotateCcw, Calendar, User, Phone, CheckCircle2 } from "lucide-react";
import { REFERENCE_DB, COMBINATIONS_DB, PLANET_MAP } from "@/data/numerology-data";

export const Route = createFileRoute("/free-astrology/numerology")({
  head: () => ({
    meta: [
      { title: "Free Vedic Numerology Calculator & Report | SudnadiAstro" },
      {
        name: "description",
        content: "Calculate your Mulank (Driver Number), Bhagyank (Destiny Number), Vedic 3x3 Chart Grid and 81 combination analysis instantly.",
      },
    ],
  }),
  component: NumerologyPage,
});

export function NumerologyPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [report, setReport] = useState<any>(null);

  const calculateReport = (selectedLang: "hi" | "en") => {
    if (!name.trim() || !dob) {
      alert(selectedLang === "hi" ? "कृपया अपना नाम और जन्मतिथि भरें!" : "Please enter Name and Date of Birth!");
      return;
    }

    setLang(selectedLang);
    const parts = dob.split("-"); // YYYY-MM-DD
    const yearFull = parts[0];
    const month = parts[1];
    const day = parts[2];

    // Mulank (Driver): sum of day digits reduced to 1-9
    let dayNum = parseInt(day, 10);
    let mulank = dayNum;
    while (mulank > 9) {
      mulank = Math.floor(mulank / 10) + (mulank % 10);
    }

    // Bhagyank (Destiny): sum of all digits of DOB reduced to 1-9
    let sumAll = 0;
    for (const char of dob) {
      if (!isNaN(parseInt(char, 10))) {
        sumAll += parseInt(char, 10);
      }
    }
    let bhagyank = sumAll;
    while (bhagyank > 9) {
      let temp = 0;
      for (const char of bhagyank.toString()) {
        temp += parseInt(char, 10);
      }
      bhagyank = temp;
    }

    // Grid Numbers: Last 2 digits of year + month + day + mulank + bhagyank
    const yearLastTwo = yearFull.length === 4 ? yearFull.substring(2, 4) : yearFull;
    const rawDigits: number[] = [];
    (yearLastTwo + month + day).split("").forEach((ch) => {
      const d = parseInt(ch, 10);
      if (!isNaN(d) && d >= 1 && d <= 9) rawDigits.push(d);
    });
    if (mulank >= 1 && mulank <= 9) rawDigits.push(mulank);
    if (bhagyank >= 1 && bhagyank <= 9) rawDigits.push(bhagyank);

    const gridCounts: Record<number, number[]> = {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [],
    };
    rawDigits.forEach((d) => {
      if (gridCounts[d]) gridCounts[d].push(d);
    });

    const comboKey = `${mulank}-${bhagyank}`;
    const comboData = COMBINATIONS_DB[comboKey] || {
      hi: "यह एक विशिष्ट मूलांक और भाग्यांक संयोजन है।",
      en: "This is a unique driver and destiny combination.",
    };

    setReport({
      name,
      dob: `${day}-${month}-${yearFull}`,
      mobile: mobile.trim() || (selectedLang === "hi" ? "उपलब्ध नहीं" : "Not Provided"),
      mulank,
      bhagyank,
      mulankData: REFERENCE_DB[mulank],
      bhagyankData: REFERENCE_DB[bhagyank],
      comboKey,
      comboData,
      gridCounts,
    });

    setTimeout(() => {
      const reportEl = document.getElementById("report-results");
      if (reportEl) reportEl.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setName("");
    setDob("");
    setMobile("");
    setReport(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            {lang === "hi" ? "वैदिक न्यूमरोलॉजी रिपोर्ट" : "Vedic Numerology Calculator"}
          </h1>
          <p className="mt-3 text-cream/75 max-w-xl mx-auto text-sm md:text-base">
            {lang === "hi"
              ? "मूलांक, भाग्यांक, 81 कॉम्बिनेशन विश्लेषण एवं 3×3 वैदिक जन्म ग्रिड"
              : "Discover your Driver (Mulank), Destiny (Bhagyank), 81 Combinations and 3×3 Vedic Chart Grid."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-5 py-10">
        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border-light mb-6">
            <Sparkles className="text-saffron" size={22} />
            <h2 className="font-display text-xl font-semibold text-text-head">
              {lang === "hi" ? "जातक विवरण (Enter Birth Details)" : "Enter Your Details"}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-text-body mb-1.5">
                {lang === "hi" ? "पूरा नाम *" : "Full Name *"}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-text-muted" size={17} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "hi" ? "अपना नाम लिखें" : "Enter your name"}
                  className="w-full rounded-xl border border-border-light pl-10 pr-3.5 py-2.5 text-sm focus:border-saffron focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-body mb-1.5">
                {lang === "hi" ? "जन्मतिथि (Date of Birth) *" : "Date of Birth *"}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 text-text-muted" size={17} />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-border-light pl-10 pr-3.5 py-2.5 text-sm focus:border-saffron focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-body mb-1.5">
                {lang === "hi" ? "मोबाइल नंबर (वैकल्पिक)" : "Mobile Number (Optional)"}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 text-text-muted" size={17} />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder={lang === "hi" ? "मोबाइल नंबर" : "Mobile number"}
                  className="w-full rounded-xl border border-border-light pl-10 pr-3.5 py-2.5 text-sm focus:border-saffron focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => calculateReport("hi")}
              className="px-6 py-2.5 rounded-xl bg-saffron text-white font-semibold text-sm hover:bg-saffron-hover transition-all shadow-md"
            >
              हिंदी रिपोर्ट देखें (Hindi Report)
            </button>
            <button
              type="button"
              onClick={() => calculateReport("en")}
              className="px-6 py-2.5 rounded-xl bg-indigo-deep text-white font-semibold text-sm hover:bg-opacity-90 transition-all shadow-md"
            >
              English Report
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-border-light text-text-muted font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={15} /> रीसेट (Reset)
            </button>
          </div>
        </div>

        {/* Generated Report Section */}
        {report && (
          <div id="report-results" className="mt-10 space-y-8 animate-fadeIn">
            {/* Profile Summary */}
            <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-text-head mb-5 border-b border-border-light pb-3">
                {lang === "hi" ? "जातक सारांश (Profile Summary)" : "Profile Summary"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-text-muted">{lang === "hi" ? "नाम" : "Name"}</p>
                  <p className="font-bold text-text-head mt-1 text-sm md:text-base">{report.name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-text-muted">{lang === "hi" ? "जन्मतिथि" : "DOB"}</p>
                  <p className="font-bold text-text-head mt-1 text-sm md:text-base">{report.dob}</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-700 font-semibold">{lang === "hi" ? "मूलांक (Driver)" : "Driver (Mulank)"}</p>
                  <p className="font-display font-bold text-amber-800 text-2xl mt-0.5">{report.mulank}</p>
                  <p className="text-[11px] text-amber-600 font-medium">{report.mulankData.name[lang]}</p>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="text-xs text-indigo-700 font-semibold">{lang === "hi" ? "भाग्यांक (Destiny)" : "Destiny (Bhagyank)"}</p>
                  <p className="font-display font-bold text-indigo-800 text-2xl mt-0.5">{report.bhagyank}</p>
                  <p className="text-[11px] text-indigo-600 font-medium">{report.bhagyankData.name[lang]}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl col-span-2 md:col-span-1">
                  <p className="text-xs text-text-muted">{lang === "hi" ? "मोबाइल" : "Mobile"}</p>
                  <p className="font-medium text-text-head mt-1 text-sm">{report.mobile}</p>
                </div>
              </div>
            </div>

            {/* Driver & Destiny Traits */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mulank Card */}
              <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-6">
                <div className="flex items-center justify-between pb-3 border-b border-amber-200/70 mb-4">
                  <h4 className="font-display font-bold text-amber-900 text-base">
                    {lang === "hi" ? `मूलांक ${report.mulank} (${report.mulankData.name[lang]})` : `Driver Number ${report.mulank}`}
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                    स्वामी: {report.mulankData.name[lang]}
                  </span>
                </div>
                <div className="space-y-3 text-xs md:text-sm text-amber-950/85">
                  <p>
                    <strong className="text-amber-900">{lang === "hi" ? "मूल स्वभाव:" : "Core Traits:"}</strong>{" "}
                    {report.mulankData.single[lang]}
                  </p>
                  <p>
                    <strong className="text-amber-900">{lang === "hi" ? "स्वास्थ्य संकेत:" : "Health:"}</strong>{" "}
                    {report.mulankData.health[lang]}
                  </p>
                  <p>
                    <strong className="text-amber-900">{lang === "hi" ? "शुभ रंग:" : "Lucky Colors:"}</strong>{" "}
                    {report.mulankData.colors[lang]}
                  </p>
                  <p>
                    <strong className="text-amber-900">{lang === "hi" ? "मित्र / शत्रु अंक:" : "Friends / Enemy:"}</strong>{" "}
                    {lang === "hi" ? `मित्र: [${report.mulankData.friends}] | शत्रु: [${report.mulankData.enemy}]` : `Friends: [${report.mulankData.friends}] | Enemies: [${report.mulankData.enemy}]`}
                  </p>
                </div>
              </div>

              {/* Bhagyank Card */}
              <div className="bg-indigo-50/50 rounded-2xl border border-indigo-200 p-6">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-200/70 mb-4">
                  <h4 className="font-display font-bold text-indigo-900 text-base">
                    {lang === "hi" ? `भाग्यांक ${report.bhagyank} (${report.bhagyankData.name[lang]})` : `Destiny Number ${report.bhagyank}`}
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-200 text-indigo-900 font-bold">
                    स्वामी: {report.bhagyankData.name[lang]}
                  </span>
                </div>
                <div className="space-y-3 text-xs md:text-sm text-indigo-950/85">
                  <p>
                    <strong className="text-indigo-900">{lang === "hi" ? "जीवन पथ:" : "Life Path:"}</strong>{" "}
                    {report.bhagyankData.single[lang]}
                  </p>
                  <p>
                    <strong className="text-indigo-900">{lang === "hi" ? "स्वास्थ्य संकेत:" : "Health:"}</strong>{" "}
                    {report.bhagyankData.health[lang]}
                  </p>
                  <p>
                    <strong className="text-indigo-900">{lang === "hi" ? "शुभ रंग:" : "Lucky Colors:"}</strong>{" "}
                    {report.bhagyankData.colors[lang]}
                  </p>
                  <p>
                    <strong className="text-indigo-900">{lang === "hi" ? "मित्र / शत्रु अंक:" : "Friends / Enemy:"}</strong>{" "}
                    {lang === "hi" ? `मित्र: [${report.bhagyankData.friends}] | शत्रु: [${report.bhagyankData.enemy}]` : `Friends: [${report.bhagyankData.friends}] | Enemies: [${report.bhagyankData.enemy}]`}
                  </p>
                </div>
              </div>
            </div>

            {/* 81 Combination Analysis */}
            <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-text-head mb-3">
                {lang === "hi" ? `81 कॉम्बिनेशन विश्लेषण: मूलांक ${report.mulank} & भाग्यांक ${report.bhagyank} (${report.comboKey})` : `81 Combination Analysis (${report.comboKey})`}
              </h3>
              <p className="text-sm md:text-base text-text-body leading-relaxed bg-saffron-ghost p-4 rounded-xl border border-saffron/20">
                {report.comboData[lang]}
              </p>
            </div>

            {/* Vedic Grid 3x3 Chart */}
            <div className="bg-white rounded-2xl border border-border-light shadow-warm p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-text-head mb-2">
                {lang === "hi" ? "मूल जन्म वैदिक ग्रिड (Dynamic Vedic Birth Chart Grid)" : "Dynamic Vedic Birth Chart Grid"}
              </h3>
              <p className="text-xs md:text-sm text-text-muted mb-6">
                {lang === "hi"
                  ? "आपकी जन्मतिथि और भाग्यांक के आधार पर निर्मित 3×3 वैदिक जन्म ग्रिड:"
                  : "3x3 Vedic Chart mapped based on DOB, Driver and Destiny numbers:"}
              </p>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* 3x3 Table */}
                <div className="w-full max-w-[280px]">
                  <div className="grid grid-cols-3 gap-2 p-2 bg-slate-100 rounded-2xl border border-slate-300">
                    {[
                      [3, 1, 9],
                      [6, 7, 5],
                      [2, 8, 4],
                    ].flat().map((num) => {
                      const occurrences = report.gridCounts[num];
                      const hasNumber = occurrences && occurrences.length > 0;
                      const mapInfo = PLANET_MAP[num];
                      return (
                        <div
                          key={num}
                          className={`h-20 rounded-xl flex flex-col items-center justify-center font-bold text-center border transition-all ${
                            hasNumber
                              ? mapInfo.cellClass + " shadow-sm scale-100"
                              : "bg-white border-dashed border-slate-200 text-slate-300"
                          }`}
                        >
                          {hasNumber ? (
                            <>
                              <span className="text-lg md:text-xl font-display">{occurrences.join(", ")}</span>
                              <span className="text-[10px] opacity-75 font-normal mt-0.5">
                                {REFERENCE_DB[num].name[lang].split(" ")[0]}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-mono opacity-40">-</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Grid Legend & Number Breakdown */}
                <div className="flex-1 space-y-2.5">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-text-muted font-bold">
                    {lang === "hi" ? "चार्ट अंकों का गहन विश्लेषण" : "Deep Analysis of Present Numbers"}
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-text-body">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                      const count = report.gridCounts[i]?.length || 0;
                      if (count === 0) return null;
                      const ref = REFERENCE_DB[i];
                      return (
                        <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <CheckCircle2 size={16} className="text-saffron mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-text-head">
                              {ref.name[lang]} ({lang === "hi" ? `अंक ${i}` : `Number ${i}`}{count > 1 ? ` — ${count} ${lang === "hi" ? "बार" : "times"}` : ""}):
                            </span>{" "}
                            <span className="text-text-body">
                              {count === 1 ? ref.single[lang] : ref.double[lang]}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-saffron to-amber-600 rounded-2xl p-6 text-white text-center shadow-lg">
              <h3 className="font-display text-xl font-bold">
                {lang === "hi" ? "विस्तृत व्यक्तिगत परामर्श चाहिए?" : "Want a Full Comprehensive Reading?"}
              </h3>
              <p className="mt-2 text-white/90 text-sm max-w-xl mx-auto">
                {lang === "hi"
                  ? "सुधांशु सुमन जी से व्यक्तिगत नाड़ी एवं अंक ज्योतिष रिपोर्ट प्राप्त करें जिसमें आपके आगामी वर्षों का सटीक फलादेश व सिद्ध उपाय शामिल हैं।"
                  : "Get an authentic handcrafted Nadi Astrology & Numerology report by Sudhansu Suman with detailed remedies and DBA predictions."}
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Link
                  to="/services"
                  className="px-6 py-2.5 rounded-full bg-white text-indigo-deep font-bold text-sm hover:bg-cream transition-all shadow-md"
                >
                  {lang === "hi" ? "परामर्श सेवाएँ देखें" : "View Services"}
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-full bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-all"
                >
                  {lang === "hi" ? "नया विश्लेषण करें" : "New Calculation"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
