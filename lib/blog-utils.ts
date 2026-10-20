import type { BlogPost } from "./types";
import type { Locale } from "./translations";

/** Picks the translated blog field for the given locale, falling back to Hebrew if missing. */
export function localizedBlogField(
  p: BlogPost,
  field: "title" | "excerpt" | "content" | "cover_image_alt",
  locale: Locale
): string {
  if (locale === "he") return p[field] ?? "";
  const key = `${field}_${locale}` as keyof BlogPost;
  return (p[key] as string | undefined) || (p[field] ?? "");
}

/** Size of covers made by lib/blog-image.ts. Hand-uploaded covers have unknown dimensions. */
export const COVER_WIDTH = 1600;
export const COVER_HEIGHT = 900;

/** True for covers generated and stored by lib/blog-image.ts (so their pixel size is known). */
export function isGeneratedCover(url: string): boolean {
  return url.includes("/blog-images/");
}

/** Picks the translated keyword list for the given locale, falling back to Hebrew if missing/empty. */
export function localizedBlogKeywords(p: BlogPost, locale: Locale): string[] {
  if (locale === "he") return p.keywords;
  const key = `keywords_${locale}` as keyof BlogPost;
  const translated = p[key] as string[] | undefined;
  return translated && translated.length > 0 ? translated : p.keywords;
}
