import Anthropic from "@anthropic-ai/sdk";

export type AboutFields = {
  eyebrow: string;
  heading_line1: string;
  heading_line2: string;
  bio1: string;
  bio2: string;
  bio3: string;
};

const LOCALE_OBJECT_SCHEMA = {
  type: "object" as const,
  properties: {
    eyebrow: { type: "string" as const },
    heading_line1: { type: "string" as const },
    heading_line2: { type: "string" as const },
    bio1: { type: "string" as const },
    bio2: { type: "string" as const },
    bio3: { type: "string" as const },
  },
  required: ["eyebrow", "heading_line1", "heading_line2", "bio1", "bio2", "bio3"],
};

const TRANSLATE_TOOL: Anthropic.Tool = {
  name: "translate_about",
  description: "שומר את תרגום עמוד האודות לאנגלית, לצרפתית ולספרדית",
  input_schema: {
    type: "object",
    properties: { en: LOCALE_OBJECT_SCHEMA, fr: LOCALE_OBJECT_SCHEMA, es: LOCALE_OBJECT_SCHEMA },
    required: ["en", "fr", "es"],
  },
};

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

/**
 * Best-effort translation of the About page's headline + bio fields.
 * Returns null on any failure — a failed translation must never block
 * saving the Hebrew content.
 */
export async function translateAboutFields(fields: AboutFields): Promise<{
  en: AboutFields;
  fr: AboutFields;
  es: AboutFields;
} | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      system:
        "אתה מתרגם מקצועי לתחום הנדל\"ן היוקרתי. תרגם את עמוד ה'אודות' של מתווך לאנגלית, לצרפתית ולספרדית באופן טבעי ושיווקי (לא תרגום מילולי מכני) — כמו שכתב תוכן מקומי בשפת היעד היה כותב, בגוף ראשון. שמור על הטון האישי והמקצועי. קרא לכלי translate_about עם התוצאה המלאה.",
      messages: [
        {
          role: "user",
          content: `תווית עילית: ${fields.eyebrow}\n\nכותרת שורה 1: ${fields.heading_line1}\nכותרת שורה 2: ${fields.heading_line2}\n\nביו פסקה 1: ${fields.bio1}\nביו פסקה 2: ${fields.bio2}\nביו פסקה 3: ${fields.bio3}`,
        },
      ],
      tools: [TRANSLATE_TOOL],
      tool_choice: { type: "tool", name: "translate_about" },
    });

    const toolUse = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (!toolUse) return null;
    const input = toolUse.input as { en?: AboutFields; fr?: AboutFields; es?: AboutFields };
    if (!input.en || !input.fr || !input.es) return null;
    return { en: input.en, fr: input.fr, es: input.es };
  } catch {
    return null;
  }
}
