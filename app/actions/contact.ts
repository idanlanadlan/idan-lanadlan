"use server";

export async function sendContactForm(data: {
  category: string;
  name: string;
  phone: string;
}): Promise<{ success: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "עידן לנדל״ן <noreply@idanlanadlan.co.il>",
      to: ["idanlanadlan@gmail.com"],
      subject: `פנייה חדשה — ${data.category}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0A0A0A;color:#F5F5F0;border-radius:12px;">
          <h2 style="color:#C9A96E;margin-top:0">פנייה חדשה — עידן לנדל״ן</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;width:120px;">סוג פנייה:</td><td style="padding:10px 0;">${data.category}</td></tr>
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">שם:</td><td style="padding:10px 0;">${data.name}</td></tr>
            <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">טלפון:</td><td style="padding:10px 0;"><a href="tel:${data.phone}" style="color:#F5F5F0;">${data.phone}</a></td></tr>
          </table>
        </div>
      `,
    }),
  });

  return { success: res.ok };
}
