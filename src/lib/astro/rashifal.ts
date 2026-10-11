// AstroSuman Rashifal / Horoscope Logic
// Ported from rashifal.html inline scripts
import { ZODIAC_SIGNS } from "./config";
import { buildPeriodTransitContext, type PeriodMode } from "./transit-context";

export type HoroscopeMode = "daily" | "weekly" | "monthly" | "yearly";

export interface HoroscopeResult {
  sign: (typeof ZODIAC_SIGNS)[number];
  mode: HoroscopeMode;
  periodText: string;
  lead: string;
  extra: string;
  career: string;
  money: string;
  relation: string;
  health: string;
  advice: string;
  transitSummaries: string[];
  overallTone: string;
}

const MODE_LABELS: Record<HoroscopeMode, string> = {
  daily: "दैनिक राशिफल",
  weekly: "साप्ताहिक राशिफल",
  monthly: "मासिक राशिफल",
  yearly: "वार्षिक राशिफल",
};

const MODE_LEAD: Record<HoroscopeMode, string> = {
  daily: "आज का मुख्य संकेत",
  weekly: "इस सप्ताह का मुख्य संकेत",
  monthly: "इस महीने का मुख्य संकेत",
  yearly: "इस वर्ष का मुख्य संकेत",
};

const MODE_ADVICE: Record<HoroscopeMode, string> = {
  daily: "आज छोटे और स्पष्ट कदम अधिक उपयोगी रहेंगे।",
  weekly: "सप्ताह की शुरुआत में प्राथमिकताएँ तय करके चलें और बीच सप्ताह में प्रगति की समीक्षा करें।",
  monthly: "महीने के लिए 2–3 मुख्य लक्ष्य तय करें और खर्च, काम तथा निजी समय का संतुलन रखें।",
  yearly: "वर्ष को चरणों में बाँटकर दीर्घकालीन लक्ष्य, वित्तीय अनुशासन और कौशल-विकास पर निरंतर काम करें।",
};

function getWeekRange(d = new Date()): string {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  const y = new Date(x);
  y.setDate(x.getDate() + 6);
  const f = (z: Date) => z.toLocaleDateString("hi-IN", { day: "numeric", month: "short" });
  return `${f(x)} – ${f(y)} ${y.getFullYear()}`;
}

function periodText(mode: HoroscopeMode): string {
  const d = new Date();
  if (mode === "daily") return d.toLocaleDateString("hi-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  if (mode === "weekly") return getWeekRange(d);
  if (mode === "monthly") return d.toLocaleDateString("hi-IN", { month: "long", year: "numeric" });
  return String(d.getFullYear());
}

function seededExtra(sign: (typeof ZODIAC_SIGNS)[number], mode: HoroscopeMode): string {
  const d = new Date();
  const key = mode === "daily" ? d.getDate() : mode === "weekly" ? Math.ceil(d.getDate() / 7) : mode === "monthly" ? d.getMonth() + 1 : d.getFullYear();
  const extras = [
    "लंबित कार्य को पूरा करने पर संतोष मिल सकता है।",
    "किसी महत्वपूर्ण बातचीत से दिशा अधिक स्पष्ट हो सकती है।",
    "पुरानी योजना की समीक्षा करके सुधार करना उपयोगी रहेगा।",
    "नई जिम्मेदारी लेने से पहले उपलब्ध समय का आकलन करें।",
    "धैर्य के साथ लिया गया निर्णय जल्दबाज़ी से बेहतर रहेगा।",
  ];
  return extras[(sign.en.length + key) % extras.length];
}

export function generateHoroscope(signIndex: number, mode: HoroscopeMode): HoroscopeResult {
  const sign = ZODIAC_SIGNS[signIndex];
  const transit = buildPeriodTransitContext(mode as PeriodMode, signIndex);

  return {
    sign,
    mode,
    periodText: periodText(mode),
    lead: `${MODE_LEAD[mode]}: ${sign.focus}`,
    extra: seededExtra(sign, mode),
    career: sign.career,
    money: sign.money,
    relation: sign.relation,
    health: sign.health,
    advice: MODE_ADVICE[mode],
    transitSummaries: transit.summaries,
    overallTone: transit.overallTone,
  };
}

export { MODE_LABELS };
