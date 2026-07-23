import type { Locale } from "./translations";

/**
 * Picks an admin-edited homepage copy override (stored in site_settings as
 * `${key}_${locale}`) if present, falling back to the static translations.ts
 * value otherwise. Used for headline-level text (eyebrow/title/subtitle) on
 * the homepage — edited in /admin/settings, auto-translated on save.
 */
export function pickCopy(
  settings: Record<string, string>,
  key: string,
  locale: Locale,
  fallback: string
): string {
  return settings[`${key}_${locale}`] || fallback;
}
