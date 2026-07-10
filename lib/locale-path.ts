import type { Locale } from "@/lib/translations";

export const locales: Locale[] = ["he", "en", "fr"];
export const defaultLocale: Locale = "he";

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

/** Removes a leading /he, /en or /fr segment. "/en/nadlan" -> "/nadlan", "/en" -> "/" */
export function stripLocalePrefix(pathname: string): string {
  for (const l of locales) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

/**
 * Returns the path for the given locale. Hebrew stays prefix-free
 * (the proxy rewrites it internally); en/fr get a URL prefix.
 * Preserves query strings and hash fragments ("/#contact" -> "/en#contact").
 */
export function localizedPath(path: string, locale: Locale): string {
  const match = path.match(/^([^?#]*)([?#].*)?$/);
  const pathname = stripLocalePrefix(match?.[1] || "/");
  const suffix = match?.[2] ?? "";
  if (locale === defaultLocale) return `${pathname}${suffix}`;
  const prefixed = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return `${prefixed}${suffix}`;
}
