import Link from "next/link";
import { redirect } from "next/navigation";
import { upsertSettings, getSettings } from "@/lib/db";

async function sendResetLink() {
  "use server";

  // Generate secure 32-byte token
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  await upsertSettings({
    reset_token: token,
    reset_token_expiry: expiry,
  });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.idanlanadlan.co.il";
  const resetUrl = `${siteUrl}/admin/reset/${token}`;
  const adminEmail = process.env.ADMIN_EMAIL || "idanlanadlan@gmail.com";
  const apiKey = process.env.RESEND_API_KEY;

  let emailSent = false;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Idan Lanadlan <noreply@idanlanadlan.co.il>",
          to: [adminEmail],
          subject: "כניסה לדשבורד — עידן לנדל״ן",
          html: `
            <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#14181D;color:#FAF6EE;border-radius:12px;">
              <h2 style="color:#C9A96E;margin-top:0">עידן לנדל״ן — כניסה לדשבורד</h2>
              <p>קיבלת הודעה זו כי ביקשת קישור כניסה לדשבורד הניהול.</p>
              <p>לחץ על הכפתור להלן לכניסה. הקישור תקף לשעה אחת בלבד.</p>
              <a href="${resetUrl}"
                 style="display:inline-block;background:#C9A96E;color:#14181D;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0;">
                כניסה לדשבורד
              </a>
              <p style="color:#666;font-size:12px;margin-top:24px;">
                אם לא ביקשת קישור זה, אפשר להתעלם ממנו.<br/>
                הקישור: ${resetUrl}
              </p>
            </div>
          `,
        }),
      });
      emailSent = res.ok;
    } catch {
      emailSent = false;
    }
  }

  if (emailSent) {
    redirect("/admin/forgot-password?sent=1");
  } else {
    redirect(`/admin/forgot-password?link=${encodeURIComponent(resetUrl)}`);
  }
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; link?: string; expired?: string }>;
}) {
  const { sent, link, expired } = await searchParams;

  if (expired) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4" dir="rtl">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⛔</span>
          </div>
          <h1 className="font-display text-3xl font-light text-white mb-3">
            קישור פג תוקף
          </h1>
          <p className="text-sm text-gray-light mb-8">
            הקישור כבר שומש או פג תוקפו. שלח קישור חדש.
          </p>
          <form action={sendResetLink}>
            <button type="submit" className="btn-gold px-8 py-3 rounded-lg text-sm font-semibold">
              שלח קישור חדש
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4" dir="rtl">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="font-display text-3xl font-light text-white mb-3">
            נשלח!
          </h1>
          <p className="text-sm text-gray-light mb-8">
            קישור כניסה נשלח לאימייל שלך. הוא תקף לשעה אחת.
          </p>
          <Link
            href="/admin/login"
            className="text-xs text-gold hover:underline"
          >
            ← חזור להתחברות
          </Link>
        </div>
      </div>
    );
  }

  if (link) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4" dir="rtl">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="font-display text-3xl font-light text-white mb-2">
              קישור כניסה
            </h1>
            <p className="text-xs text-gold/70">
              שירות אימייל לא מוגדר — הקישור מוצג ישירות
            </p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-6">
            <p className="text-xs text-amber-300 mb-3">
              ⚠️ לחץ על הקישור כדי להיכנס לדשבורד. תקף לשעה.
            </p>
            <a
              href={link}
              className="btn-gold block text-center py-3 rounded-lg text-sm font-semibold"
            >
              כניסה לדשבורד
            </a>
          </div>
          <div className="bg-charcoal border border-gray-dark rounded-xl p-4">
            <p className="text-[10px] text-gray-light mb-2 uppercase tracking-wider">
              להגדרת שליחת מייל אוטומטית:
            </p>
            <p className="text-xs text-gray-light leading-relaxed">
              הוסף <code className="text-gold">RESEND_API_KEY</code> ב-Vercel env vars (
              <a href="https://resend.com" target="_blank" className="text-gold hover:underline">
                resend.com
              </a>
              {" "}— חינם עד 3,000 מיילים/חודש)
            </p>
          </div>
          <p className="text-center mt-6">
            <Link href="/admin/login" className="text-xs text-gray-light hover:text-gold transition-colors">
              ← חזור להתחברות
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-[10px] tracking-[0.5em] text-gold/80 uppercase mb-3">ניהול</p>
          <h1 className="font-display text-3xl font-light text-white mb-2">
            שכחתי סיסמה
          </h1>
          <p className="text-sm text-gray-light">
            נשלח קישור כניסה חד-פעמי לאימייל שלך
          </p>
        </div>

        <form action={sendResetLink}>
          <button
            type="submit"
            className="btn-gold w-full py-3 rounded-lg text-sm font-semibold"
          >
            שלח קישור כניסה
          </button>
        </form>

        <p className="text-center mt-6">
          <Link
            href="/admin/login"
            className="text-xs text-gray-light hover:text-gold transition-colors"
          >
            ← חזור להתחברות
          </Link>
        </p>
      </div>
    </div>
  );
}
