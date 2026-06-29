import { mockProperties, mockBlogPosts } from "./mock-data";
import { createClient, createAdminClient, isConfigured } from "./supabase";
import type { Property, BlogPost } from "./types";

// ── Settings ──────────────────────────────────────────────
export const DEFAULT_SETTINGS: Record<string, string> = {
  phone: "054-979-1171",
  phone_raw: "972549791171",
  email: "idanlanadlan@gmail.com",
  whatsapp: "972549791171",
  whatsapp_catalog: "https://wa.me/c/972549791171",
  facebook: "https://www.facebook.com/profile.php?id=100086018108373",
  tiktok: "https://www.tiktok.com/@idan.lanadlan",
  linkedin: "https://www.linkedin.com/in/idan-huli/",
  instagram: "https://www.instagram.com/idan.huli",
  maps_url: "https://maps.app.goo.gl/RG3BgZUUxTh1g9u89",
  address: "הירקון 319, נמל תל אביב",
  about_snippet: "כעשור של ניסיון בשוק הנדל״ן בתל אביב וסביבתה. מתמחה בנכסי יוקרה, דירות ופרויקטים חדשים.",
  hero_subtitle_he: "מומחה לנדל״ן יוקרה בתל אביב וסביבתה. ליווי אישי, שיווק חכם ותוצאות שמדברות בעד עצמן.",
  hero_subtitle_en: "Luxury real estate expert in Tel Aviv. Personal guidance and results that speak for themselves.",
  hero_subtitle_fr: "Expert en immobilier de luxe à Tel Aviv. Accompagnement personnel et résultats probants.",
};

export async function getSettings(): Promise<Record<string, string>> {
  if (!isConfigured) return DEFAULT_SETTINGS;
  const { data } = await createClient().from("site_settings").select("key, value");
  const fromDb: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    fromDb[row.key] = row.value;
  });
  return { ...DEFAULT_SETTINGS, ...fromDb };
}

export async function upsertSettings(settings: Record<string, string>): Promise<void> {
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await createAdminClient()
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

// ── Blog posts ────────────────────────────────────────────

export async function getProperties(): Promise<Property[]> {
  if (!isConfigured) return mockProperties;
  const { data } = await createClient()
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Property[]) ?? [];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (!isConfigured) return mockProperties.find((p) => p.id === id) ?? null;
  const { data } = await createClient()
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  return (data as Property) ?? null;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  if (!isConfigured) return mockProperties.filter((p) => p.featured && p.status === "available");
  const { data } = await createClient()
    .from("properties")
    .select("*")
    .eq("featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(6);
  return (data as Property[]) ?? [];
}

export async function createProperty(property: Omit<Property, "id" | "created_at">): Promise<Property> {
  const { data, error } = await createAdminClient()
    .from("properties")
    .insert([property])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Property;
}

export async function updateProperty(id: string, property: Partial<Omit<Property, "id" | "created_at">>): Promise<Property> {
  const { data, error } = await createAdminClient()
    .from("properties")
    .update(property)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await createAdminClient()
    .from("properties")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Blog posts ────────────────────────────────────────────

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!isConfigured) return mockBlogPosts.filter((p) => p.published);
  const { data } = await createClient()
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return (data as BlogPost[]) ?? [];
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!isConfigured) return mockBlogPosts;
  const { data } = await createAdminClient()
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as BlogPost[]) ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isConfigured) return mockBlogPosts.find((p) => p.slug === slug) ?? null;
  const { data } = await createClient()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return (data as BlogPost) ?? null;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  if (!isConfigured) return mockBlogPosts.find((p) => p.id === id) ?? null;
  const { data } = await createAdminClient()
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  return (data as BlogPost) ?? null;
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "created_at" | "updated_at">): Promise<BlogPost> {
  const { data, error } = await createAdminClient()
    .from("blog_posts")
    .insert([post])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as BlogPost;
}

export async function updateBlogPost(id: string, post: Partial<Omit<BlogPost, "id" | "created_at">>): Promise<BlogPost> {
  const { data, error } = await createAdminClient()
    .from("blog_posts")
    .update({ ...post, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await createAdminClient().from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
