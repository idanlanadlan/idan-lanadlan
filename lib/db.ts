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
  hero_subtitle_he: "מלווים כל עסקת נדל״ן — ממכירה ועד קנייה, מדירה ועד פרויקט.",
  hero_subtitle_en: "Guiding every real estate deal — from selling to buying, from apartment to project.",
  hero_subtitle_fr: "Nous accompagnons chaque transaction immobilière — de la vente à l'achat, de l'appartement au projet.",
  hero_subtitle_es: "Te acompañamos en cada operación inmobiliaria — de la venta a la compra, del piso al proyecto.",

  // Homepage section headings — editable in admin/settings ("כותרות עמוד
  // הבית"). Only the Hebrew (_he) values are seeded here; en/fr/es are
  // populated by translateSiteCopy() on first save. Until then, components
  // fall back to the matching static translations.ts value (see
  // lib/site-copy.ts) so nothing breaks with only _he present.
  hero_eyebrow_he: 'הירקון 319, נמל ת"א',
  hero_line1_he: "עידן חולי",
  hero_line2_he: "עידן לנדל״ן",
  properties_eyebrow_he: "הפורטפוליו שלנו",
  properties_title_he: "נכסים",
  snippet_eyebrow_he: "אודות",
  snippet_quote_he: "עסקת נדל״ן טובה\nמשנה חיים.",
  testimonials_eyebrow_he: "לקוחות מדברים",
  testimonials_title_he: "מה אומרים עלינו",
  cta_eyebrow_he: "מוכנים לצעד הבא?",
  cta_title1_he: "בואו נמצא את",
  cta_title2_he: "הנכס המושלם שלכם",
  cta_subtitle_he: "מוכרים, קונים, משכירים או מחפשים השקעה — עידן חולי כאן לענות על כל שאלה.",
  blog_eyebrow_he: "נכסים של ידע",
  blog_title_he: "מדריכים ועדכונים חמים",
  map_eyebrow_he: "מפת הנכסים",
  map_title_he: "הנכסים שלנו על המפה",
  map_subtitle_he: "כל נכס ממוקם במפה לפי כתובתו המדויקת — לחצו על סמן לפרטי הנכס.",
  social_eyebrow_he: "עקבו אחרינו",
  social_title_he: "ברשתות החברתיות",
  faq_eyebrow_he: "שאלות ותשובות",
  faq_title_he: 'שאלות נפוצות בנדל"ן',
  faq_subtitle_he: 'תשובות לשאלות הכי נפוצות בעסקאות נדל"ן בישראל',

  // About page — headline + bio. Hebrew is the source of truth (edited in
  // admin); en/fr/es are auto-translated on save (see translate-about.ts)
  // but stored here too so a failed translation never blanks the page.
  about_eyebrow_he: "אודות",
  about_eyebrow_en: "About",
  about_eyebrow_fr: "À propos",
  about_eyebrow_es: "Sobre mí",
  about_heading_line1_he: "עידן חולי",
  about_heading_line1_en: "Idan Huli",
  about_heading_line1_fr: "Idan Huli",
  about_heading_line1_es: "Idan Huli",
  about_heading_line2_he: "עידן לנדל״ן",
  about_heading_line2_en: "Idan LaNadlan",
  about_heading_line2_fr: "Idan LaNadlan",
  about_heading_line2_es: "Idan LaNadlan",
  about_bio1_he: "אחרי כעשור של ליווי לקוחות בתהליכי קבלת החלטות פיננסיות ובהשקעות נדל״ן פרטיות, הפכתי את התשוקה לקריירה מלאה: למצוא לכם בית נכון או השקעה נכונה — עסקה שמשנה חיים.",
  about_bio1_en: "After about a decade guiding clients through major financial decisions and private real estate investments, I turned my passion into a full-time career: finding you the right home or the right investment — a deal that changes lives.",
  about_bio1_fr: "Après environ une décennie à accompagner des clients dans leurs décisions financières majeures et leurs investissements immobiliers privés, j'ai fait de ma passion une carrière à part entière : trouver pour vous le bon logement ou le bon investissement — une transaction qui change une vie.",
  about_bio1_es: "Después de casi una década acompañando a clientes en decisiones financieras importantes e inversiones inmobiliarias privadas, convertí mi pasión en una carrera completa: encontrarte la casa correcta o la inversión correcta — una operación que cambia vidas.",
  about_bio2_he: "אני מאמין בשקיפות מלאה, חשיבה יצירתית בעסקאות מורכבות, ונחישות להביא תוצאה איפה שאחרים נופלים.",
  about_bio2_en: "I believe in full transparency, creative thinking on complex deals, and the determination to deliver results where others fall short.",
  about_bio2_fr: "Je crois en la transparence totale, à la créativité face aux transactions complexes, et à la détermination d'obtenir des résultats là où d'autres échouent.",
  about_bio2_es: "Creo en la transparencia total, el pensamiento creativo en operaciones complejas y la determinación de lograr resultados donde otros fallan.",
  about_bio3_he: "וכשאני לא בשטח? אני בעלה של ויקטוריה ואבא של אליה, אלאור ואלדר — וזה מזכיר לי למה אני עובד עם לב.",
  about_bio3_en: "And when I'm not out in the field? I'm husband to Victoria and father to Elia, Elor and Eldar — a reminder of why I work with heart.",
  about_bio3_fr: "Et quand je ne suis pas sur le terrain? Je suis l'époux de Victoria et le père d'Elia, Elor et Eldar — un rappel de pourquoi je travaille avec cœur.",
  about_bio3_es: "¿Y cuando no estoy en el terreno? Soy esposo de Victoria y padre de Elia, Elor y Eldar — un recordatorio de por qué trabajo con el corazón.",
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
  return ((data ?? []) as unknown[]).map(normalizeProperty);
}

function normalizeProperty(data: unknown): Property {
  const p = data as Record<string, unknown>;
  let images = p.images;
  if (typeof images === "string") {
    try { images = JSON.parse(images); } catch { images = []; }
  }
  if (!Array.isArray(images)) images = [];
  return { ...p, images } as Property;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (!isConfigured) return mockProperties.find((p) => p.id === id) ?? null;
  const { data, error } = await createClient()
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return normalizeProperty(data);
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
  return ((data ?? []) as unknown[]).map(normalizeProperty);
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
  const posts = (data as BlogPost[]) ?? [];
  return posts.length > 0 ? posts : mockBlogPosts.filter((p) => p.published);
}

/** Homepage preview picks: published posts explicitly marked to show there.
 *  Falls back to the 3 most recent published posts if the `featured` column
 *  hasn't been migrated yet, or if nothing is marked featured. */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  if (!isConfigured) return mockBlogPosts.filter((p) => p.published).slice(0, 3);
  const { data, error } = await createClient()
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(3);
  const posts = error ? [] : ((data as BlogPost[]) ?? []);
  return posts.length > 0 ? posts : (await getPublishedBlogPosts()).slice(0, 3);
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
  return (data as BlogPost) ?? mockBlogPosts.find((p) => p.slug === slug) ?? null;
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
