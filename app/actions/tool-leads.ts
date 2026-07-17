"use server";

import { isValidPhone, isValidEmail } from "@/lib/validation";
import { consentTimestamp, consentEmailRows } from "@/lib/consent";

export async function sendToolLead(data: {
  toolName: string;
  name: string;
  phone: string;
  email?: string;
  details?: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}): Promise<{ success: boolean; error?: "phone" | "email" | "validation" | "server" }> {
  if (!data.name.trim()) return { success: false, error: "validation" };
  // Amendment 13: no processing without an explicit, affirmative consent.
  if (data.privacyConsent !== true) return { success: false, error: "validation" };
  if (!isValidPhone(data.phone)) return { success: false, error: "phone" };
  if (data.email && !isValidEmail(data.email)) return { success: false, error: "email" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "server" };

  const ts = consentTimestamp();

  const emailRow = data.email
    ? `<tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">מייל:</td><td style="padding:10px 0;"><a href="mailto:${data.email}" style="color:#F5F5F0;">${data.email}</a></td></tr>`
    : "";

  const detailsRow = data.details
    ? `<tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;vertical-align:top;">פרטים:</td><td style="padding:10px 0;white-space:pre-wrap;">${data.details}</td></tr>`
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
      subject: `ליד חדש מארגז הכלים — ${data.toolName}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0A0A0A;color:#F5F5F0;border-radius:12px;">
          <h2 style="color:#C9A96E;margin-top:0">ליד חדש — ${data.toolName}</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;width:120px;">שם:</td><td style="padding:10px 0;">${data.name}</td></tr>
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">טלפון:</td><td style="padding:10px 0;"><a href="tel:${data.phone}" style="color:#F5F5F0;">${data.phone}</a></td></tr>
            ${emailRow}
            ${detailsRow}
            ${consentEmailRows(data.marketingConsent, ts)}
          </table>
        </div>
      `,
    }),
  });

  return { success: res.ok, error: res.ok ? undefined : "server" };
}
