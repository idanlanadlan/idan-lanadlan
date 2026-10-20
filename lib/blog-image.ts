import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { createAdminClient, isConfigured } from "./supabase";
import { createBlogPost } from "./db";
import type { BlogPost } from "./types";
import { COVER_WIDTH, COVER_HEIGHT } from "./blog-utils";

// Cover images for blog posts: written for by Claude together with the article
// (image_prompt + cover_alt), drawn by a Gemini image model, compressed with
// sharp and stored in a public Supabase bucket. Every step here fails soft
// (returns null) — a missing key, timeout or storage error must never stop the
// weekly draft from being saved.

const BUCKET = "blog-images";
const DEFAULT_IMAGE_MODEL = "gemini-3.1-flash-image";
const GENERATE_TIMEOUT_MS = 45_000;

/** Shared with the article-writing prompt so both paths describe pictures the same way. */
export const IMAGE_PROMPT_RULES = `- image_prompt: תיאור באנגלית (2-4 משפטים) של תמונת שער למאמר, שמתאימה לנושא שלו. צילום עריכה ריאליסטי (editorial photography), אור ים-תיכוני חם ואדריכלות תל אביבית (באוהאוס, אבן גיר, חזיתות, גגות, קו הים), פלטת צבעים חמה: אבן גיר, כחול-דיו עמוק ופליז/זהב עדין. הנושא במרכז הקומפוזיציה עם שוליים נקיים (התמונה נחתכת ליחס רחב באתר). בלי טקסט, אותיות, מספרים, לוגואים או סימני מים בתוך התמונה, ובלי פנים מזוהות של בני אדם (אם יש אנשים — מרחוק או מאחור).
- cover_alt: טקסט חלופי לתמונה בעברית, עד 125 תווים. מתאר מה שרואים בפועל בתמונה (לא את הכותרת), משלב את מילת המפתח המרכזית באופן טבעי, ולא מתחיל ב"תמונה של".`;

export async function generateCoverImage(prompt: string): Promise<Buffer | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !prompt.trim()) return null;

  const model = process.env.GEMINI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GENERATE_TIMEOUT_MS);
  try {
    const ai = new GoogleGenAI({ apiKey });
    const res = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
        // The legacy 2.5 image model rejects imageSize; newer ones default to 1K,
        // which is too small for a 1600px-wide cover.
        imageConfig: model.includes("2.5")
          ? { aspectRatio: "16:9" }
          : { aspectRatio: "16:9", imageSize: "2K" },
        abortSignal: controller.signal,
      },
    });
    const b64 = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;
    if (!b64) {
      console.error("Gemini image: response had no image part");
      return null;
    }
    // JPEG (not WebP) so WhatsApp / Facebook / LinkedIn previews always work;
    // next/image serves AVIF/WebP to browsers on top of this. sharp drops EXIF
    // and other metadata by default.
    return await sharp(Buffer.from(b64, "base64"))
      .resize(COVER_WIDTH, COVER_HEIGHT, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toBuffer();
  } catch (err) {
    console.error("Gemini image generation failed:", err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Uploads to the public blog-images bucket under a keyword filename; returns the public URL. */
export async function uploadBlogCover(slug: string, jpeg: Buffer): Promise<string | null> {
  if (!isConfigured) return null;
  try {
    const client = createAdminClient();
    // Auto-create the public bucket on first use (same approach as /api/upload-images).
    await client.storage.createBucket(BUCKET, { public: true }).catch(() => {});

    const base =
      slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "post";
    // Random suffix: a regenerated cover gets a new URL, so no CDN/browser cache serves the old one.
    const name = `${base}-cover-${Math.random().toString(36).slice(2, 8)}.jpg`;

    const { error } = await client.storage
      .from(BUCKET)
      .upload(name, jpeg, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
    if (error) {
      console.error("Blog cover upload failed:", error.message);
      return null;
    }
    return client.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  } catch (err) {
    console.error("Blog cover upload failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Generate + upload in one go. Returns the public URL, or null if any step failed. */
export async function createCoverFromPrompt(slug: string, prompt: string): Promise<string | null> {
  const jpeg = await generateCoverImage(prompt);
  return jpeg ? uploadBlogCover(slug, jpeg) : null;
}

/** For "regenerate": asks Claude for a fresh image prompt + alt text from an existing article's text. */
export async function craftImagePrompt(
  title: string,
  excerpt: string,
  keywords: string[]
): Promise<{ image_prompt: string; cover_alt: string } | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  try {
    const msg = await new Anthropic({ apiKey: key }).messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: `אתה עורך תמונות של "עידן לנדל\"ן" (נדל"ן יוקרתי בתל אביב). בהינתן מאמר, כתוב תיאור לתמונת שער חדשה ומקורית שלו.\n${IMAGE_PROMPT_RULES}\nקרא לכלי cover_image עם התוצאה.`,
      messages: [
        { role: "user", content: `כותרת: ${title}\nתקציר: ${excerpt}\nמילות מפתח: ${keywords.join(", ")}` },
      ],
      tools: [
        {
          name: "cover_image",
          description: "שומר את תיאור תמונת השער",
          input_schema: {
            type: "object",
            properties: {
              image_prompt: { type: "string", description: "English scene description for the image model" },
              cover_alt: { type: "string", description: "טקסט חלופי בעברית, עד 125 תווים" },
            },
            required: ["image_prompt", "cover_alt"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "cover_image" },
    });
    const tool = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (!tool) return null;
    const input = tool.input as Record<string, unknown>;
    const image_prompt = String(input.image_prompt ?? "").trim();
    return image_prompt ? { image_prompt, cover_alt: String(input.cover_alt ?? "").trim() } : null;
  } catch (err) {
    console.error("craftImagePrompt failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export type WeeklyDraft = Partial<BlogPost> & { image_prompt?: string };

/**
 * Saves a generated draft as an UNPUBLISHED post, with an AI cover when one can
 * be made. Shared by the Sunday cron and the manual "generate now" button.
 */
export async function createDraftWithCover(
  draft: WeeklyDraft
): Promise<{ post: BlogPost; coverOk: boolean }> {
  const cover = (await createCoverFromPrompt(draft.slug ?? "", draft.image_prompt ?? "")) ?? "";
  const post = await createBlogPost({
    title: draft.title ?? "",
    slug: draft.slug ?? "",
    excerpt: draft.excerpt ?? "",
    content: draft.content ?? "",
    cover_image: cover,
    // An alt text only makes sense next to a picture.
    cover_image_alt: cover ? (draft.cover_image_alt ?? "") : "",
    keywords: draft.keywords ?? [],
    published: false,
    featured: false,
  });
  return { post, coverOk: Boolean(cover) };
}
