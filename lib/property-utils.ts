import type { Property } from "./types";
import type { Locale } from "./translations";

/** The size shown to the public as "גודל הנכס": built area + full balcony.
 *  size_sqm is entered as the built area only; the balcony is added here. */
export function displaySize(p: Property): number {
  return p.size_sqm + (p.balcony_sqm ?? 0);
}

/** Weighted area for the ₪/m² figure — Israeli convention counts a balcony at 50%. */
export function equivalentSize(p: Property): number {
  return p.size_sqm + (p.balcony_sqm ?? 0) / 2;
}

export function pricePerSqm(p: Property): number {
  return Math.round(p.price / equivalentSize(p));
}

/** Picks the translated field for the given locale, falling back to Hebrew if missing. */
export function localizedField(
  p: Property,
  field: "title" | "description" | "neighborhood" | "city" | "address",
  locale: Locale
): string {
  if (locale === "he") return p[field];
  const key = `${field}_${locale}` as keyof Property;
  return (p[key] as string | undefined) || p[field];
}

/** Drops a trailing house number (and anything after it) from a street address:
 *  "הירקון 319" → "הירקון", "HaYarkon St 12, Apt 4" → "HaYarkon St". */
export function streetWithoutNumber(address: string): string {
  const stripped = address
    .replace(/[,،].*$/u, "") // everything from the first comma on
    .replace(/\s+\d.*$/u, "") // the first run of digits and anything after it
    .trim();
  return stripped || address;
}

/**
 * The address line shown on the public site for a property, honoring its
 * `address_visibility`:
 *   full (default) → "רחוב 12, שכונה, עיר"
 *   street         → "רחוב, שכונה, עיר"   (house number removed)
 *   neighborhood   → "שכונה, עיר"          (no street at all)
 */
export function displayAddress(p: Property, locale: Locale): string {
  const neighborhood = localizedField(p, "neighborhood", locale);
  const city = localizedField(p, "city", locale);
  const vis = p.address_visibility ?? "full";
  if (vis === "neighborhood") return [neighborhood, city].filter(Boolean).join(", ");
  const street = localizedField(p, "address", locale);
  const shown = vis === "street" ? streetWithoutNumber(street) : street;
  return [shown, neighborhood, city].filter(Boolean).join(", ");
}

/** The `streetAddress` value for JSON-LD / PostalAddress, masked to match
 *  what the page shows. Empty string when the street is fully hidden. */
export function schemaStreetAddress(p: Property): string {
  const vis = p.address_visibility ?? "full";
  if (vis === "neighborhood") return "";
  if (vis === "street") return streetWithoutNumber(p.address);
  return p.address;
}
