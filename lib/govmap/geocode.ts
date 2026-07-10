"use client";

import { loadGovMap } from "./loader";
import { itmToWgs84 } from "./itm";
import type { GovMapGeocodeResponse } from "./types";

export type GeocodeAccuracy = "exact" | "partial";

export interface GeocodeResult {
  lat: number;
  lng: number;
  accuracy: GeocodeAccuracy;
}

function extractXY(res: GovMapGeocodeResponse): { x?: number; y?: number; code?: number } {
  // Response envelope differs between library versions — check both shapes.
  const d = (res?.data ?? res) as { X?: number; Y?: number; ResultCode?: number };
  return { x: d?.X, y: d?.Y, code: d?.ResultCode };
}

/**
 * Official Hebrew-aware geocoding via GovMap. Returns null on any failure —
 * callers must treat coordinates as an optional enhancement, never a blocker.
 * ResultCode: 1 = exact match, 2 = partial (street found, house number not),
 * 3 = ambiguous/none (no coordinates returned).
 */
export async function govmapGeocode(address: string): Promise<GeocodeResult | null> {
  const keyword = address.trim();
  if (!keyword) return null;
  try {
    const govmap = await loadGovMap();
    const res = await Promise.resolve(
      govmap.geocode({ keyword, type: govmap.geocodeType.AccuracyOnly })
    );
    const { x, y, code } = extractXY(res as GovMapGeocodeResponse);
    if (!x || !y || code === 3) return null;
    const { lat, lng } = itmToWgs84(x, y);
    // Sanity bounds for Israel — protects against unexpected coordinate systems.
    if (lat < 29 || lat > 34 || lng < 33.5 || lng > 36.5) return null;
    return { lat, lng, accuracy: code === 1 ? "exact" : "partial" };
  } catch {
    return null;
  }
}
