import type { Property } from "./types";

export interface CRMProperty {
  id: string;
  category: string;
  type: string;
  price: string;
  city: string;
  neighborhood: string;
  street: string;
  numHouse: string;
  room: string;
  built: string;
  parking: boolean;
  elevator: boolean;
  description: string;
  pic: string[] | null;
  ribbon: string;
}

/** Extracts a numeric Nadlan One property ID from a URL or a bare number string */
export function extractCRMId(input: string): string | null {
  const trimmed = input.trim();
  // Bare numeric ID
  if (/^\d+$/.test(trimmed)) return trimmed;
  // Extract last long numeric segment from URL (e.g. /property/100268 or ?id=100268)
  const match = trimmed.match(/[?&/](?:id=)?(\d{4,8})(?:[^0-9]|$)/);
  if (match) return match[1];
  // Fallback: last numeric sequence of 4+ digits in the string
  const all = trimmed.match(/\d{4,8}/g);
  return all ? all[all.length - 1] : null;
}

export async function fetchCRMProperty(id: string): Promise<CRMProperty | null> {
  const key = process.env.NADLAN_ONE_PROP_KEY;
  if (!key) return null;

  try {
    // The prop API is authorized via the `key` query param only — it is a
    // different key/endpoint than the Lead API in app/actions/contact.ts,
    // which takes its own X-API-KEY header (NADLAN_ONE_LEAD_KEY). Sending
    // that header here was incorrect and likely caused auth failures.
    const url = `https://int.nadlanone.co.il/apiv1/prop?key=${key}&lang=he&id=${id}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      console.error("Nadlan One prop API error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    // API returns an array even for single-property queries
    const list: CRMProperty[] = Array.isArray(data) ? data : [data];
    if (list.length === 0) {
      console.error(`Nadlan One prop API returned an empty list for id=${id}`);
    }
    return list[0] ?? null;
  } catch (err) {
    console.error("Nadlan One prop API request failed:", err);
    return null;
  }
}

/** Geocodes an Israeli address using Nominatim (free, no API key required) */
export async function geocodeAddress(
  street: string,
  numHouse: string,
  city: string
): Promise<{ lat: number; lng: number } | null> {
  const q = `${street} ${numHouse}, ${city}, Israel`.replace(/\s+/g, " ").trim();
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { "User-Agent": "idanlanadlan.co.il" }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

function detectType(category: string): "sale" | "rent" {
  if (category.includes("השכרה") || category.includes("שכירות")) return "rent";
  return "sale";
}

export function mapCRMToProperty(
  crm: CRMProperty,
  coords: { lat: number; lng: number } | null
): Omit<Property, "id" | "created_at"> {
  const rooms = parseFloat(crm.room) || 0;
  const sqm = parseFloat(crm.built) || 0;
  const price = parseFloat(crm.price) || 0;

  // Build a readable title from the type string (e.g. "דירה 3 חדרים 80 מ\"ר")
  const locationPart = crm.neighborhood || crm.city || "";
  const title = [crm.type, locationPart].filter(Boolean).join(" — ");

  const address = [crm.street, crm.numHouse, crm.neighborhood, crm.city]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    price,
    type: detectType(crm.category),
    bedrooms: Math.round(rooms),
    bathrooms: 1,
    size_sqm: Math.round(sqm),
    address,
    neighborhood: crm.neighborhood || "",
    city: crm.city || "",
    description: crm.description || "",
    images: crm.pic ?? [],
    status: "available",
    featured: crm.ribbon === "בלעדי",
    crm_id: String(crm.id),
    lat: coords?.lat,
    lng: coords?.lng,
  };
}
