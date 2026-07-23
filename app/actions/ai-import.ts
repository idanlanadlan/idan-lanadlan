"use server";

import Anthropic from "@anthropic-ai/sdk";
import { isAdmin } from "@/lib/require-admin";
import type { Property } from "@/lib/types";

type PropertyData = Omit<Property, "id" | "created_at">;

export type AIParseResult =
  | { ok: true; property: PropertyData }
  | { ok: false; error: "not_configured" | "parse_error" | "api_error" };

const EXTRACTION_PROMPT = `אתה מומחה נדל"ן שמחלץ נתונים ממודעות נכסים.
החזר JSON בלבד, ללא הסבר, בפורמט הבא:
{
  "title": "כותרת תיאורית של הנכס",
  "price": 4500000,
  "type": "sale",
  "bedrooms": 4,
  "bathrooms": 2,
  "toilets": 1,
  "size_sqm": 120,
  "balcony_sqm": 10,
  "floor": 5,
  "parking_spots": 1,
  "has_mamad": true,
  "has_shelter": false,
  "has_elevator": true,
  "address": "רחוב הירקון 100",
  "neighborhood": "נמל",
  "city": "תל אביב",
  "description": "תיאור מפורט של הנכס"
}

חוקים:
- type: "sale"=מכירה, "rent"=השכרה, "project"=פרויקט/בנייה חדשה
- price: מספר שלם בשקלים בלבד (ללא ₪, ללא פסיקים)
- שדות חסרים/לא ידועים: bedrooms/bathrooms/floor → 0, size_sqm → 0, שדות טקסט → ""
- toilets/balcony_sqm/parking_spots: אם לא מוזכרים במקור, השאר null (אל תנחש)
- has_mamad/has_shelter/has_elevator: true רק אם מוזכר מפורשות במקור, אחרת false
- אל תמציא נתונים שאינם מופיעים במקור`;

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

function buildProperty(parsed: Record<string, unknown>): PropertyData {
  const type = String(parsed.type ?? "sale");
  return {
    title: String(parsed.title ?? "נכס ללא כותרת"),
    price: Number(parsed.price ?? 0),
    type: (["sale", "rent", "project"].includes(type) ? type : "sale") as Property["type"],
    bedrooms: Number(parsed.bedrooms ?? 0),
    bathrooms: Number(parsed.bathrooms ?? 0),
    toilets: parsed.toilets != null ? Number(parsed.toilets) : undefined,
    size_sqm: Number(parsed.size_sqm ?? 0),
    balcony_sqm: parsed.balcony_sqm != null ? Number(parsed.balcony_sqm) : undefined,
    floor: parsed.floor != null && Number(parsed.floor) !== 0 ? Number(parsed.floor) : undefined,
    parking_spots: parsed.parking_spots != null ? Number(parsed.parking_spots) : undefined,
    has_mamad: parsed.has_mamad === true,
    has_shelter: parsed.has_shelter === true,
    has_elevator: parsed.has_elevator === true,
    address: String(parsed.address ?? ""),
    neighborhood: String(parsed.neighborhood ?? ""),
    city: String(parsed.city ?? ""),
    description: String(parsed.description ?? ""),
    images: [],
    status: "available",
    featured: false,
  };
}

function extractJSON(text: string): PropertyData | null {
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const objectMatch = text.match(/\{[\s\S]*\}/);
  const raw = blockMatch ? blockMatch[1] : objectMatch ? objectMatch[0] : null;
  if (!raw) return null;
  try {
    return buildProperty(JSON.parse(raw.trim()) as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function parsePropertyFromImage(
  base64: string,
  mimeType: string
): Promise<AIParseResult> {
  if (!(await isAdmin())) return { ok: false, error: "api_error" };
  const client = getClient();
  if (!client) return { ok: false, error: "not_configured" };

  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: base64,
              },
            },
            {
              type: "text",
              text: EXTRACTION_PROMPT + "\n\nחלץ את נתוני הנכס מצילום המסך.",
            },
          ],
        },
      ],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const property = extractJSON(text);
    if (!property) return { ok: false, error: "parse_error" };
    return { ok: true, property };
  } catch {
    return { ok: false, error: "api_error" };
  }
}

export async function parsePropertyFromText(text: string): Promise<AIParseResult> {
  if (!(await isAdmin())) return { ok: false, error: "api_error" };
  const client = getClient();
  if (!client) return { ok: false, error: "not_configured" };

  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${EXTRACTION_PROMPT}\n\nחלץ נתוני נכס מהמודעה הבאה:\n\n${text}`,
        },
      ],
    });

    const responseText = msg.content[0].type === "text" ? msg.content[0].text : "";
    const property = extractJSON(responseText);
    if (!property) return { ok: false, error: "parse_error" };
    return { ok: true, property };
  } catch {
    return { ok: false, error: "api_error" };
  }
}
