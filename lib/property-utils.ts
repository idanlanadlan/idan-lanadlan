import type { Property } from "./types";

export function grossSize(p: Property): number {
  return p.size_sqm + (p.balcony_sqm ?? 0);
}

export function equivalentSize(p: Property): number {
  return p.size_sqm + (p.balcony_sqm ?? 0) / 2;
}

export function pricePerSqm(p: Property): number {
  return Math.round(p.price / equivalentSize(p));
}
