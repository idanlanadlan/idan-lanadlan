import { wgs84ToMercator } from "./itm";
import { govmapPostJson, ENTITIES_BY_POINT_URL } from "./rest-client";

// Neighborhood-boundary lookup against GovMap's "neighborhoods_area" layer.
// Layer ID 22 found by brute-forcing small numeric IDs against entitiesByPoint
// (same undocumented endpoint parcel.ts already uses for PARCEL_ALL / "15")
// and inspecting field names — no official layer-ID catalog exists to look
// this up directly. Verified against several real listed properties: exact or
// clearly-equivalent match in most cases (GovMap's official municipal
// boundary occasionally differs from colloquial usage right at a border,
// e.g. can return "הצפון הישן" for an address commonly called "לב העיר").
const NEIGHBORHOOD_LAYER_ID = "22";

interface EntityField {
  fieldName?: string;
  fieldValue?: unknown;
}

interface EntitiesByPointResponse {
  data?: {
    name?: string;
    entities?: { fields?: EntityField[] }[];
  }[];
}

/**
 * The neighborhood name containing a WGS84 point, or null on any failure
 * (point outside a mapped area, service down, timeout).
 */
export async function neighborhoodByPoint(lat: number, lng: number): Promise<string | null> {
  try {
    const { x, y } = wgs84ToMercator(lat, lng);
    const json = (await govmapPostJson(ENTITIES_BY_POINT_URL, {
      point: [x, y],
      layers: [{ layerId: NEIGHBORHOOD_LAYER_ID }],
      tolerance: 4,
    })) as EntitiesByPointResponse | null;

    const entity = json?.data?.find((d) => d.name === "neighborhoods_area")?.entities?.[0];
    const name = entity?.fields?.find((f) => f.fieldName === "שם שכונה/אזור")?.fieldValue;
    return typeof name === "string" && name.trim() ? name : null;
  } catch {
    return null;
  }
}
