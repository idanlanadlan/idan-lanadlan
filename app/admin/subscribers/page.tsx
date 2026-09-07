import { Mail, CheckCircle2, Clock, XCircle, Send } from "lucide-react";
import { getAllSubscribers } from "@/lib/db";
import { sendWeeklyDigestNow } from "@/app/actions/newsletter";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const statusMeta: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "מאושר", cls: "bg-emerald-500/10 text-emerald-400" },
  pending: { label: "ממתין לאישור", cls: "bg-amber-500/10 text-amber-400" },
  unsubscribed: { label: "הוסר", cls: "bg-gray-dark text-gray-light" },
};

export default async function SubscribersAdmin({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const [subs, { sent }] = await Promise.all([getAllSubscribers(), searchParams]);
  const count = (s: string) => subs.filter((x) => x.status === s).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">ניהול</p>
          <h1 className="font-display text-3xl font-light text-white">רשימת תפוצה</h1>
          <p className="text-xs text-gray-light mt-1">{subs.length} נרשמים בסך הכל</p>
        </div>
        <form action={sendWeeklyDigestNow}>
          <button
            type="submit"
            title="שולח עכשיו לכל המאושרים את הנכסים הזמינים — כמו הדיוור השבועי האוטומטי (יום ה')"
            className="flex items-center gap-2 border border-gold/40 text-gold px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/10 transition-colors"
          >
            <Send size={16} />
            שלח דיוור שבועי עכשיו
          </button>
        </form>
      </div>

      {sent !== undefined && (
        <p className="mb-6 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">
          הדיוור נשלח ל-{sent} נרשמים.
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: CheckCircle2, label: "מאושרים", n: count("confirmed"), cls: "text-emerald-400" },
          { icon: Clock, label: "ממתינים לאישור", n: count("pending"), cls: "text-amber-400" },
          { icon: XCircle, label: "הוסרו", n: count("unsubscribed"), cls: "text-gray-light" },
        ].map((s) => (
          <div key={s.label} className="bg-charcoal border border-gray-dark rounded-xl p-5">
            <s.icon size={18} className={`${s.cls} mb-2`} />
            <p className="text-2xl font-semibold text-white">{s.n}</p>
            <p className="text-xs text-gray-light">{s.label}</p>
          </div>
        ))}
      </div>

      {subs.length === 0 ? (
        <div className="text-center py-16 text-gray-light">
          <Mail size={28} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">עדיין אין נרשמים. טופס ההרשמה נמצא בפוטר, בעמוד /nadlan ובעמוד /newsletter.</p>
        </div>
      ) : (
        <div className="bg-charcoal border border-gray-dark rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_140px_120px_130px] gap-4 px-5 py-3 border-b border-gray-dark text-[10px] text-gray-light uppercase tracking-wider">
            <span>מייל / שם</span>
            <span>סטטוס</span>
            <span>מנוי</span>
            <span>נרשם</span>
          </div>
          {subs.map((s, i) => (
            <div
              key={s.id}
              className={`grid md:grid-cols-[1fr_140px_120px_130px] gap-4 px-5 py-3.5 items-center text-sm ${
                i < subs.length - 1 ? "border-b border-gray-dark" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="text-cream truncate" dir="ltr">{s.email}</p>
                {s.name && <p className="text-xs text-gray-light truncate">{s.name}</p>}
              </div>
              <span className={`text-[11px] px-2 py-1 rounded-full w-fit ${statusMeta[s.status]?.cls ?? ""}`}>
                {statusMeta[s.status]?.label ?? s.status}
              </span>
              <span className="text-[11px] text-gray-light">
                {[s.wants_new_listings && "חדשים", s.wants_weekly_digest && "שבועי"].filter(Boolean).join(" · ") || "—"}
              </span>
              <span className="text-xs text-gray-light">
                {new Date(s.created_at).toLocaleDateString("he-IL")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
