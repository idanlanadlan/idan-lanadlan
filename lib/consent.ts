// Server-side consent recording helpers, shared by the lead actions.
// The timestamped rows in the notification email are the durable proof of
// consent (amendment 40 requires documented marketing opt-in).

/** Israel-local timestamp, generated server-side so the client can't spoof it. */
export function consentTimestamp(): string {
  return new Date().toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    dateStyle: "short",
    timeStyle: "medium",
  });
}

/** Email table rows documenting both consents for the lead notification. */
export function consentEmailRows(marketingConsent: boolean, ts: string): string {
  return `
    <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">אישור מדיניות פרטיות:</td><td style="padding:10px 0;">כן — ${ts}</td></tr>
    <tr><td style="padding:10px 0;color:#C9A96E;font-weight:bold;">הסכמה לדיוור שיווקי:</td><td style="padding:10px 0;">${marketingConsent ? "כן" : "לא"} — ${ts}</td></tr>
  `;
}
