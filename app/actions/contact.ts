"use server";

import { isValidPhone, isValidEmail } from "@/lib/validation";
import { consentTimestamp, consentEmailRows } from "@/lib/consent";
import { escapeHtml } from "@/lib/html-escape";

export async function sendContactForm(data: {
  category: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}): Promise<{ success: boolean; error?: "phone" | "email" | "validation" | "server" }> {
  if (!data.name.trim() || !data.city.trim()) return { success: false, error: "validation" };
  // Amendment 13: no processing without an explicit, affirmative consent.
  if (data.privacyConsent !== true) return { success: false, error: "validation" };
  if (!isValidPhone(data.phone)) return { success: false, error: "phone" };
  if (data.email && !isValidEmail(data.email)) return { success: false, error: "email" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "server" };

  const ts = consentTimestamp();
  const name = escapeHtml(data.name);
  const phone = escapeHtml(data.phone);
  const city = escapeHtml(data.city);
  const category = escapeHtml(data.category);
  const email = data.email ? escapeHtml(data.email) : "";

  const emailRow = email
    ? `<tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">מייל:</td><td style="padding:10px 0;"><a href="mailto:${email}" style="color:#F5F5F0;">${email}</a></td></tr>`
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
      subject: `פנייה חדשה — ${category}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#14181D;color:#FAF6EE;border-radius:12px;">
          <h2 style="color:#C9A96E;margin-top:0">פנייה חדשה — עידן לנדל״ן</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;width:120px;">סוג פנייה:</td><td style="padding:10px 0;">${category}</td></tr>
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">שם:</td><td style="padding:10px 0;">${name}</td></tr>
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">טלפון:</td><td style="padding:10px 0;"><a href="tel:${phone}" style="color:#FAF6EE;">${phone}</a></td></tr>
            ${emailRow}
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">עיר:</td><td style="padding:10px 0;">${city}</td></tr>
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
        email: data.email ?? "",
        Description: `${data.category} — ${data.city}`,
        ParseDescription: true,
        Notes: `${data.city} | דיוור שיווקי: ${data.marketingConsent ? "כן" : "לא"} (${ts})`,
        Source: "אתר עידן לנדל״ן",
      }),
    }).catch(() => {/* silent — CRM failure doesn't affect UX */});
  }

  return { success: res.ok, error: res.ok ? undefined : "server" };
}
