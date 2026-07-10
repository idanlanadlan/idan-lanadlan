"use client";

import { loadGovMap, ensureGovMapAuth } from "./loader";
import { itmToWgs84 } from "./itm";
import type { GovMapGeocodeResponse } from "./types";

const CALL_TIMEOUT_MS = 15_000;

function withTimeout<T>(p: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(p),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("govmap call timed out")), ms)),
  ]);
}

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
    // Discovery finding: geocode is NOT standalone — the library routes calls
    // through an iframe message port that only exists after an authed createMap.
    await ensureGovMapAuth();
    const res = await withTimeout(
      govmap.geocode({ keyword, type: govmap.geocodeType.AccuracyOnly }),
      CALL_TIMEOUT_MS
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
