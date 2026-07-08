import Anthropic from "@anthropic-ai/sdk";
import type { Property } from "./types";

type SourceFields = Pick<Property, "title" | "description" | "neighborhood" | "city">;

const TRANSLATE_TOOL: Anthropic.Tool = {
  name: "translate_property",
  description: "שומר את תרגום פרטי הנכס לאנגלית ולצרפתית",
  input_schema: {
    type: "object",
    properties: {
      en: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          neighborhood: { type: "string" },
          city: { type: "string" },
        },
        required: ["title", "description", "neighborhood", "city"],
      },
      fr: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          neighborhood: { type: "string" },
          city: { type: "string" },
        },
        required: ["title", "description", "neighborhood", "city"],
      },
    },
    required: ["en", "fr"],
  },
};

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

/**
 * Best-effort translation for a real-estate listing's public-facing text fields.
 * Returns null on any failure (missing key, API error, malformed response) — a
 * failed translation must never block saving the property in Hebrew.
 */
export async function translatePropertyFields(
  fields: SourceFields
): Promise<Partial<Property> | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system:
        "אתה מתרגם מקצועי לתחום הנדל\"ן היוקרתי. תרגם את פרטי הנכס לאנגלית ולצרפתית באופן טבעי ושיווקי (לא תרגום מילולי מכני) — כמו שסוכנות נדל\"ן יוקרתית בתל אביב הייתה כותבת בשפת היעד. שמור על שמות מקומות מוכרים (Tel Aviv, לא תעתיק מלאכותי). קרא לכלי translate_property עם התוצאה.",
      messages: [
        {
          role: "user",
          content: `כותרת: ${fields.title}\nשכונה: ${fields.neighborhood}\nעיר: ${fields.city}\nתיאור: ${fields.description}`,
        },
      ],
      tools: [TRANSLATE_TOOL],
      tool_choice: { type: "tool", name: "translate_property" },
    });

    const toolUse = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (!toolUse) return null;
    const input = toolUse.input as {
      en?: Partial<SourceFields>;
      fr?: Partial<SourceFields>;
    };
    if (!input.en || !input.fr) return null;

    return {
      title_en: String(input.en.title ?? ""),
      description_en: String(input.en.description ?? ""),
      neighborhood_en: String(input.en.neighborhood ?? ""),
      city_en: String(input.en.city ?? ""),
      title_fr: String(input.fr.title ?? ""),
      description_fr: String(input.fr.description ?? ""),
      neighborhood_fr: String(input.fr.neighborhood ?? ""),
      city_fr: String(input.fr.city ?? ""),
    };
  } catch {
    return null;
  }
}
