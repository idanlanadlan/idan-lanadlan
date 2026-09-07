import "server-only";
import { randomBytes } from "crypto";
import type { Property, Subscriber } from "./types";
import { escapeHtml } from "./html-escape";
import { displaySize } from "./property-utils";
import {
  getProperties,
  getSubscriberByEmail,
  getSubscriberByToken,
  createSubscriber,
  updateSubscriber,
  listConfirmedSubscribers,
} from "./db";

const BASE = "https://idanlanadlan.co.il";
const FROM = "עידן לנדל״ן <updates@idanlanadlan.co.il>";
const REPLY_TO = "idanlanadlan@gmail.com";

const token = () => randomBytes(24).toString("hex");
const now = () => new Date().toISOString();

// ── Email rendering ──────────────────────────────────────────────────────────

function unsubUrl(sub: Pick<Subscriber, "unsubscribe_token">): string {
  return `${BASE}/api/newsletter/unsubscribe?token=${sub.unsubscribe_token}`;
}

/** One branded shell for every message. `bodyHtml` is trusted (built here). */
function renderEmail(heading: string, bodyHtml: string, sub: Pick<Subscriber, "unsubscribe_token">): string {
  const unsub = unsubUrl(sub);
  return `
<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#14181D;color:#FAF6EE;border-radius:14px;overflow:hidden;">
  <div style="padding:28px 32px 0;">
    <p style="margin:0;font-size:13px;letter-spacing:3px;color:#C9A96E;">עידן לנדל״ן</p>
  </div>
  <div style="padding:16px 32px 8px;">
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:400;color:#FAF6EE;">${escapeHtml(heading)}</h1>
    ${bodyHtml}
  </div>
  <div style="padding:20px 32px 28px;margin-top:12px;border-top:1px solid #2A2F36;font-size:11px;color:#8f897d;line-height:1.7;">
    עידן חולי · עידן לנדל״ן · הירקון 319, תל אביב · 054-979-1171<br/>
    קיבלת את המייל הזה כי נרשמת לעדכוני נכסים באתר idanlanadlan.co.il.<br/>
    <a href="${unsub}" style="color:#C9A96E;">להסרה מרשימת התפוצה בלחיצה אחת</a>
  </div>
</div>`;
}

function priceStr(p: Property): string {
  const amount = `₪${p.price.toLocaleString("he-IL")}`;
  return p.type === "rent" ? `${amount} לחודש` : amount;
}

/** Property cards for the welcome / alert / digest emails. */
function propertyRowsHtml(properties: Property[]): string {
  if (properties.length === 0) {
    return `<p style="font-size:14px;color:#cfc9bd;">כרגע אין נכסים זמינים — נעדכן ברגע שייכנס משהו.</p>`;
  }
  return properties
    .map((p) => {
      const url = `${BASE}/nadlan/${p.id}`;
      const img = p.images?.[0]
        ? `<img src="${escapeHtml(p.images[0])}" alt="" width="560" style="width:100%;max-width:560px;height:200px;object-fit:cover;border-radius:8px;display:block;margin:0 0 10px;" />`
        : "";
      return `
<div style="padding:16px 0;border-bottom:1px solid #2A2F36;">
  ${img}
  <p style="margin:0 0 4px;font-size:15px;font-weight:bold;color:#FAF6EE;">${escapeHtml(p.title)}</p>
  <p style="margin:0 0 4px;font-size:14px;color:#C9A96E;">${priceStr(p)}</p>
  <p style="margin:0 0 10px;font-size:12px;color:#9a9488;">${p.bedrooms} חד׳ · ${displaySize(p)} מ״ר · ${escapeHtml(p.neighborhood)}, ${escapeHtml(p.city)}</p>
  <a href="${url}" style="display:inline-block;background:#C9A96E;color:#000;text-decoration:none;padding:8px 18px;border-radius:7px;font-size:13px;font-weight:bold;">לצפייה בנכס</a>
</div>`;
    })
    .join("");
}

async function availableProperties(): Promise<Property[]> {
  return (await getProperties())
    .filter((p) => p.status === "available" && p.type !== "project")
    .slice(0, 40);
}

// ── Sending ─────────────────────────────────────────────────────────────────

