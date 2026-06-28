import type { MetadataRoute } from "next";
import { mockBlogPosts, mockProperties } from "@/lib/mock-data";

const BASE = "https://idanlanadlan.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE}/nadlan`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const propertyPages = mockProperties
    .filter((p) => p.status === "available")
    .map((p) => ({
      url: `${BASE}/nadlan/${p.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      lastModified: new Date(p.created_at),
    }));

  const blogPages = mockBlogPosts
    .filter((p) => p.published)
    .map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: new Date(p.updated_at),
    }));

  return [...staticPages, ...propertyPages, ...blogPages];
}
