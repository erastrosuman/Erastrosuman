import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState, useCallback, useRef } from "react";
import { ArrowLeft, Search, MapPin, Loader2 } from "lucide-react";
import {
  julianDayUTC, sunLongitude, moonLongitude, planetLongitude, plutoLongitude,
  meanNodeLongitude, siderealLongitude, ascendantLongitude, norm360, lahiriAyanamsa,
} from "@/lib/astro/astronomy";
import { RASHIS, RASHI_HI, NAKSHATRAS, NAKSHATRAS_HI } from "@/lib/astro/config";

export const Route = createFileRoute("/free-astrology/kundli")({
  head: () => ({
    meta: [
      { title: "Free Kundli — फ्री कुंडली रिपोर्ट | SudnadiAstro" },
      { name: "description", content: "Generate a free Kundli report with planetary positions, nakshatra, lagna and more." },
    ],
  }),
  component: KundliPage,
});

const PLANET_NAMES_HI: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्रमा", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु",
  Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

interface PlaceSuggestion { lat: number; lon: number; label: string; }

function dms(x: number): string {
  x = norm360(x);
  const d = Math.floor(x);
  const q = (x - d) * 60;
  const m = Math.floor(q);
  const s = Math.round((q - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}′ ${String(s).padStart(2, "0")}″`;
}

function rashiData(lon: number) {
  const ns = 360 / 27;
  const sign = Math.floor(norm360(lon) / 30);
  const within = norm360(lon) - sign * 30;
  const nak = Math.floor(norm360(lon) / ns);
  const pada = Math.floor((norm360(lon) % ns) / (ns / 4)) + 1;
  return { sign, signEn: RASHIS[sign], signHi: RASHI_HI[sign], within, nakshatra: NAKSHATRAS[nak], nakshatraHi: NAKSHATRAS_HI[nak], pada };
}

function KundliPage() {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [utcOffset, setUtcOffset] = useState("5.5");
  const [selectedGeo, setSelectedGeo] = useState<PlaceSuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  const searchPlaces = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    try {
      const res = await fetch(`https://photon.komoot.io/api/?limit=6&q=${encodeURIComponent(q)}`, {
        headers: { Accept: "application/json" },
      });
      const j = await res.json();
      const items: PlaceSuggestion[] = (j.features || [])
        .map((f: any) => {
          const p = f.properties || {};
          const c = f.geometry?.coordinates || [];
          const parts = [p.name, p.city, p.county, p.state, p.country].filter(Boolean);
          return { lat: +c[1], lon: +c[0], label: [...new Set(parts)].join(", ") };
        })
        .filter((x: PlaceSuggestion) => Number.isFinite(x.lat) && Number.isFinite(x.lon));
      setSuggestions(items);
      setShowSuggestions(items.length > 0);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handlePlaceInput = (value: string) => {
    setPob(value);
    setSelectedGeo(null);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => searchPlaces(value), 350);
  };

  const selectPlace = (place: PlaceSuggestion) => {
    setSelectedGeo(place);
    setPob(place.label);
    setShowSuggestions(false);
    setGeoStatus(`स्थान चुना: ${place.label} (${place.lat.toFixed(4)}, ${place.lon.toFixed(4)})`);
  };

  const generateKundli = useCallback(async () => {
    setError(null);
    if (!dob || !tob || !pob.trim()) {
      setError("कृपया जन्म तिथि, समय और स्थान भरें।");
      return;
    }

    setLoading(true);
    try {
      let geo = selectedGeo;
      if (!geo) {
        const res = await fetch(`https://photon.komoot.io/api/?limit=1&q=${encodeURIComponent(pob)}`, { headers: { Accept: "application/json" } });
        const j = await res.json();
        const f = j.features?.[0];
        if (!f) throw new Error("जन्म स्थान नहीं मिला। शहर, राज्य और देश के साथ लिखें।");
        const c = f.geometry?.coordinates || [];
        geo = { lat: +c[1], lon: +c[0], label: pob };
        setSelectedGeo(geo);
      }

      const [y, m, d] = dob.split("-").map(Number);
      const [h, mi] = tob.split(":").map(Number);
      const off = parseFloat(utcOffset);
      const utcDate = new Date(Date.UTC(y, m - 1, d, h, mi) - off * 3600000);
      const jd = julianDayUTC(utcDate);
      const aya = lahiriAyanamsa(jd);

      const planets = [
        { name: "Sun", fn: () => sunLongitude(jd) },
        { name: "Moon", fn: () => moonLongitude(jd) },
        { name: "Mars", fn: () => planetLongitude("Mars", jd) },
        { name: "Mercury", fn: () => planetLongitude("Mercury", jd) },
        { name: "Jupiter", fn: () => planetLongitude("Jupiter", jd) },
        { name: "Venus", fn: () => planetLongitude("Venus", jd) },
        { name: "Saturn", fn: () => planetLongitude("Saturn", jd) },
        { name: "Rahu", fn: () => meanNodeLongitude(jd) },
        { name: "Ketu", fn: () => norm360(meanNodeLongitude(jd) + 180) },
      ];

      const bodies = planets.map((p) => {
        const tropical = p.fn();
        const sidereal = siderealLongitude(tropical, aya);
        const rd = rashiData(sidereal);
        return { name: p.name, nameHi: PLANET_NAMES_HI[p.name], tropical, sidereal, ...rd };
      });

      const ascT = ascendantLongitude(jd, geo.lat, geo.lon);
      const ascS = siderealLongitude(ascT, aya);
      const ascRD = rashiData(ascS);

      setResult({
        bodies,
        ascendant: { ...ascRD, sidereal: ascS },
        ayanamsa: aya,
        geo,
        birthInfo: { dob, tob, pob, utcOffset: off },
      });
    } catch (e: any) {
      setError(e.message || "गणना में त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  }, [dob, tob, pob, utcOffset, selectedGeo]);

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-deep via-[#1a1a5e] to-[#2d1470] text-cream py-14 md:py-20 px-6">
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            फ्री कुंडली रिपोर्ट
          </h1>
          <p className="mt-4 text-cream/70 max-w-2xl mx-auto">
            जन्म तिथि, समय और स्थान भरकर अपनी निःशुल्क कुंडली बनाएं।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 md:px-6 py-12">
        <div className="mb-6">
          <Link to="/free-astrology" className="inline-flex items-center gap-2 text-saffron font-semibold text-sm hover:underline">
            <ArrowLeft size={16} /> Free Astrology
          </Link>
        </div>

        {/* Input form */}
        {!result && (
          <div className="rounded-2xl bg-white border border-border-light shadow-warm p-8">
            <h2 className="text-xl font-display font-semibold text-text-head mb-6">जन्म विवरण भरें</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-text-muted font-medium">जन्म तिथि *</label>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border-light bg-cream text-text-head focus:border-saffron focus:ring-1 focus:ring-saffron outline-none" />
              </div>
              <div>
                <label className="text-sm text-text-muted font-medium">जन्म समय *</label>
                <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} step="60"
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border-light bg-cream text-text-head focus:border-saffron focus:ring-1 focus:ring-saffron outline-none" />
              </div>
              <div className="sm:col-span-2 relative">
                <label className="text-sm text-text-muted font-medium">जन्म स्थान *</label>
                <div className="relative">
                  <input type="text" value={pob} onChange={(e) => handlePlaceInput(e.target.value)} placeholder="जैसे: Jamui, Bihar, India" autoComplete="off"
                    className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border-light bg-cream text-text-head focus:border-saffron focus:ring-1 focus:ring-saffron outline-none" />
                  <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted mt-0.5" />
                </div>
                {showSuggestions && (
                  <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-border-light rounded-xl shadow-float max-h-56 overflow-auto">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => selectPlace(s)}
                        className="w-full text-left px-4 py-3 border-b border-border-light last:border-0 hover:bg-saffron-ghost text-sm text-text-body transition-colors">
                        <MapPin size={12} className="inline mr-2 text-text-muted" />
                        {s.label}
                        <span className="block text-xs text-text-muted mt-0.5">{s.lat.toFixed(4)}, {s.lon.toFixed(4)}</span>
                      </button>
                    ))}
                  </div>
                )}
                {geoStatus && <p className="text-xs text-text-muted mt-2">{geoStatus}</p>}
              </div>
              <div>
                <label className="text-sm text-text-muted font-medium">UTC Offset</label>
                <select value={utcOffset} onChange={(e) => setUtcOffset(e.target.value)}
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border-light bg-cream text-text-head focus:border-saffron outline-none">
                  <option value="5.5">India (UTC +05:30)</option>
                  <option value="5.75">Nepal (UTC +05:45)</option>
                  <option value="6">UTC +06:00</option>
                  <option value="4">UTC +04:00</option>
                  <option value="0">UTC ±00:00</option>
                  <option value="-5">UTC -05:00</option>
                  <option value="-8">UTC -08:00</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700">{error}</div>
            )}

            <button onClick={generateKundli} disabled={loading}
              className="mt-6 inline-flex items-center gap-2 bg-saffron text-white px-8 py-3.5 rounded-full font-semibold hover:bg-saffron-hover transition-all disabled:opacity-60">
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "गणना हो रही है…" : "कुंडली बनाएं"}
            </button>
          </div>
        )}

        {/* Kundli result */}
        {result && (
          <div className="space-y-6">
            <button onClick={() => setResult(null)} className="inline-flex items-center gap-2 text-saffron font-semibold text-sm hover:underline">
              <ArrowLeft size={16} /> नया कुंडली बनाएं
            </button>

            {/* Summary cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white border border-border-light shadow-warm p-5">
                <p className="text-xs font-semibold text-saffron mb-1">लग्न</p>
                <p className="text-lg font-display font-bold text-text-head">{result.ascendant.signHi}</p>
                <p className="text-xs text-text-muted">{result.ascendant.signEn} — {dms(result.ascendant.sidereal)}</p>
              </div>
              <div className="rounded-xl bg-white border border-border-light shadow-warm p-5">
                <p className="text-xs font-semibold text-saffron mb-1">चंद्र राशि</p>
                {(() => { const moon = result.bodies.find((b: any) => b.name === "Moon"); return moon ? <><p className="text-lg font-display font-bold text-text-head">{moon.signHi}</p><p className="text-xs text-text-muted">{moon.nakshatraHi} पद {moon.pada}</p></> : null; })()}
              </div>
              <div className="rounded-xl bg-white border border-border-light shadow-warm p-5">
                <p className="text-xs font-semibold text-saffron mb-1">अयनांश</p>
                <p className="text-lg font-display font-bold text-text-head">{dms(result.ayanamsa)}</p>
                <p className="text-xs text-text-muted">Lahiri</p>
              </div>
              <div className="rounded-xl bg-white border border-border-light shadow-warm p-5">
                <p className="text-xs font-semibold text-saffron mb-1">स्थान</p>
                <p className="text-sm font-semibold text-text-head truncate">{result.geo.label}</p>
                <p className="text-xs text-text-muted">{result.geo.lat.toFixed(4)}, {result.geo.lon.toFixed(4)}</p>
              </div>
            </div>

            {/* Planet table */}
            <div className="rounded-2xl bg-white border border-border-light shadow-warm overflow-hidden">
              <div className="bg-indigo-deep text-cream px-6 py-4">
                <h2 className="text-lg font-display font-semibold">🪐 जन्म ग्रह स्थिति</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream-warm">
                      <th className="px-5 py-3 text-left font-semibold text-text-head">ग्रह</th>
                      <th className="px-5 py-3 text-left font-semibold text-text-head">राशि</th>
                      <th className="px-5 py-3 text-left font-semibold text-text-head">अंश</th>
                      <th className="px-5 py-3 text-left font-semibold text-text-head">नक्षत्र / पद</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.bodies.map((b: any) => (
                      <tr key={b.name} className="border-t border-border-light hover:bg-saffron-ghost/40 transition-colors">
                        <td className="px-5 py-3 font-medium text-text-head">{b.nameHi}</td>
                        <td className="px-5 py-3 text-text-body">{b.signHi} ({b.signEn})</td>
                        <td className="px-5 py-3 text-text-body font-mono text-xs">{dms(b.within)}</td>
                        <td className="px-5 py-3 text-text-body">{b.nakshatraHi} (पद {b.pada})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-text-muted">
              यह browser-side astronomical calculation है। सटीक जन्म-कुंडली विश्लेषण के लिए professional ephemeris से cross-check करें।
            </p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
