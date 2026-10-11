// AstroSuman Astronomy Engine - Ported from js/astro/astronomy.js
// Full astronomical calculation engine for browser-side Vedic astrology.

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export function norm360(x: number): number {
  return ((x % 360) + 360) % 360;
}

export function angleDiff(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}

export function julianDayUTC(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function daysSince2000Jan0(jd: number): number {
  return jd - 2451543.5;
}

function kepler(Mdeg: number, e: number): number {
  const M = norm360(Mdeg) * DEG;
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  for (let k = 0; k < 12; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
}

function sunVector(d: number) {
  const w = 282.9404 + 4.70935e-5 * d;
  const e = 0.016709 - 1.151e-9 * d;
  const M = 356.047 + 0.9856002585 * d;
  const E = kepler(M, e);
  const xv = Math.cos(E) - e;
  const yv = Math.sqrt(1 - e * e) * Math.sin(E);
  const v = Math.atan2(yv, xv);
  const r = Math.hypot(xv, yv);
  const lon = norm360(v * RAD + w);
  const lr = lon * DEG;
  return { lon, r, x: r * Math.cos(lr), y: r * Math.sin(lr) };
}

export function sunLongitude(jd: number): number {
  return sunVector(daysSince2000Jan0(jd)).lon;
}

export function moonLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L0 = norm360(218.3164477 + 13.17639648 * n);
  const Mm = norm360(134.9633964 + 13.06499295 * n);
  const Ms = norm360(357.5291092 + 0.98560028 * n);
  const D = norm360(297.8501921 + 12.19074912 * n);
  const F = norm360(93.272095 + 13.22935024 * n);
  const r = DEG;
  const corr =
    6.289 * Math.sin(Mm * r) +
    1.274 * Math.sin((2 * D - Mm) * r) +
    0.658 * Math.sin(2 * D * r) +
    0.214 * Math.sin(2 * Mm * r) -
    0.186 * Math.sin(Ms * r) -
    0.114 * Math.sin(2 * F * r) -
    0.059 * Math.sin((2 * Mm - 2 * D) * r) -
    0.057 * Math.sin((Mm - 2 * D + Ms) * r) +
    0.053 * Math.sin((Mm + 2 * D) * r) +
    0.046 * Math.sin((2 * D - Ms) * r) +
    0.041 * Math.sin((Mm - Ms) * r) -
    0.035 * Math.sin(D * r) -
    0.031 * Math.sin((Mm + Ms) * r) -
    0.015 * Math.sin((2 * F - 2 * D) * r) +
    0.011 * Math.sin((Mm - 4 * D) * r);
  return norm360(L0 + corr);
}

type PlanetName = "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune";

function elements(name: PlanetName, d: number): number[] {
  const table: Record<PlanetName, number[]> = {
    Mercury: [48.3313 + 3.24587e-5 * d, 7.0047 + 5e-8 * d, 29.1241 + 1.01444e-5 * d, 0.387098, 0.205635 + 5.59e-10 * d, 168.6562 + 4.0923344368 * d],
    Venus: [76.6799 + 2.4659e-5 * d, 3.3946 + 2.75e-8 * d, 54.891 + 1.38374e-5 * d, 0.72333, 0.006773 - 1.302e-9 * d, 48.0052 + 1.6021302244 * d],
    Mars: [49.5574 + 2.11081e-5 * d, 1.8497 - 1.78e-8 * d, 286.5016 + 2.92961e-5 * d, 1.523688, 0.093405 + 2.516e-9 * d, 18.6021 + 0.5240207766 * d],
    Jupiter: [100.4542 + 2.76854e-5 * d, 1.303 - 1.557e-7 * d, 273.8777 + 1.64505e-5 * d, 5.20256, 0.048498 + 4.469e-9 * d, 19.895 + 0.0830853001 * d],
    Saturn: [113.6634 + 2.3898e-5 * d, 2.4886 - 1.081e-7 * d, 339.3939 + 2.97661e-5 * d, 9.55475, 0.055546 - 9.499e-9 * d, 316.967 + 0.0334442282 * d],
    Uranus: [74.0005 + 1.3978e-5 * d, 0.7733 + 1.9e-8 * d, 96.6612 + 3.0565e-5 * d, 19.18171 - 1.55e-8 * d, 0.047318 + 7.45e-9 * d, 142.5905 + 0.011725806 * d],
    Neptune: [131.7806 + 3.0173e-5 * d, 1.77 - 2.55e-7 * d, 272.8461 - 6.027e-6 * d, 30.05826 + 3.313e-8 * d, 0.008606 + 2.15e-9 * d, 260.2471 + 0.005995147 * d],
  };
  return table[name];
}

function meanAnomaly(name: PlanetName, d: number): number {
  return norm360(elements(name, d)[5]);
}

export function planetLongitude(name: PlanetName, jd: number): number {
  const d = daysSince2000Jan0(jd);
  const [Ndeg, ideg, wdeg, a, e, Mdeg] = elements(name, d);
  const E = kepler(Mdeg, e);
  const xv = a * (Math.cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const v = Math.atan2(yv, xv);
  const r = Math.hypot(xv, yv);
  const N = Ndeg * DEG;
  const i = ideg * DEG;
  const w = wdeg * DEG;
  const xh = r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(i));
  const yh = r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(i));
  const s = sunVector(d);
  let lon = norm360(Math.atan2(yh + s.y, xh + s.x) * RAD);
  if (name === "Jupiter" || name === "Saturn") {
    const J = meanAnomaly("Jupiter", d);
    const S = meanAnomaly("Saturn", d);
    if (name === "Jupiter") {
      lon +=
        -0.332 * Math.sin((2 * J - 5 * S - 67.6) * DEG) -
        0.056 * Math.sin((2 * J - 2 * S + 21) * DEG) +
        0.042 * Math.sin((3 * J - 5 * S + 21) * DEG) -
        0.036 * Math.sin((J - 2 * S) * DEG) +
        0.022 * Math.cos((J - S) * DEG) +
        0.023 * Math.sin((2 * J - 3 * S + 52) * DEG) -
        0.016 * Math.sin((J - 5 * S - 69) * DEG);
    } else {
      lon +=
        0.812 * Math.sin((2 * J - 5 * S - 67.6) * DEG) -
        0.229 * Math.cos((2 * J - 4 * S - 2) * DEG) +
        0.119 * Math.sin((J - 2 * S - 3) * DEG) +
        0.046 * Math.sin((2 * J - 6 * S - 69) * DEG) +
        0.014 * Math.sin((J - 3 * S + 32) * DEG);
    }
  }
  return norm360(lon);
}

