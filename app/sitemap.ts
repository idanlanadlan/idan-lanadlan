import type { MetadataRoute } from "next";
import { getProperties, getPublishedBlogPosts } from "@/lib/db";

const BASE = "https://idanlanadlan.co.il";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE}/nadlan`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const properties = await getProperties();
  const propertyPages = properties
    .filter((p) => p.status === "available")
    .map((p) => ({
      url: `${BASE}/nadlan/${p.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      lastModified: new Date(p.created_at),
    }));

  const blogPosts = await getPublishedBlogPosts();
  const blogPages = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(p.updated_at),
  }));

  return [...staticPages, ...propertyPages, ...blogPages];
}
