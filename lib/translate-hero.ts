import Anthropic from "@anthropic-ai/sdk";

const TRANSLATE_TOOL: Anthropic.Tool = {
  name: "translate_hero_subtitle",
  description: "שומר את תרגום משפט הפתיחה של דף הבית לאנגלית, לצרפתית ולספרדית",
  input_schema: {
    type: "object",
    properties: {
      en: { type: "string" },
      fr: { type: "string" },
      es: { type: "string" },
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
 * Best-effort translation of the homepage hero subtitle. Returns null on
 * any failure — a failed translation must never block saving the Hebrew text.
 */
export async function translateHeroSubtitle(
  subtitle: string
): Promise<{ en: string; fr: string; es: string } | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 512,
      system:
        "אתה מתרגם מקצועי לתחום הנדל\"ן היוקרתי. תרגם את משפט הפתיחה (tagline) של מתווך נדל\"ן לאנגלית, לצרפתית ולספרדית באופן טבעי ושיווקי (לא תרגום מילולי מכני) — קצר, קולע, ותופס עין, כמו שכתב תוכן מקומי בשפת היעד היה כותב. קרא לכלי translate_hero_subtitle עם התוצאה.",
      messages: [{ role: "user", content: subtitle }],
      tools: [TRANSLATE_TOOL],
      tool_choice: { type: "tool", name: "translate_hero_subtitle" },
    });

    const toolUse = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (!toolUse) return null;
    const input = toolUse.input as { en?: string; fr?: string; es?: string };
    if (!input.en || !input.fr || !input.es) return null;
    return { en: input.en, fr: input.fr, es: input.es };
  } catch {
    return null;
  }
}
