import { mercatorToWgs84 } from "./itm";

// GovMap's search-service is a plain REST endpoint: no token, no library,
// works cross-origin. Discovered by tracing govmap.api.js network calls —
// undocumented, so every failure path degrades to "no suggestions".
const AUTOCOMPLETE_URL = "https://www.govmap.gov.il/api/search-service/autocomplete";

export interface AddressSuggestion {
  /** Normalized display text, e.g. "הירקון 319 תל אביב" */
  text: string;
  lat: number;
  lng: number;
}

interface RawResult {
  text?: string;
  type?: string;
  shape?: string; // "POINT(3871079.31 3775995.05)" — Web Mercator
}

function parsePoint(shape: string | undefined): { lat: number; lng: number } | null {
  const m = shape?.match(/POINT\(([\d.]+)\s+([\d.]+)\)/);
  if (!m) return null;
  const { lat, lng } = mercatorToWgs84(Number(m[1]), Number(m[2]));
  if (lat < 29 || lat > 34 || lng < 33.5 || lng > 36.5) return null;
  return { lat, lng };
}

/**
 * Address suggestions for a partial Hebrew address. Returns [] on any failure.
 */
export async function govmapAutocomplete(
  searchText: string,
  maxResults = 6
): Promise<AddressSuggestion[]> {
  const q = searchText.trim();
  if (q.length < 2) return [];
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(AUTOCOMPLETE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchText: q, language: "he", isAccurate: false, maxResults: 10 }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const json = (await res.json()) as { results?: RawResult[] };
    const out: AddressSuggestion[] = [];
    for (const r of json.results ?? []) {
      if (r.type !== "address" && r.type !== "street") continue;
      const coords = parsePoint(r.shape);
      if (!r.text || !coords) continue;
      out.push({ text: r.text, ...coords });
      if (out.length >= maxResults) break;
    }
    return out;
  } catch {
    return [];
  }
}
