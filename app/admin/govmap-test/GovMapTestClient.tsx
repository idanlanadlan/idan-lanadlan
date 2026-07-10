"use client";

import { useRef, useState } from "react";
import { loadGovMap, ensureGovMapAuth } from "@/lib/govmap/loader";
import { govmapGeocode } from "@/lib/govmap/geocode";
import { itmToWgs84, wgs84ToItm } from "@/lib/govmap/itm";

// Office reference point: הירקון 319 ת"א — Google says 32.0967, 34.7745
// (hardcoded in the contact page iframe). Used to validate the ITM conversion.
const OFFICE = { address: "הירקון 319, תל אביב", lat: 32.0967, lng: 34.7745 };

const CANDIDATE_LAYERS = [
  "PARCEL_ALL",
  "PARCEL_HOKS",
  "SUB_GUSH_ALL",
  "TABA4",
  "TABA_MELIM",
  "mavat_taba",
  "EDU_MOSDOT",
  "mosdot_chinuch",
  "METRO_STATIONS",
  "RAKAL_STATIONS",
  "light_rail_stations",
  "MIKLATIM",
  "shelters",
  "CELL_ANTENNA",
  "antennas",
];

export default function GovMapTestClient() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const mapDivRef = useRef<HTMLDivElement>(null);

  const append = (line: string) =>
    setLog((l) => [...l, `[${new Date().toLocaleTimeString("he-IL")}] ${line}`]);
  const appendJson = (label: string, obj: unknown) =>
    append(`${label}: ${JSON.stringify(obj, null, 1)?.slice(0, 1200)}`);

  async function run(name: string, fn: () => Promise<void>) {
    setBusy(true);
    append(`--- ${name} ---`);
    try {
      await fn();
    } catch (e) {
      append(`✗ שגיאה: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  const testLoad = () =>
    run("טעינת ספרייה", async () => {
      const hadJquery = Boolean(window.jQuery);
      append(`jQuery קיים לפני טעינה: ${hadJquery}`);
      const govmap = await loadGovMap();
      append(`✓ govmap נטען. jQuery אחרי: ${Boolean(window.jQuery)}`);
      append(`geocodeType: ${JSON.stringify(govmap.geocodeType)}`);
      append(`locateType: ${JSON.stringify(govmap.locateType)}`);
      append(`פונקציות: ${Object.keys(govmap).filter((k) => typeof (govmap as Record<string, unknown>)[k] === "function").join(", ")}`);
    });

  const testGeocodeRaw = () =>
    run("geocode גולמי (פורמט קואורדינטות)", async () => {
      const govmap = await loadGovMap();
      const res = await Promise.resolve(
        govmap.geocode({ keyword: OFFICE.address, type: govmap.geocodeType.AccuracyOnly })
      );
      appendJson("תשובה גולמית", res);
      const d = ((res as { data?: unknown }).data ?? res) as { X?: number; Y?: number };
      if (d?.X && d?.Y) {
        append(`X=${d.X}, Y=${d.Y} — ${d.X > 100000 && d.X < 300000 ? "נראה כמו ITM ✓" : "לא ITM! לבדוק מערכת קואורדינטות"}`);
        const w = itmToWgs84(d.X, d.Y);
        const dist = Math.round(
          Math.hypot((w.lat - OFFICE.lat) * 111000, (w.lng - OFFICE.lng) * 94000)
        );
        append(`המרה: lat=${w.lat.toFixed(6)}, lng=${w.lng.toFixed(6)} | מרחק מנק' הייחוס של גוגל: ~${dist} מ' ${dist < 60 ? "✓" : "⚠ לבדוק את ההמרה"}`);
      }
    });

  const testGeocodeWrapper = () =>
    run("govmapGeocode (העטיפה)", async () => {
      for (const addr of [OFFICE.address, "רחוב שאינו קיים 999, עיר דמיונית", "דיזנגוף, תל אביב"]) {
        const r = await govmapGeocode(addr);
        appendJson(`"${addr}"`, r);
      }
    });

  const testSearchAndLocate = () =>
    run("searchAndLocate בלי מפה", async () => {
      const govmap = await loadGovMap();
      try {
        const res = await Promise.resolve(
          govmap.searchAndLocate({
            type: govmap.locateType.addressToLotParcel,
            address: OFFICE.address,
          })
        );
        appendJson("✓ עבד בלי createMap — כתובת→גוש/חלקה", res);
      } catch (e) {
        append(`✗ נכשל בלי מפה (${e instanceof Error ? e.message : e}) — מנסה עם ensureGovMapAuth...`);
        await ensureGovMapAuth();
        const res = await Promise.resolve(
          govmap.searchAndLocate({
            type: govmap.locateType.addressToLotParcel,
            address: OFFICE.address,
          })
        );
        appendJson("✓ עבד אחרי auth עם מפה נסתרת", res);
      }
    });

  const testVisibleMap = () =>
    run("createMap גלוי (טוקן מהדומיין הנוכחי)", async () => {
      const govmap = await loadGovMap();
      const token = process.env.NEXT_PUBLIC_GOVMAP_API_TOKEN;
      append(`טוקן מוגדר: ${token ? "כן (" + token.slice(0, 8) + "...)" : "לא!"}`);
      if (!mapDivRef.current) return;
      mapDivRef.current.style.height = "400px";
      const itm = wgs84ToItm(OFFICE.lat, OFFICE.lng);
      govmap.createMap("govmap-test-map", {
        token,
        centerX: itm.x,
        centerY: itm.y,
        level: 10,
        showXY: true,
        identifyOnClick: true,
        background: 0,
      });
      append("✓ createMap הופעל — אם המפה מוצגת למטה והשכבות נטענות, הטוקן תקף לדומיין הזה");
    });

  const testLayers = () =>
    run("גילוי Layer IDs", async () => {
      const govmap = await loadGovMap();
      await ensureGovMapAuth();
      const itm = wgs84ToItm(OFFICE.lat, OFFICE.lng);
      for (const layer of CANDIDATE_LAYERS) {
        try {
          const fn = govmap.identifyByXYandLayer ?? govmap.getLayerData;
          if (!fn) {
            append("אין identifyByXYandLayer/getLayerData — לבדוק שמות פונקציות");
            break;
          }
          const res = await Promise.race([
            Promise.resolve(fn({ x: itm.x, y: itm.y, layerName: layer, layers: [layer], tolerance: 500 })),
            new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000)),
          ]);
          appendJson(`✓ ${layer}`, res);
        } catch (e) {
          append(`✗ ${layer}: ${e instanceof Error ? e.message : e}`);
        }
      }
    });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-xl text-gold font-display">GovMap Discovery (זמני — יימחק)</h1>
      <p className="text-xs text-gray-light">
        נקודת ייחוס: {OFFICE.address} (גוגל: {OFFICE.lat}, {OFFICE.lng})
      </p>
      <div className="flex flex-wrap gap-2">
        <button onClick={testLoad} disabled={busy} className="bg-gold text-black text-xs px-3 py-2 rounded font-semibold disabled:opacity-40">1. טעינה + jQuery</button>
        <button onClick={testGeocodeRaw} disabled={busy} className="bg-gold text-black text-xs px-3 py-2 rounded font-semibold disabled:opacity-40">2. geocode גולמי + אימות המרה</button>
        <button onClick={testGeocodeWrapper} disabled={busy} className="bg-gold text-black text-xs px-3 py-2 rounded font-semibold disabled:opacity-40">3. עטיפת geocode</button>
        <button onClick={testSearchAndLocate} disabled={busy} className="bg-gold text-black text-xs px-3 py-2 rounded font-semibold disabled:opacity-40">4. גוש/חלקה בלי מפה</button>
        <button onClick={testVisibleMap} disabled={busy} className="bg-gold text-black text-xs px-3 py-2 rounded font-semibold disabled:opacity-40">5. מפה גלויה (טוקן)</button>
        <button onClick={testLayers} disabled={busy} className="bg-gold text-black text-xs px-3 py-2 rounded font-semibold disabled:opacity-40">6. גילוי שכבות</button>
        <button onClick={() => setLog([])} className="text-xs px-3 py-2 rounded border border-gray-dark text-gray-light">נקה</button>
      </div>
      <pre className="bg-charcoal border border-gray-dark rounded p-4 text-[11px] leading-relaxed text-cream whitespace-pre-wrap break-all max-h-[50vh] overflow-y-auto" dir="ltr">
        {log.join("\n") || "לחץ על הבדיקות לפי הסדר..."}
      </pre>
      <div id="govmap-test-map" ref={mapDivRef} className="w-full rounded border border-gray-dark" />
    </div>
  );
}
