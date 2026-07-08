"use server";

import Anthropic from "@anthropic-ai/sdk";
import type { BlogPost } from "@/lib/types";
import { getAllBlogPosts } from "@/lib/db";

export type GenerateResult =
  | { ok: true; draft: Partial<BlogPost> }
  | { ok: false; error: "not_configured" | "fetch_error" | "parse_error" | "api_error" };

type GenerateMode = "idea" | "content" | "link";

const SYSTEM_PROMPT = `אתה קופירייטר ומומחה SEO/AEO של "עידן לנדל\"ן" — סוכנות תיווך ושיווק נדל"ן יוקרתי בתל אביב (עידן חולי). הסגנון של האתר יוקרתי-מינימליסטי, שחור-זהב-קרם, בעברית.

המשימה שלך: לכתוב טיוטת מאמר מלאה לבלוג, שממוטבת בו-זמנית ל:
1. SEO (גוגל) — שילוב טבעי (לא stuffing) של מילות מפתח ליבה: "מתווך", "שיווק נדל\"ן", "קניית נכס", "נכסים בתל אביב", בנוסף לכל פרופיל ספציפי (שכונה, טווח תקציב, גודל דירה, מספר חדרים) שמופיע בקלט.
2. AEO (מנועי תשובות כמו ChatGPT/Gemini/Claude) — פסקת פתיחה שעונה ישירות על השאלה/נושא המרכזי (כך שגם אם מנוע AI מצטט רק משפט אחד, הוא יהיה תשובה שלמה ומדויקת), כותרות ביניים ברורות בפורמט "## משפט או שאלה", ולקראת הסוף בלוק שאלות-ותשובות קצר (2-4 שאלות, כל אחת ככותרת "## שאלה" ואחריה תשובה תמציתית).

כללים:
- כתוב מאמר מקורי ומורחב בקול המותג — גם אם קיבלת "מקור השראה" (תוכן קיים או תוכן ממאמר חיצוני), אסור להעתיק אותו כמעט-מילה-במילה. תמיד תכתוב ניסוח, מבנה ודוגמאות משלך.
- סיים בפסקה טבעית (לא אגרסיבית) שמפנה ליצירת קשר עם עידן לנדל"ן.
- הפרד פסקאות/כותרות בשורה ריקה (\\n\\n) — אין תמיכה ב-HTML.
- אורך: 500-900 מילים.
- slug: לטיני בלבד, אותיות קטנות ומקפים, בלי עברית.
- excerpt: תקציר/meta description קצר וממוקד, עד כ-155 תווים.
- keywords: מערך של 5-8 מילות מפתח רלוונטיות (עברית).

החזר אך ורק JSON בפורמט הבא, ללא שום טקסט נוסף:
{
  "title": "כותרת המאמר",
  "slug": "latin-url-slug",
  "excerpt": "תקציר קצר",
  "content": "פסקה ראשונה...\\n\\n## כותרת ביניים\\n\\nפסקה שנייה...",
  "keywords": ["מילת מפתח 1", "מילת מפתח 2"]
}`;

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

function extractDraftJSON(text: string): Partial<BlogPost> | null {
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const objectMatch = text.match(/\{[\s\S]*\}/);
  const raw = blockMatch ? blockMatch[1] : objectMatch ? objectMatch[0] : null;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw.trim()) as Record<string, unknown>;
    return {
      title: String(parsed.title ?? ""),
      slug: String(parsed.slug ?? ""),
      excerpt: String(parsed.excerpt ?? ""),
      content: String(parsed.content ?? ""),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map(String) : [],
    };
  } catch {
    return null;
  }
}

/** Strips HTML down to plain text for use as inspiration source, capped to avoid blowing the context window */
function htmlToText(html: string): string {
  const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const text = noScripts.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.slice(0, 6000);
}

async function buildSourceText(mode: GenerateMode, value: string): Promise<string | { error: "fetch_error" }> {
  if (mode === "idea") return "";
  if (mode === "content") return value;

  // mode === "link"
  try {
    const res = await fetch(value, { headers: { "User-Agent": "idanlanadlan.co.il" } });
    if (!res.ok) return { error: "fetch_error" };
    const html = await res.text();
    return htmlToText(html);
  } catch {
    return { error: "fetch_error" };
  }
}

async function uniqueSlug(base: string): Promise<string> {
  const existing = new Set((await getAllBlogPosts()).map((p) => p.slug));
  if (!existing.has(base) || !base) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export async function generateBlogDraft(mode: GenerateMode, value: string): Promise<GenerateResult> {
  const client = getClient();
  if (!client) return { ok: false, error: "not_configured" };

  const source = await buildSourceText(mode, value);
  if (typeof source !== "string") return { ok: false, error: source.error };

  const userMessage =
    mode === "idea"
      ? `רעיון/נושא למאמר: ${value}`
      : mode === "content"
        ? `תוכן קיים (בסיס/השראה בלבד — כתוב מחדש בקול משלך):\n\n${source}`
        : `תוכן ממאמר חיצוני (השראה בלבד — כתוב מאמר מקורי, אל תעתיק):\n\n${source}`;

  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const draft = extractDraftJSON(text);
    if (!draft) return { ok: false, error: "parse_error" };

    draft.slug = await uniqueSlug(draft.slug ?? "");
    return { ok: true, draft };
  } catch {
    return { ok: false, error: "api_error" };
  }
}
