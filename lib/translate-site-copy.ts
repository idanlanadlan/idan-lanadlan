import Anthropic from "@anthropic-ai/sdk";

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

/**
 * Best-effort translation of an arbitrary bag of short homepage copy
 * strings (headlines, eyebrows, subtitles) into en/fr/es in one call.
 * Returns null on any failure — a failed translation must never block
 * saving the Hebrew text. The schema is built dynamically from the input
 * keys so this works for any set of fields without a dedicated file per
 * section (mirrors translate-about.ts but with a dynamic schema).
 */
export async function translateSiteCopy(
  fields: Record<string, string>
): Promise<{ en: Record<string, string>; fr: Record<string, string>; es: Record<string, string> } | null> {
  const keys = Object.keys(fields).filter((k) => fields[k]?.trim());
  if (keys.length === 0) return null;

  const client = getClient();
  if (!client) return null;

  const localeSchema = {
    type: "object" as const,
    properties: Object.fromEntries(keys.map((k) => [k, { type: "string" as const }])),
    required: keys,
  };

  const TRANSLATE_TOOL: Anthropic.Tool = {
    name: "translate_site_copy",
    description: "שומר את תרגום קטעי הטקסט לאנגלית, לצרפתית ולספרדית",
    input_schema: {
      type: "object",
      properties: { en: localeSchema, fr: localeSchema, es: localeSchema },
      required: ["en", "fr", "es"],
    },
  };

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      system:
        "אתה מתרגם מקצועי לתחום הנדל\"ן היוקרתי, עבור האתר של עידן חולי (\"עידן לנדל\\\"ן\"). תרגם כל שדה בנפרד לאנגלית, לצרפתית ולספרדית באופן טבעי ושיווקי (לא תרגום מילולי מכני) — קצר וקולע, כמו שכתב תוכן מקומי בשפת היעד היה כותב. שמור על אותו טון (כותרת/תווית/משפט). " +
        "קריטי: המילה \"עידן\" בקלט הזה היא כמעט תמיד שם פרטי (Idan) של בעל האתר, לא שם העצם \"תקופה/עידן\" — אל תתרגם אותה למשמעות המילולית. שם המותג \"עידן חולי\" מתועתק תמיד ל-\"Idan Huli\" (לא מתורגם), ו\"עידן לנדל\\\"ן\" מתועתק ל-\"Idan LaNadlan\" (לא \"Idan Real Estate\" או כל תרגום אחר) — בכל שלוש השפות (אנגלית/צרפתית/ספרדית), כולל כששני השמות מופיעים כשתי שורות נפרדות של אותה כותרת. " +
        "קרא לכלי translate_site_copy עם התוצאה המלאה לכל השדות.",
      messages: [{ role: "user", content: JSON.stringify(fields, null, 2) }],
      tools: [TRANSLATE_TOOL],
      tool_choice: { type: "tool", name: "translate_site_copy" },
    });

    const toolUse = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (!toolUse) return null;
    const input = toolUse.input as {
      en?: Record<string, string>;
      fr?: Record<string, string>;
      es?: Record<string, string>;
    };
    if (!input.en || !input.fr || !input.es) return null;
    return { en: input.en, fr: input.fr, es: input.es };
  } catch {
    return null;
  }
}