async function sendOne(sub: Subscriber, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [sub.email],
        reply_to: REPLY_TO,
        subject,
        html,
        headers: {
          "List-Unsubscribe": `<${unsubUrl(sub)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Sends `build(sub)` to each recipient, in gentle chunks (Resend free = 2 req/s). */
async function sendToMany(
  subs: Subscriber[],
  subject: string,
  buildBody: string
): Promise<number> {
  let sent = 0;
  for (let i = 0; i < subs.length; i += 8) {
    const chunk = subs.slice(i, i + 8);
    const results = await Promise.all(
      chunk.map((s) => sendOne(s, subject, renderEmail(subject, buildBody, s)))
    );
    sent += results.filter(Boolean).length;
    if (i + 8 < subs.length) await new Promise((r) => setTimeout(r, 1200));
  }
  return sent;
}

// ── Public API ──────────────────────────────────────────────────────────────

export type SubscribeResult = "pending" | "already" | "error";

export async function subscribe(email: string, name: string): Promise<SubscribeResult> {
  const clean = email.trim().toLowerCase();
  const displayName = name.trim();

  try {
    const existing = await getSubscriberByEmail(clean);
    let sub: Subscriber;

    if (existing?.status === "confirmed") {
      return "already";
    } else if (existing) {
      const confirm_token = token();
      await updateSubscriber(existing.id, {
        name: displayName || existing.name,
        status: "pending",
        confirm_token,
        consent_at: now(),
        confirmed_at: null,
        unsubscribed_at: null,
      });
      sub = { ...existing, name: displayName || existing.name, status: "pending", confirm_token };
    } else {
      sub = await createSubscriber({
        email: clean,
        name: displayName,
        status: "pending",
        confirm_token: token(),
        unsubscribe_token: token(),
        wants_new_listings: true,
        wants_weekly_digest: true,
        consent_at: now(),
      });
    }

    // Confirmation email is transactional (allowed before consent completes).
    const confirmUrl = `${BASE}/api/newsletter/confirm?token=${sub.confirm_token}`;
    const body = `
      <p style="font-size:14px;color:#cfc9bd;line-height:1.7;">
        עוד צעד אחד: אשרו את ההרשמה לעדכוני נכסים מעידן לנדל״ן, ותתחילו לקבל את הנכסים
        החדשים שנכנסים — לפני שהם מתפרסמים בכל מקום.
      </p>
      <p style="margin:22px 0;">
        <a href="${confirmUrl}" style="display:inline-block;background:#C9A96E;color:#000;text-decoration:none;padding:12px 26px;border-radius:8px;font-weight:bold;font-size:14px;">
          אישור ההרשמה
        </a>
      </p>
      <p style="font-size:12px;color:#8f897d;">אם לא נרשמת — התעלם מהמייל הזה ולא תירשם לשום דבר.</p>`;
    await sendOne(sub, "אישור הרשמה — עדכוני נכסים מעידן לנדל״ן", renderEmail("אישור הרשמה", body, sub));
    return "pending";
  } catch {
    return "error";
  }
}

export async function confirmSubscription(tok: string): Promise<boolean> {
  const sub = await getSubscriberByToken("confirm_token", tok);
  if (!sub) return false;
  if (sub.status !== "confirmed") {
    await updateSubscriber(sub.id, { status: "confirmed", confirmed_at: now(), unsubscribed_at: null });
  }
  // Welcome email with the current catalog.
  const props = await availableProperties();
  const body = `
    <p style="font-size:14px;color:#cfc9bd;line-height:1.7;">
      ברוכים הבאים. מעכשיו תקבלו מייל על כל נכס חדש שנכנס, וגם סיכום שבועי של כל הנכסים הזמינים.
      הנה מה שזמין כרגע:
    </p>
    ${propertyRowsHtml(props)}
    <p style="margin-top:20px;">
      <a href="${BASE}/nadlan" style="color:#C9A96E;font-size:14px;">לכל הנכסים באתר ←</a>
    </p>`;
  await sendOne({ ...sub, status: "confirmed" }, "ברוכים הבאים — הנכסים הזמינים כרגע", renderEmail("ברוכים הבאים", body, sub));
  return true;
}

export async function unsubscribe(tok: string): Promise<boolean> {
  const sub = await getSubscriberByToken("unsubscribe_token", tok);
  if (!sub) return false;
  if (sub.status !== "unsubscribed") {
    await updateSubscriber(sub.id, { status: "unsubscribed", unsubscribed_at: now() });
  }
  return true;
}

export async function sendNewListingAlert(property: Property): Promise<number> {
  if (property.status !== "available") return 0;
  const subs = await listConfirmedSubscribers("wants_new_listings");
  if (subs.length === 0) return 0;
  const body = `
    <p style="font-size:14px;color:#cfc9bd;line-height:1.7;">נכס חדש נכנס לרשימה:</p>
    ${propertyRowsHtml([property])}`;
  return sendToMany(subs, `נכס חדש: ${property.title}`, body);
}

export async function sendWeeklyDigest(): Promise<number> {
  const subs = await listConfirmedSubscribers("wants_weekly_digest");
  const props = await availableProperties();
  if (subs.length === 0 || props.length === 0) return 0;
  const body = `
    <p style="font-size:14px;color:#cfc9bd;line-height:1.7;">כל הנכסים הזמינים אצל עידן לנדל״ן כרגע:</p>
    ${propertyRowsHtml(props)}
    <p style="margin-top:20px;"><a href="${BASE}/nadlan" style="color:#C9A96E;font-size:14px;">לכל הנכסים באתר ←</a></p>`;
  return sendToMany(subs, "הנכסים הזמינים השבוע — עידן לנדל״ן", body);
}
