import Anthropic from "@anthropic-ai/sdk";
import type { Property } from "./types";

type SourceFields = Pick<Property, "title" | "description" | "neighborhood" | "city" | "address">;

const LOCALE_OBJECT_SCHEMA = {
  type: "object" as const,
  properties: {
    title: { type: "string" as const },
    description: { type: "string" as const },
    neighborhood: { type: "string" as const },
    city: { type: "string" as const },
    address: {
      type: "string" as const,
      description:
        "תעתיק פונטי לאותיות לטיניות של הכתובת המדויקת (רחוב ומספר) — לא תרגום משמעות. למשל 'HaNevi'im St 32' — כך שדובר השפה יוכל לקרוא/לבטא את שם הרחוב העברי, אבל עדיין יזהה שזו אותה כתובת אם ינווט אליה.",
    },
  },
  required: ["title", "description", "neighborhood", "city", "address"],
};

const TRANSLATE_TOOL: Anthropic.Tool = {
  name: "translate_property",
  description: "שומר את תרגום פרטי הנכס לאנגלית, לצרפתית ולספרדית",
  input_schema: {
    type: "object",
    properties: {
      en: LOCALE_OBJECT_SCHEMA,
      fr: LOCALE_OBJECT_SCHEMA,
      es: LOCALE_OBJECT_SCHEMA,
    },
    required: ["en", "fr", "es"],
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
        "אתה מתרגם מקצועי לתחום הנדל\"ן היוקרתי. תרגם את פרטי הנכס לאנגלית, לצרפתית ולספרדית באופן טבעי ושיווקי (לא תרגום מילולי מכני) — כמו שסוכנות נדל\"ן יוקרתית בתל אביב הייתה כותבת בשפת היעד. שמור על שמות מקומות מוכרים (Tel Aviv, לא תעתיק מלאכותי). לשדה הכתובת בלבד: אל תתרגם את המשמעות — תעתק פונטית לאותיות לטיניות (כמו ששלט רחוב או Waze היו מציגים), כדי שהכתובת עדיין תהיה ניתנת לזיהוי וניווט במציאות. קרא לכלי translate_property עם התוצאה.",
      messages: [
        {
          role: "user",
          content: `כותרת: ${fields.title}\nשכונה: ${fields.neighborhood}\nעיר: ${fields.city}\nכתובת: ${fields.address}\nתיאור: ${fields.description}`,
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
      es?: Partial<SourceFields>;
    };
    if (!input.en || !input.fr || !input.es) return null;

    return {
      title_en: String(input.en.title ?? ""),
      description_en: String(input.en.description ?? ""),
      neighborhood_en: String(input.en.neighborhood ?? ""),
      city_en: String(input.en.city ?? ""),
      address_en: String(input.en.address ?? ""),
      title_fr: String(input.fr.title ?? ""),
      description_fr: String(input.fr.description ?? ""),
      neighborhood_fr: String(input.fr.neighborhood ?? ""),
      city_fr: String(input.fr.city ?? ""),
      address_fr: String(input.fr.address ?? ""),
      title_es: String(input.es.title ?? ""),
      description_es: String(input.es.description ?? ""),
      neighborhood_es: String(input.es.neighborhood ?? ""),
      city_es: String(input.es.city ?? ""),
      address_es: String(input.es.address ?? ""),
    };
  } catch {
    return null;
  }
}
