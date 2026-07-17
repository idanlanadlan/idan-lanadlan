import type { MetadataRoute } from "next";
import { getProperties, getPublishedBlogPosts } from "@/lib/db";

const BASE = "https://idanlanadlan.co.il";

// Hebrew is prefix-free; en/fr/es live under a URL prefix (see proxy.ts).
function urlFor(path: string, locale: "he" | "en" | "fr" | "es"): string {
  const prefix = locale === "he" ? "" : `/${locale}`;
  return `${BASE}${prefix}${path}`;
}

function alternatesFor(path: string) {
  return {
    languages: {
      he: urlFor(path, "he"),
      en: urlFor(path, "en"),
      fr: urlFor(path, "fr"),
      es: urlFor(path, "es"),
      "x-default": urlFor(path, "he"),
    },
  };
}

/** One sitemap entry per locale, each carrying the full hreflang set. */
function localizedEntries(
  path: string,
  extra: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number; lastModified?: Date }
): MetadataRoute.Sitemap {
  return (["he", "en", "fr", "es"] as const).map((locale) => ({
    url: urlFor(path, locale),
    alternates: alternatesFor(path),
    ...extra,
  }));
}

const TOOLBOX_SLUGS = [
  "roi-calculator",
  "mortgage-calculator",
  "tax-simulator",
  "buy-vs-rent",
  "inspection-checklist",
  "property-match",
  "gush-helka",
  "glossary",
  "oleh-tax",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    ...localizedEntries("", { changeFrequency: "weekly", priority: 1 }),
    ...localizedEntries("/nadlan", { changeFrequency: "daily", priority: 0.9 }),
    ...localizedEntries("/blog", { changeFrequency: "weekly", priority: 0.8 }),
    ...localizedEntries("/about", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntries("/contact", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntries("/toolbox", { changeFrequency: "monthly", priority: 0.7 }),
    ...TOOLBOX_SLUGS.flatMap((slug) =>
      localizedEntries(`/toolbox/${slug}`, { changeFrequency: "monthly", priority: 0.6 })
    ),
  ];

  const properties = await getProperties();
  const propertyPages = properties
    .filter((p) => p.status === "available")
    .flatMap((p) =>
      localizedEntries(`/nadlan/${p.id}`, {
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: new Date(p.created_at),
      })
    );

  const blogPosts = await getPublishedBlogPosts();
  const blogPages = blogPosts.flatMap((p) =>
    localizedEntries(`/blog/${p.slug}`, {
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: new Date(p.updated_at),
    })
  );

  return [...staticPages, ...propertyPages, ...blogPages];
}
