import type { BlogPost } from "./types";
import type { Locale } from "./translations";

/** Picks the translated blog field for the given locale, falling back to Hebrew if missing. */
export function localizedBlogField(
  p: BlogPost,
  field: "title" | "excerpt" | "content",
  locale: Locale
): string {
  if (locale === "he") return p[field];
  const key = `${field}_${locale}` as keyof BlogPost;
  return (p[key] as string | undefined) || p[field];
}

/** Picks the translated keyword list for the given locale, falling back to Hebrew if missing/empty. */
export function localizedBlogKeywords(p: BlogPost, locale: Locale): string[] {
  if (locale === "he") return p.keywords;
  const key = `keywords_${locale}` as keyof BlogPost;
  const translated = p[key] as string[] | undefined;
  return translated && translated.length > 0 ? translated : p.keywords;
}
