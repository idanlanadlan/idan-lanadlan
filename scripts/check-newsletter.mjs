/**
 * Health check for the email newsletter pipeline (Resend + Supabase).
 *
 * What it verifies:
 *   1. RESEND_API_KEY is set and valid.
 *   2. The sending domain (idanlanadlan.co.il) is verified in Resend, so both
 *      noreply@  (contact / leads / blog cron) and
 *      updates@  (newsletter — lib/newsletter.ts)
 *      can actually send.
 *   3. The email_subscribers table exists (setup Step 16) and prints the
 *      status breakdown (pending / confirmed / unsubscribed).
 *
 * Optional:
 *   --send you@example.com   also sends two real test emails, one from each
 *                            from-address, so you can confirm delivery + how
 *                            they render.
 *
 * Env: reads a dotenv file (default .env.local). Pull production values first:
 *   npx vercel env pull .env.prod --environment=production
 *   node scripts/check-newsletter.mjs --env .env.prod --send idanhuli8@gmail.com
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ── args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getFlag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
};
const envPath = getFlag("--env") || ".env.local";
const sendTo = getFlag("--send");

// ── load env file (simple KEY=VALUE parser, ignores quotes/comments) ──────────
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = v;
  }
  console.log(`· loaded env from ${envPath}`);
} catch {
  console.log(`· no ${envPath} file — using process.env as-is`);
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DOMAIN = "idanlanadlan.co.il";
let problems = 0;
const fail = (msg) => { problems++; console.log(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ── 1 + 2: Resend ───────────────────────────────────────────────────────────
console.log("\n[1] Resend API key + domain verification");
if (!RESEND_API_KEY) {
  fail("RESEND_API_KEY is not set");
} else {
  const res = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });
  if (res.status === 401) {
    fail("RESEND_API_KEY rejected (401) — wrong or revoked key");
  } else if (!res.ok) {
    fail(`Resend /domains returned ${res.status}`);
  } else {
    ok("API key accepted");
    const body = await res.json();
    const domains = body.data ?? [];
    const d = domains.find((x) => x.name === DOMAIN);
    if (!d) {
      fail(`domain ${DOMAIN} is NOT added to this Resend account — no email will send`);
      console.log(`     domains on the account: ${domains.map((x) => x.name).join(", ") || "(none)"}`);
    } else if (d.status !== "verified") {
      fail(`domain ${DOMAIN} status is "${d.status}" (needs "verified") — sends will fail`);
      for (const r of d.records ?? []) {
        if (r.status !== "verified") console.log(`     ${r.record} ${r.type} ${r.name} → ${r.status}`);
      }
    } else {
      ok(`domain ${DOMAIN} is verified — noreply@ and updates@ both send`);
      const region = d.region ? ` (region ${d.region})` : "";
      console.log(`     domain id ${d.id}${region}, created ${d.created_at}`);
    }
  }
}

// ── 3: Supabase email_subscribers table ─────────────────────────────────────
console.log("\n[2] Supabase email_subscribers table (setup Step 16)");
if (!SUPABASE_URL || !SERVICE_ROLE) {
  fail("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — cannot check");
} else {
  const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
  const { data, error } = await sb.from("email_subscribers").select("status");
  if (error) {
    if (/does not exist|relation|schema cache/i.test(error.message)) {
      fail(`table missing — run setup Step 16. (${error.message})`);
    } else {
      fail(`query failed: ${error.message}`);
    }
  } else {
    ok("table exists");
    const counts = data.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
    const confirmed = counts.confirmed || 0;
    console.log(
      `     ${data.length} row(s): ` +
        `${confirmed} confirmed · ${counts.pending || 0} pending · ${counts.unsubscribed || 0} unsubscribed`
    );
    if (confirmed === 0) {
      console.log("     ⚠ no confirmed subscribers yet — new-listing alerts / digests have nobody to send to");
    }
  }
}

// ── 4: optional test send ──────────────────────────────────────────────────
if (sendTo && RESEND_API_KEY) {
  console.log(`\n[3] Sending 2 test emails to ${sendTo}`);
  const senders = [
    { from: "עידן לנדל״ן <noreply@idanlanadlan.co.il>", tag: "noreply@ (contact / leads / blog)" },
    { from: "עידן לנדל״ן <updates@idanlanadlan.co.il>", tag: "updates@ (newsletter)" },
  ];
  for (const s of senders) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: s.from,
        to: [sendTo],
        subject: `בדיקת שליחה — ${s.tag}`,
        html: `<div dir="rtl" style="font-family:Arial;padding:24px">אם הגיע — השליחה מ־<b>${s.tag}</b> עובדת. ${new Date().toLocaleString("he-IL")}</div>`,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) ok(`${s.tag} → queued (id ${body.id})`);
    else fail(`${s.tag} → ${res.status} ${JSON.stringify(body)}`);
  }
  console.log("   check the inbox (and spam) for both.");
}

// ── verdict ────────────────────────────────────────────────────────────────
console.log(
  problems === 0
    ? "\n✅ newsletter pipeline looks healthy\n"
    : `\n❌ ${problems} problem(s) above — fix before relying on the newsletter\n`
);
process.exit(problems === 0 ? 0 : 1);
