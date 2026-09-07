"use server";

import Anthropic from "@anthropic-ai/sdk";
import type { BlogPost } from "@/lib/types";
import { getAllBlogPosts } from "@/lib/db";
import { isAdmin } from "@/lib/require-admin";
import { RSS_FEEDS, RE_KEYWORDS, TOPIC_POOL } from "@/lib/blog-sources";

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

// ── Weekly automated draft (app/api/cron/blog) ───────────────────────────────

const WEEKLY_GUIDANCE = `זו טיוטה שבועית אוטומטית לבלוג. הנחיות נוספות:
- קהל היעד רחב: משקיעים, רוכשים למגורים, בעלי נכסים, מוכרי נכסים, יזמים שמעוניינים בשיווק פרויקטים, עולים חדשים, משקיעים יהודים מחו"ל, ותושבי תל אביב. כתוב כך שפסקת הפתיחה תדבר לרובם.
- מיקוד גיאוגרפי: נדל"ן באופן כללי. אם המאמר עוסק באזור מסוים — שיהיה ברובו המוחלט על תל אביב, ואפשר להתפזר לערי המרכז הסמוכות (יפו, בת ים, ראשון לציון, רמת גן, גבעתיים, הרצליה). ירושלים רק אם באמת יש זווית מעניינת.
- אם צירפתי לך כותרות חדשות מהשבוע — בחר זווית אחת עדכנית ורלוונטית לקהל שלנו וכתוב עליה מאמר מקורי (אל תעתיק, אל תסתמך על פרט שלא הופיע בכותרת). אם שום כותרת לא מתאימה לקהל שלנו — בחר נושא ירוק-עד מתוך המאגר שאתן לך.
- אל תשכפל מאמר קיים — אתן לך את רשימת הכותרות שכבר פורסמו.`;

const ITEM_RE = /<item[\s\S]*?<\/item>/gi;
const TAG_RE = (tag: string) =>
  new RegExp(`<${tag}[^>]*>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*<\\/${tag}>`, "i");

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
}

/** Best-effort pull of recent headlines from one RSS feed. Never throws. */
async function fetchFeedHeadlines(
  feed: { name: string; url: string },
  filterByKeyword: boolean
): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; idanlanadlan.co.il/blog-bot)" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const xml = await res.text();
    const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 16; // ~16 days
    const out: string[] = [];
    for (const block of xml.match(ITEM_RE) ?? []) {
      const title = stripTags((block.match(TAG_RE("title"))?.[1] ?? "").trim());
      if (!title) continue;
      const desc = stripTags((block.match(TAG_RE("description"))?.[1] ?? "").slice(0, 300));
      const pub = block.match(TAG_RE("pubDate"))?.[1]?.trim();
      const ts = pub ? Date.parse(pub) : NaN;
      if (!Number.isNaN(ts) && ts < cutoff) continue;
      if (filterByKeyword && !RE_KEYWORDS.some((k) => title.includes(k) || desc.includes(k))) continue;
      out.push(desc ? `${title} — ${desc}` : title);
      if (out.length >= 8) break;
    }
    return out;
  } catch {
    return [];
  }
}

async function weeklyNewsDigest(): Promise<string> {
  const lists = await Promise.all(
    RSS_FEEDS.map((f, i) => fetchFeedHeadlines(f, i > 0))
  );
  const lines: string[] = [];
  RSS_FEEDS.forEach((f, i) => {
    for (const h of lists[i].slice(0, 5)) lines.push(`- [${f.name}] ${h}`);
  });
  return lines.slice(0, 15).join("\n");
}

/**
 * Generates the weekly draft. No admin check — the caller (the cron route)
 * authenticates via CRON_SECRET, and the manual-trigger server action does its
 * own isAdmin() check.
 */
export async function generateWeeklyDraft(): Promise<GenerateResult> {
  const client = getClient();
  if (!client) return { ok: false, error: "not_configured" };

  const [digest, existingTitles] = await Promise.all([
    weeklyNewsDigest(),
    getAllBlogPosts().then((posts) => posts.map((p) => `- ${p.title}`).join("\n")),
  ]);

  const userMessage = [
    WEEKLY_GUIDANCE,
    "",
    digest
      ? `כותרות נדל"ן מהשבוע (מקורות: גלובס, דה מרקר):\n${digest}`
      : 'לא נשלפו כותרות חדשות השבוע — בחר נושא ירוק-עד מהמאגר.',
    "",
    `מאגר נושאים ירוקי-עד (אם אין זווית חדשותית מתאימה, בחר אחד שלא כוסה):\n${TOPIC_POOL.map((t) => `- ${t}`).join("\n")}`,
    "",
    existingTitles ? `מאמרים שכבר פורסמו (אל תשכפל):\n${existingTitles}` : "",
  ].join("\n");

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
