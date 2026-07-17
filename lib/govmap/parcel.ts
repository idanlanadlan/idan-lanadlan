import { mercatorToWgs84, wgs84ToMercator, wgs84ToItm } from "./itm";

// Parcel (gush/helka) lookups against GovMap's internal layers-catalog REST
// API — same undocumented family as the autocomplete service: no token, no
// browser library, CORS-open. Discovered by tracing govmap.gov.il network
// traffic. The API rejects requests without the fingerprint headers the SPA
// sends, but accepts any well-formed random hex value.
const ENTITIES_BY_POINT_URL = "https://www.govmap.gov.il/api/layers-catalog/entitiesByPoint";
const AUTOCOMPLETE_URL = "https://www.govmap.gov.il/api/search-service/autocomplete";
const PARCEL_LAYER_ID = "15";

export interface ParcelInfo {
  gush: number;
  gushSuffix: number | null;
  helka: number;
  /** שטח רשום במ"ר — registered (legal) area, not measured area. */
  legalAreaSqm: number | null;
  /** e.g. "מוסדר" */
  status: string | null;
  /** Parcel centroid. */
  lat: number;
  lng: number;
}

function randomHex32(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// One fingerprint per page load, like the GovMap SPA itself.
const fingerprint = randomHex32();

function govmapHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-fingerprint-id": fingerprint,
    "x-user-id": fingerprint,
    "x-trace-id": randomHex32(),
  };
}

async function postJson(url: string, body: unknown, timeoutMs = 8000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: govmapHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

interface EntityField {
  fieldName?: string;
  fieldValue?: unknown;
}

interface EntitiesByPointResponse {
  data?: {
    name?: string;
    entities?: {
      centroid?: [number, number];
      fields?: EntityField[];
    }[];
  }[];
}

function fieldValue(fields: EntityField[], name: string): unknown {
  return fields.find((f) => f.fieldName === name)?.fieldValue ?? null;
}

function toNum(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/**
 * The parcel containing a WGS84 point, or null on any failure
 * (point outside registered land, service down, timeout).
 */
export async function parcelByPoint(lat: number, lng: number): Promise<ParcelInfo | null> {
  try {
    const { x, y } = wgs84ToMercator(lat, lng);
    const json = (await postJson(ENTITIES_BY_POINT_URL, {
      point: [x, y],
      layers: [{ layerId: PARCEL_LAYER_ID }],
      tolerance: 4,
    })) as EntitiesByPointResponse | null;

    const entity = json?.data?.find((d) => d.name === "parcel_all")?.entities?.[0];
    if (!entity?.fields) return null;

    // Field names are the Hebrew captions GovMap returns (fieldsMapping):
    // gush_num="מספר גוש", gush_suffix="תת גוש", parcel="חלקה",
    // legal_area="שטח רשום (מ\"ר)", status_text="סטטוס".
    const gush = toNum(fieldValue(entity.fields, "מספר גוש"));
    const helka = toNum(fieldValue(entity.fields, "חלקה"));
    if (gush === null || helka === null) return null;

    const centroid = entity.centroid
      ? mercatorToWgs84(entity.centroid[0], entity.centroid[1])
      : { lat, lng };
    const status = fieldValue(entity.fields, "סטטוס");

    return {
      gush,
      helka,
      gushSuffix: toNum(fieldValue(entity.fields, "תת גוש")),
      legalAreaSqm: toNum(fieldValue(entity.fields, 'שטח רשום (מ"ר)')),
      status: typeof status === "string" ? status : null,
      ...centroid,
    };
  } catch {
    return null;
  }
}

/**
 * Locate a parcel by gush+helka numbers. Resolves the parcel centroid via the
 * search service, then fetches the full parcel record at that point.
 */
export async function findParcel(gush: number, helka: number): Promise<ParcelInfo | null> {
  try {
    const query = `גוש ${gush} חלקה ${helka}`;
    const json = (await postJson(AUTOCOMPLETE_URL, {
      searchText: query,
      language: "he",
      isAccurate: true,
      maxResults: 10,
    })) as { results?: { text?: string; type?: string; shape?: string }[] } | null;

    const hit = json?.results?.find((r) => r.type === "parcel" && r.text === query);
    const m = hit?.shape?.match(/POINT\(([\d.]+)\s+([\d.]+)\)/);
    if (!m) return null;

    const { lat, lng } = mercatorToWgs84(Number(m[1]), Number(m[2]));
    const parcel = await parcelByPoint(lat, lng);
    // The centroid always falls inside its own parcel, so a mismatch means
    // the point query drifted — trust the search hit's identity over nothing.
    if (parcel && (parcel.gush !== gush || parcel.helka !== helka)) {
      return { ...parcel, gush, helka, gushSuffix: null };
    }
    return parcel ?? { gush, helka, gushSuffix: null, legalAreaSqm: null, status: null, lat, lng };
  } catch {
    return null;
  }
}

/** Link to the official GovMap viewer centered on a WGS84 point (ITM URL params). */
export function govmapSiteLink(lat: number, lng: number): string {
  const { x, y } = wgs84ToItm(lat, lng);
  return `https://www.govmap.gov.il/?c=${Math.round(x)},${Math.round(y)}&z=12&lay=15`;
}