export function plutoLongitude(jd: number): number {
  const d = daysSince2000Jan0(jd);
  const P = (238.95 + 0.003968789 * d) * DEG;
  const lon =
    238.9508 + 0.00400703 * d - 19.799 * Math.sin(P) + 19.848 * Math.cos(P) + 0.897 * Math.sin(2 * P) - 4.956 * Math.cos(2 * P) + 0.61 * Math.sin(3 * P) + 1.211 * Math.cos(3 * P) - 0.341 * Math.sin(4 * P) - 0.19 * Math.cos(4 * P) + 0.128 * Math.sin(5 * P) - 0.034 * Math.cos(5 * P) - 0.038 * Math.sin(6 * P) + 0.031 * Math.cos(6 * P);
  const lat =
    -3.9082 - 5.453 * Math.sin(P) - 14.975 * Math.cos(P) + 3.527 * Math.sin(2 * P) + 1.673 * Math.cos(2 * P) - 1.051 * Math.sin(3 * P) + 0.328 * Math.cos(3 * P) + 0.179 * Math.sin(4 * P) - 0.292 * Math.cos(4 * P) + 0.019 * Math.sin(5 * P) + 0.1 * Math.cos(5 * P) - 0.031 * Math.sin(6 * P) - 0.026 * Math.cos(6 * P);
  const r =
    40.72 + 6.68 * Math.sin(P) + 6.9 * Math.cos(P) - 1.18 * Math.sin(2 * P) - 0.03 * Math.cos(2 * P) + 0.15 * Math.sin(3 * P) - 0.14 * Math.cos(3 * P);
  const lr = lon * DEG;
  const br = lat * DEG;
  const xh = r * Math.cos(lr) * Math.cos(br);
  const yh = r * Math.sin(lr) * Math.cos(br);
  const s = sunVector(d);
  return norm360(Math.atan2(yh + s.y, xh + s.x) * RAD);
}

export function meanNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  return norm360(125.0445479 - 1934.1362891 * T + 0.0020754 * T2 + T3 / 467441 - T4 / 60616000);
}

