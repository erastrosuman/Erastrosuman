// AstroSuman Transit Context Engine - Ported from js/astro/transit-context.js
import {
  julianDayUTC, sunLongitude, moonLongitude, planetLongitude,
  siderealLongitude, lahiriAyanamsa, norm360,
} from "./astronomy";

const PLANETS = ["Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"] as const;

const LABELS: Record<string, string> = {
  Sun: "सूर्य", Mercury: "बुध", Venus: "शुक्र", Mars: "मंगल", Jupiter: "गुरु", Saturn: "शनि", Moon: "चंद्र",
};

function houseFrom(baseSign: number, transitSign: number): number {
  return ((transitSign - baseSign + 12) % 12) + 1;
}

function signOf(lon: number): number {
  return Math.floor(norm360(lon) / 30);
}

function siderealPlanet(name: string, date: Date): number {
  const jd = julianDayUTC(date);
  const aya = lahiriAyanamsa(jd);
  let tropical: number;
  if (name === "Sun") tropical = sunLongitude(jd);
  else if (name === "Moon") tropical = moonLongitude(jd);
  else tropical = planetLongitude(name as any, jd);
  return siderealLongitude(tropical, aya);
}

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setHours(12, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
}

function endOfWeek(d: Date): Date { const x = startOfWeek(d); x.setDate(x.getDate() + 6); return x; }
function startOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0); }
function endOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth() + 1, 0, 12, 0, 0); }
function startOfYear(d: Date): Date { return new Date(d.getFullYear(), 0, 1, 12, 0, 0); }
function endOfYear(d: Date): Date { return new Date(d.getFullYear(), 11, 31, 12, 0, 0); }

const HOUSE_MEANING: Record<number, string> = {
  1: "स्वयं, आत्मविश्वास और नई शुरुआत",
  2: "धन, परिवार और वाणी",
  3: "साहस, संचार और प्रयास",
  4: "घर, सुविधा और भावनात्मक स्थिरता",
  5: "रचनात्मकता, शिक्षा और प्रेम",
  6: "काम, प्रतिस्पर्धा और दिनचर्या",
  7: "साझेदारी और संबंध",
  8: "परिवर्तन, अनिश्चितता और सावधानी",
  9: "भाग्य, सीख और यात्रा",
  10: "करियर, प्रतिष्ठा और जिम्मेदारी",
  11: "लाभ, मित्र और लक्ष्य",
  12: "खर्च, विश्राम और अंतर्मुखता",
};

const HOUSE_TONE: Record<number, string> = {
  1: "मिश्रित", 2: "संतुलित", 3: "अनुकूल", 4: "मिश्रित", 5: "अनुकूल",
  6: "कार्यशील", 7: "संतुलित", 8: "सावधान", 9: "अनुकूल", 10: "अनुकूल",
  11: "अनुकूल", 12: "सावधान",
};

interface PlanetSnap { lon: number; sign: number; house: number; meaning: string; tone: string; }
interface Snapshot { date: Date; planets: Record<string, PlanetSnap>; moon: PlanetSnap; }

function snapshot(date: Date, baseSign: number): Snapshot {
  const out: Snapshot = { date, planets: {} as any, moon: {} as any };
  for (const p of PLANETS) {
    const lon = siderealPlanet(p, date);
    const sign = signOf(lon);
    const house = houseFrom(baseSign, sign);
    out.planets[p] = { lon, sign, house, meaning: HOUSE_MEANING[house], tone: HOUSE_TONE[house] };
  }
  const moonLon = siderealPlanet("Moon", date);
  const moonSign = signOf(moonLon);
  const moonHouse = houseFrom(baseSign, moonSign);
  out.moon = { lon: moonLon, sign: moonSign, house: moonHouse, meaning: HOUSE_MEANING[moonHouse], tone: HOUSE_TONE[moonHouse] };
  return out;
}

function summarizeChange(name: string, a: Snapshot, b: Snapshot): string {
  const A = a.planets[name];
  const B = b.planets[name];
  if (A.house === B.house) return `${LABELS[name]} पूरे period में मुख्यतः ${A.house}वें भाव (${A.meaning}) पर प्रभाव देता है।`;
  return `${LABELS[name]} ${A.house}वें भाव से ${B.house}वें भाव की ओर बढ़ता है—focus ${A.meaning} से ${B.meaning} की ओर shift हो सकता है।`;
}

function overallTone(snap: Snapshot): string {
  const hs = Object.values(snap.planets).map((x) => x.house);
  let score = 0;
  for (const h of hs) {
    if ([3, 5, 9, 10, 11].includes(h)) score++;
    if ([8, 12].includes(h)) score--;
  }
  return score >= 2 ? "अनुकूल" : score <= -2 ? "सावधानीपूर्ण" : "मिश्रित";
}

export type PeriodMode = "daily" | "weekly" | "monthly" | "yearly";

export function buildPeriodTransitContext(mode: PeriodMode, baseSign: number, now = new Date()) {
  let start: Date, end: Date;
  if (mode === "daily") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    end = start;
  } else if (mode === "weekly") {
    start = startOfWeek(now);
    end = endOfWeek(now);
  } else if (mode === "monthly") {
    start = startOfMonth(now);
    end = endOfMonth(now);
  } else {
    start = startOfYear(now);
    end = endOfYear(now);
  }
  const mid = new Date((start.getTime() + end.getTime()) / 2);
  const A = snapshot(start, baseSign);
  const M = snapshot(mid, baseSign);
  const B = snapshot(end, baseSign);
  const summaries = PLANETS.map((p) => summarizeChange(p, A, B));
  return {
    start, end, mid,
    startSnap: A, midSnap: M, endSnap: B,
    summaries,
    overallTone: overallTone(M),
    moonMid: M.moon,
  };
}
