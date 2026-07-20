"use server";

import { extractCRMId, fetchCRMProperty, geocodeAddress, mapCRMToProperty } from "@/lib/crm";
import type { Property } from "@/lib/types";

export type PreviewResult =
  | { ok: true; property: Omit<Property, "id" | "created_at"> }
  | { ok: false; error: "not_configured" | "not_found" | "invalid_input" | "api_error" };

export async function previewFromCRMLink(input: string): Promise<PreviewResult> {
  if (!input?.trim()) return { ok: false, error: "invalid_input" };

  const id = extractCRMId(input);
  if (!id) return { ok: false, error: "invalid_input" };

  if (!process.env.NADLAN_ONE_PROP_KEY || !process.env.NADLAN_ONE_PROP_API_KEY) {
    return { ok: false, error: "not_configured" };
  }

  const crm = await fetchCRMProperty(id);
  if (!crm) return { ok: false, error: "not_found" };

  const coords = await geocodeAddress(crm.street, crm.numHouse, crm.city);
  const property = mapCRMToProperty(crm, coords);

  return { ok: true, property };
}
