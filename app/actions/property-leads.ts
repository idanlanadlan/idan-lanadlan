"use server";

import { isValidPhone } from "@/lib/validation";
import { consentTimestamp, consentEmailRows } from "@/lib/consent";
import { escapeHtml } from "@/lib/html-escape";

/**
 * A lead left on a specific property page ("מעוניינים בנכס? השאירו פרטים").
 * Mirrors sendContactForm: notification email via Resend + fire-and-forget
 * forward to the Nadlan One CRM. The property URL rides along in both so Idan
 * knows exactly which listing the lead is about.
 */
export async function sendPropertyLead(data: {
  propertyTitle: string;
  propertyUrl: string;
  name: string;
  phone: string;
  city: string;
  notes?: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}): Promise<{ success: boolean; error?: "phone" | "validation" | "server" }> {
  if (!data.name.trim() || !data.city.trim()) return { success: false, error: "validation" };
  // Amendment 13: no processing without an explicit, affirmative consent.
  if (data.privacyConsent !== true) return { success: false, error: "validation" };
  if (!isValidPhone(data.phone)) return { success: false, error: "phone" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "server" };

  const ts = consentTimestamp();
  const name = escapeHtml(data.name);
  const phone = escapeHtml(data.phone);
  const city = escapeHtml(data.city);
  const notes = data.notes ? escapeHtml(data.notes) : "";
  const title = escapeHtml(data.propertyTitle);
  const url = escapeHtml(data.propertyUrl);

  const notesRow = notes
    ? `<tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;vertical-align:top;">הערות:</td><td style="padding:10px 0;white-space:pre-wrap;">${notes}</td></tr>`
    : "";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "עידן לנדל״ן <noreply@idanlanadlan.co.il>",
      to: ["idanlanadlan@gmail.com"],
      subject: `ליד חדש מעמוד נכס — ${data.propertyTitle}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#14181D;color:#FAF6EE;border-radius:12px;">
          <h2 style="color:#C9A96E;margin-top:0">ליד חדש מעמוד נכס</h2>
          <p style="margin:0 0 4px;font-size:14px;">${title}</p>
          <p style="margin:0 0 16px;font-size:13px;"><a href="${url}" style="color:#C9A96E;">${url}</a></p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;width:120px;">שם:</td><td style="padding:10px 0;">${name}</td></tr>
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">טלפון:</td><td style="padding:10px 0;"><a href="tel:${phone}" style="color:#FAF6EE;">${phone}</a></td></tr>
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">עיר מגורים:</td><td style="padding:10px 0;">${city}</td></tr>
            ${notesRow}
            ${consentEmailRows(data.marketingConsent, ts)}
          </table>
        </div>
      `,
    }),
  });

  // Forward lead to Nadlan One CRM (fire-and-forget, non-blocking)
  const leadKey = process.env.NADLAN_ONE_LEAD_KEY;
  if (leadKey) {
    fetch("https://int.nadlanone.co.il/apiv1/Lead/0549791171", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": leadKey },
      body: JSON.stringify({
        FirstName: data.name,
        Phone1: data.phone,
        email: "",
        Description: `פנייה מעמוד נכס: ${data.propertyTitle}`,
        ParseDescription: true,
        Notes: `${data.city} | ${data.propertyUrl}${data.notes ? ` | ${data.notes}` : ""} | דיוור שיווקי: ${data.marketingConsent ? "כן" : "לא"} (${ts})`,
        Source: "אתר עידן לנדל״ן — עמוד נכס",
      }),
    }).catch(() => {/* silent — CRM failure doesn't affect UX */});
  }

  return { success: res.ok, error: res.ok ? undefined : "server" };
}

/**
 * "קבלו התראה על נכסים חדשים" — a standing request to be told when a matching
 * listing comes in. Same delivery as sendPropertyLead (email + CRM); the CRM
 * lead is tagged so Idan can follow up when a new property fits.
 */
export async function sendPropertyAlert(data: {
  name: string;
  phone: string;
  lookingFor: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}): Promise<{ success: boolean; error?: "phone" | "validation" | "server" }> {
  if (!data.name.trim()) return { success: false, error: "validation" };
  if (data.privacyConsent !== true) return { success: false, error: "validation" };
  if (!isValidPhone(data.phone)) return { success: false, error: "phone" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "server" };

  const ts = consentTimestamp();
  const name = escapeHtml(data.name);
  const phone = escapeHtml(data.phone);
  const lookingFor = data.lookingFor ? escapeHtml(data.lookingFor) : "";

  const lookingRow = lookingFor
    ? `<tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;vertical-align:top;">מחפש/ת:</td><td style="padding:10px 0;white-space:pre-wrap;">${lookingFor}</td></tr>`
    : "";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "עידן לנדל״ן <noreply@idanlanadlan.co.il>",
      to: ["idanlanadlan@gmail.com"],
      subject: "בקשת התראת נכסים חדשה",
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#14181D;color:#FAF6EE;border-radius:12px;">
          <h2 style="color:#C9A96E;margin-top:0">בקשת התראת נכסים</h2>
          <p style="margin:0 0 16px;font-size:13px;">מבקש/ת לקבל עדכון כשנכנס נכס מתאים.</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;width:120px;">שם:</td><td style="padding:10px 0;">${name}</td></tr>
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">טלפון:</td><td style="padding:10px 0;"><a href="tel:${phone}" style="color:#FAF6EE;">${phone}</a></td></tr>
            ${lookingRow}
            ${consentEmailRows(data.marketingConsent, ts)}
          </table>
        </div>
      `,
    }),
  });

  const leadKey = process.env.NADLAN_ONE_LEAD_KEY;
  if (leadKey) {
    fetch("https://int.nadlanone.co.il/apiv1/Lead/0549791171", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": leadKey },
      body: JSON.stringify({
        FirstName: data.name,
        Phone1: data.phone,
        email: "",
        Description: "בקשת התראת נכסים חדשים",
        ParseDescription: true,
        Notes: `מחפש/ת: ${data.lookingFor || "—"} | דיוור שיווקי: ${data.marketingConsent ? "כן" : "לא"} (${ts})`,
        Source: "אתר עידן לנדל״ן — התראת נכסים",
      }),
    }).catch(() => {/* silent */});
  }

  return { success: res.ok, error: res.ok ? undefined : "server" };
}