export function trueNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const D = norm360(297.8501921 + (445267.1114034 + (-0.0018819 + (1 / 545868 - T / 113065000) * T) * T) * T);
  const M = norm360(357.5291092 + (35999.0502909 + (-0.0001536 + T / 24490000) * T) * T);
  const Mp = norm360(134.9633964 + (477198.8675055 + (0.0087414 + (1 / 69699 - T / 14712000) * T) * T) * T);
  const F = norm360(93.272095 + (483202.0175233 + (-0.0036539 + (-1 / 3526000 + T / 863310000) * T) * T) * T);
  const r = Math.PI / 180;
  const corr =
    -1.4979 * Math.sin(2 * (D - F) * r) -
    0.15 * Math.sin(M * r) -
    0.1226 * Math.sin(2 * D * r) +
    0.1176 * Math.sin(2 * F * r) -
    0.0801 * Math.sin(2 * (Mp - F) * r);
  return norm360(meanNodeLongitude(jd) + corr);
}

export function siderealLongitude(tropical: number, ayanamsa: number): number {
  return norm360(tropical - ayanamsa);
}

export function gmstDegrees(jd: number): number {
  const T = (jd - 2451545) / 36525;
  return norm360(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000);
}

export function ascendantLongitude(jd: number, latDeg: number, lonDeg: number): number {
  const d = daysSince2000Jan0(jd);
  const eps = (23.4393 - 3.563e-7 * d) * DEG;
  const theta = norm360(gmstDegrees(jd) + lonDeg) * DEG;
  const phi = latDeg * DEG;
  return norm360(Math.atan2(-Math.cos(theta), Math.sin(eps) * Math.tan(phi) + Math.cos(eps) * Math.sin(theta)) * RAD + 180);
}

export function sunriseSunset(dateLocal: Date, lat: number, lon: number, tz: number) {
  const dayStart = new Date(Date.UTC(dateLocal.getUTCFullYear(), dateLocal.getUTCMonth(), dateLocal.getUTCDate()));
  const N = Math.floor((dayStart.getTime() - Date.UTC(dayStart.getUTCFullYear(), 0, 0)) / 86400000);
  const zenith = 90.833;
  const calc = (rise: boolean) => {
    const lngHour = lon / 15;
    const t = N + ((rise ? 6 : 18) - lngHour) / 24;
    const M = 0.9856 * t - 3.289;
    const L = norm360(M + 1.916 * Math.sin(M * DEG) + 0.02 * Math.sin(2 * M * DEG) + 282.634);
    let RA = norm360(Math.atan(0.91764 * Math.tan(L * DEG)) * RAD);
    const Lq = Math.floor(L / 90) * 90;
    const RAq = Math.floor(RA / 90) * 90;
    RA = (RA + (Lq - RAq)) / 15;
    const sinDec = 0.39782 * Math.sin(L * DEG);
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH = (Math.cos(zenith * DEG) - sinDec * Math.sin(lat * DEG)) / (cosDec * Math.cos(lat * DEG));
    if (cosH > 1 || cosH < -1) return null;
    const H = (rise ? 360 - Math.acos(cosH) * RAD : Math.acos(cosH) * RAD) / 15;
    const T = H + RA - 0.06571 * t - 6.622;
    const UT = ((T - lngHour) % 24 + 24) % 24;
    return ((UT + tz) % 24 + 24) % 24;
  };
  return { sunrise: calc(true), sunset: calc(false) };
}

export function lahiriAyanamsa(jd: number): number {
  const refJD = 2447148.0625;
  const ref = 23 + 41 / 60 + 18 / 3600;
  const rateDegPerDay = (50.28 / 3600) / 365.2425;
  return ref + (jd - refJD) * rateDegPerDay;
}

export function horosoftNadiAyanamsa(jd: number): number {
  const refJD = 2447148.0625;
  const ref = 23 + 35 / 60 + 59 / 3600;
  const rateDegPerDay = (50.0 / 3600) / 365.2425;
  return ref + (jd - refJD) * rateDegPerDay;
}

export function sourceDynamicNadiAyanamsa(jd: number): number {
  const epochJD = 1827345.5; // 291-01-01 00:00 UTC
  const tropicalYear = 365.2425;
  const years = (jd - epochJD) / tropicalYear;
  const base = (years * 50.2388475) / 3600;
  const nadiCorrection = 6 / 60;
  return base + nadiCorrection;
}
