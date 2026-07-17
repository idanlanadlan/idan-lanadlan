import type { Locale } from "./translations";

const NUMBER_LOCALE: Record<Locale, string> = {
  he: "he-IL",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
};

/** BCP-47 tag for Intl/toLocaleString number formatting per site locale. */
export function numberLocale(locale: Locale): string {
  return NUMBER_LOCALE[locale];
}
