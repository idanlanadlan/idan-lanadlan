"use server";

import Anthropic from "@anthropic-ai/sdk";
import type { BlogPost } from "@/lib/types";
import { getAllBlogPosts } from "@/lib/db";
import { isAdmin } from "@/lib/require-admin";

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

קרא לכלי write_article עם הטיוטה המלאה — אל תחזיר טקסט חופשי.`;

const WRITE_ARTICLE_TOOL: Anthropic.Tool = {
  name: "write_article",
  description: "שומר את טיוטת המאמר שנכתבה",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "כותרת המאמר" },
      slug: { type: "string", description: "latin-url-slug, אותיות קטנות ומקפים בלבד" },
      excerpt: { type: "string", description: "תקציר/meta description קצר, עד כ-155 תווים" },
      content: {
        type: "string",
        description: "גוף המאמר. פסקאות/כותרות מופרדות בשורה ריקה. כותרות ביניים בפורמט '## כותרת'.",
      },
      keywords: {
        type: "array",
        items: { type: "string" },
        description: "5-8 מילות מפתח רלוונטיות בעברית",
      },
    },
    required: ["title", "slug", "excerpt", "content", "keywords"],
  },
};

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

function extractDraft(msg: Anthropic.Message): Partial<BlogPost> | null {
  const toolUse = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
  if (!toolUse) return null;
  const input = toolUse.input as Record<string, unknown>;
  return {
    title: String(input.title ?? ""),
    slug: String(input.slug ?? ""),
    excerpt: String(input.excerpt ?? ""),
    content: String(input.content ?? ""),
    keywords: Array.isArray(input.keywords) ? input.keywords.map(String) : [],
  };
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
  if (!(await isAdmin())) return { ok: false, error: "api_error" };
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
      model: "claude-sonnet-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      tools: [WRITE_ARTICLE_TOOL],
      tool_choice: { type: "tool", name: "write_article" },
    });

    const draft = extractDraft(msg);
    if (!draft) return { ok: false, error: "parse_error" };

    draft.slug = await uniqueSlug(draft.slug ?? "");
    return { ok: true, draft };
  } catch {
    return { ok: false, error: "api_error" };
  }
}
