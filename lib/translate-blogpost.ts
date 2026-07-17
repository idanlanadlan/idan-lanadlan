import Anthropic from "@anthropic-ai/sdk";
import type { BlogPost } from "./types";

type SourceFields = Pick<BlogPost, "title" | "excerpt" | "content" | "keywords">;

const LANG_FIELDS = {
  type: "object" as const,
  properties: {
    title: { type: "string" as const },
    excerpt: { type: "string" as const },
    content: { type: "string" as const },
    keywords: { type: "array" as const, items: { type: "string" as const } },
  },
  required: ["title", "excerpt", "content", "keywords"],
};

const TRANSLATE_TOOL: Anthropic.Tool = {
  name: "translate_blog_post",
  description: "שומר את תרגום מאמר הבלוג לאנגלית, לצרפתית ולספרדית",
  input_schema: {
    type: "object",
    properties: { en: LANG_FIELDS, fr: LANG_FIELDS, es: LANG_FIELDS },
    required: ["en", "fr", "es"],
  },
};

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

/**
 * Best-effort translation for a blog post's public-facing fields. Returns
 * null on any failure (missing key, API error, malformed response, or
 * truncated output) — a failed translation must never block saving/publishing
 * the post in Hebrew.
 */
export async function translateBlogPostFields(
  fields: SourceFields
): Promise<Partial<BlogPost> | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 8192,
      system:
        "אתה מתרגם מקצועי לתחום הנדל\"ן היוקרתי, ועורך תוכן SEO. תרגם את מאמר הבלוג המלא לאנגלית, לצרפתית ולספרדית באופן טבעי ושיווקי (לא תרגום מילולי מכני) — כמו שכתב תוכן מקומי בשפת היעד היה כותב. שמור במדויק על מבנה הכותרות של המאמר (שורות שמתחילות ב-## או ###) ועל חלוקת הפסקאות המקורית. תרגם את מילות המפתח (keywords) להתאמה אמיתית למונחי חיפוש בשפת היעד — לא תרגום מילולי של כל מילה. שמור על שמות מקומות מוכרים (Tel Aviv, לא תעתיק מלאכותי). קרא לכלי translate_blog_post עם התוצאה המלאה.",
      messages: [
        {
          role: "user",
          content: `כותרת: ${fields.title}\n\nתקציר: ${fields.excerpt}\n\nמילות מפתח: ${fields.keywords.join(", ")}\n\nתוכן מלא:\n${fields.content}`,
        },
      ],
      tools: [TRANSLATE_TOOL],
      tool_choice: { type: "tool", name: "translate_blog_post" },
    });

    const toolUse = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (!toolUse) return null;
    const input = toolUse.input as {
      en?: Partial<SourceFields>;
      fr?: Partial<SourceFields>;
      es?: Partial<SourceFields>;
    };
    if (!input.en || !input.fr || !input.es) return null;

    return {
      title_en: String(input.en.title ?? ""),
      excerpt_en: String(input.en.excerpt ?? ""),
      content_en: String(input.en.content ?? ""),
      keywords_en: Array.isArray(input.en.keywords) ? input.en.keywords.map(String) : [],
      title_fr: String(input.fr.title ?? ""),
      excerpt_fr: String(input.fr.excerpt ?? ""),
      content_fr: String(input.fr.content ?? ""),
      keywords_fr: Array.isArray(input.fr.keywords) ? input.fr.keywords.map(String) : [],
      title_es: String(input.es.title ?? ""),
      excerpt_es: String(input.es.excerpt ?? ""),
      content_es: String(input.es.content ?? ""),
      keywords_es: Array.isArray(input.es.keywords) ? input.es.keywords.map(String) : [],
    };
  } catch {
    return null;
  }
}
