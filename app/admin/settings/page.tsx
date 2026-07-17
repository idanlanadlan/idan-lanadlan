import { getSettings } from "@/lib/db";
import { saveSettings } from "@/app/actions/settings";

export const dynamic = "force-dynamic";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-charcoal border border-gray-dark rounded-xl p-6">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

export default async function SettingsPage() {
  const s = await getSettings();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">ניהול</p>
        <h1 className="font-display text-3xl font-light text-white">הגדרות אתר</h1>
        <p className="text-xs text-gray-light mt-1">עדכן פרטי יצירת קשר, רשתות ומידע כללי</p>
      </div>

      <form action={saveSettings} className="flex flex-col gap-6">

        <Section title="פרטי יצירת קשר">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>טלפון (מוצג)</label>
              <input className={field} name="phone" defaultValue={s.phone} placeholder="054-979-1171" />
            </div>
            <div>
              <label className={label}>טלפון (למספרים — ללא מקפים)</label>
              <input className={field} name="phone_raw" defaultValue={s.phone_raw} placeholder="972549791171" dir="ltr" />
            </div>
          </div>
          <div>
            <label className={label}>מייל</label>
            <input className={field} name="email" type="email" defaultValue={s.email} placeholder="idanlanadlan@gmail.com" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>WhatsApp (מספר בלבד)</label>
              <input className={field} name="whatsapp" defaultValue={s.whatsapp} placeholder="972549791171" dir="ltr" />
            </div>
            <div>
              <label className={label}>קטלוג WhatsApp (URL)</label>
              <input className={field} name="whatsapp_catalog" defaultValue={s.whatsapp_catalog} placeholder="https://wa.me/c/..." dir="ltr" />
            </div>
          </div>
          <div>
            <label className={label}>כתובת משרד</label>
            <input className={field} name="address" defaultValue={s.address} placeholder="הירקון 319, נמל תל אביב" />
          </div>
          <div>
            <label className={label}>קישור Google Maps</label>
            <input className={field} name="maps_url" defaultValue={s.maps_url} placeholder="https://maps.app.goo.gl/..." dir="ltr" />
          </div>
        </Section>

        <Section title="רשתות חברתיות">
          {[
            { key: "facebook", label: "Facebook" },
            { key: "instagram", label: "Instagram" },
            { key: "tiktok", label: "TikTok" },
            { key: "linkedin", label: "LinkedIn" },
          ].map(({ key, label: lbl }) => (
            <div key={key}>
              <label className={label}>{lbl}</label>
              <input className={field} name={key} defaultValue={s[key]} placeholder={`https://...`} dir="ltr" />
            </div>
          ))}
        </Section>

        <Section title="תוכן האתר">
          <div>
            <label className={label}>תקציר אודות (מוצג בעמוד הבית)</label>
            <textarea
              className={`${field} h-24 resize-none`}
              name="about_snippet"
              defaultValue={s.about_snippet}
              placeholder="כעשור של ניסיון בשוק הנדל״ן..."
            />
          </div>
        </Section>

        <Section title="תרגומי Hero (כותרת ראשית)">
          <div>
            <label className={label}>Subtitle — עברית</label>
            <textarea className={`${field} h-20 resize-none`} name="hero_subtitle_he" defaultValue={s.hero_subtitle_he} />
          </div>
          <div>
            <label className={label}>Subtitle — English</label>
            <textarea className={`${field} h-20 resize-none`} name="hero_subtitle_en" defaultValue={s.hero_subtitle_en} dir="ltr" />
          </div>
          <div>
            <label className={label}>Subtitle — Français</label>
            <textarea className={`${field} h-20 resize-none`} name="hero_subtitle_fr" defaultValue={s.hero_subtitle_fr} dir="ltr" />
          </div>
        </Section>

        <button
          type="submit"
          className="btn-gold w-full py-3 rounded-lg text-sm font-semibold"
        >
          שמור הכל
        </button>
      </form>
    </div>
  );
}
