import { NextResponse } from "next/server";
import { generateWeeklyDraft } from "@/app/actions/blog-generate";
import { createDraftWithCover } from "@/lib/blog-image";

export const dynamic = "force-dynamic";
// The Claude call (tool-use, ~500-900 word article) plus a few RSS fetches.
export const maxDuration = 120;

const BASE = "https://idanlanadlan.co.il";

/**
 * Weekly automated blog draft. Scheduled by vercel.json (Sunday morning).
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically when
 * the CRON_SECRET env var is set. Saves an UNPUBLISHED Hebrew draft with an AI
 * cover image and emails Idan the article + image for approval — never
 * auto-publishes, never auto-translates (translation happens when Idan
 * saves/publishes from the admin).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await generateWeeklyDraft();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  let post, coverOk;
  try {
    // Saves the draft and (when GEMINI_API_KEY is set and the call succeeds) its AI cover.
    ({ post, coverOk } = await createDraftWithCover(result.draft));
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }

  const editUrl = `${BASE}/admin/blog/${post.id}/edit`;
  await notifyIdan(post.title, post.excerpt, editUrl, coverOk ? post.cover_image : "", post.cover_image_alt ?? "").catch(
    () => {}
  );

  return NextResponse.json({ ok: true, id: post.id, title: post.title, editUrl, cover: coverOk });
}

async function notifyIdan(
  title: string,
  excerpt: string,
  editUrl: string,
  coverUrl: string,
  coverAlt: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "עידן לנדל״ן <noreply@idanlanadlan.co.il>",
      to: ["idanlanadlan@gmail.com"],
      subject: `טיוטת בלוג שבועית מוכנה: ${title}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#14181D;color:#FAF6EE;border-radius:12px;">
          <h2 style="color:#C9A96E;margin-top:0">טיוטת בלוג שבועית</h2>
          ${
            coverUrl
              ? `<img src="${esc(coverUrl)}" alt="${esc(coverAlt)}" width="496" style="display:block;width:100%;max-width:496px;height:auto;border-radius:8px;margin:0 0 6px;" />
          <p style="font-size:11px;color:#9a9488;margin:0 0 18px;">תמונת שער (נוצרה ב-AI)${coverAlt ? ` · טקסט חלופי: ${esc(coverAlt)}` : ""}</p>`
              : ""
          }
          <p style="font-size:15px;font-weight:bold;margin:0 0 6px;">${esc(title)}</p>
          <p style="font-size:13px;color:#cfc9bd;margin:0 0 20px;">${esc(excerpt)}</p>
          <p style="margin:0 0 20px;">
            <a href="${editUrl}" style="background:#C9A96E;color:#000;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:bold;display:inline-block;">
              פתח לעריכה ואישור
            </a>
          </p>
          <p style="font-size:12px;color:#9a9488;line-height:1.6;margin:0;">
            הטיוטה נשמרה כלא-מפורסמת ובעברית בלבד. אחרי שתעבור עליה: ${
              coverUrl
                ? 'אם התמונה לא מתאימה, לחץ "צור תמונה מחדש" או העלה תמונה משלך,'
                : "לא הצלחנו ליצור תמונת שער הפעם, הוסף אחת (אפשר גם עם הכפתור \"צור תמונה מחדש\"),"
            }
            שמור (התרגום ל-4 שפות רץ אוטומטית בשמירה), וסמן "פרסם".
          </p>
        </div>
      `,
    }),
  });
}
