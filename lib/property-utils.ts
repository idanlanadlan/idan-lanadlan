import type { Property } from "./types";
import type { Locale } from "./translations";

export function grossSize(p: Property): number {
  return p.size_sqm + (p.balcony_sqm ?? 0);
}

export function equivalentSize(p: Property): number {
  return p.size_sqm + (p.balcony_sqm ?? 0) / 2;
}

export function pricePerSqm(p: Property): number {
  return Math.round(p.price / equivalentSize(p));
}

/** Picks the translated field for the given locale, falling back to Hebrew if missing. */
export function localizedField(
  p: Property,
  field: "title" | "description" | "neighborhood" | "city",
  locale: Locale
): string {
  if (locale === "he") return p[field];
  const key = `${field}_${locale}` as keyof Property;
  return (p[key] as string | undefined) || p[field];
}
