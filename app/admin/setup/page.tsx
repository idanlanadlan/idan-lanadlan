import { isConfigured } from "@/lib/supabase";

const SQL = `-- הרץ את זה ב-Supabase SQL Editor
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  price BIGINT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent', 'project')),
  bedrooms NUMERIC(4,1) NOT NULL,
  bathrooms NUMERIC(4,1) NOT NULL,
  toilets NUMERIC(4,1),
  size_sqm NUMERIC(7,1) NOT NULL,
  balcony_sqm NUMERIC(6,1),
  floor INTEGER,
  parking_spots INTEGER,
  has_mamad BOOLEAN NOT NULL DEFAULT false,
  has_shelter BOOLEAN NOT NULL DEFAULT false,
  has_elevator BOOLEAN NOT NULL DEFAULT false,
  address TEXT NOT NULL DEFAULT '',
  neighborhood TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT 'תל אביב',
  description TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'sold', 'rented')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- אפשר גישה ציבורית לקריאה (האתר מציג נכסים)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON properties FOR SELECT USING (true);
CREATE POLICY "service_all"  ON properties USING (true) WITH CHECK (true);`;

const MIGRATION_SQL = `-- אם הטבלה כבר קיימת (פרויקט מחובר), הרץ את זה כדי להוסיף שדות חדשים
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS toilets NUMERIC(4,1),
  ADD COLUMN IF NOT EXISTS balcony_sqm NUMERIC(6,1),
  ADD COLUMN IF NOT EXISTS parking_spots INTEGER,
  ADD COLUMN IF NOT EXISTS has_mamad BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_shelter BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_elevator BOOLEAN NOT NULL DEFAULT false;`;

const MIGRATION_SQL_TRANSLATIONS = `-- הוספת שדות תרגום (אנגלית/צרפתית) לכותרת, תיאור, שכונה ועיר
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood_en TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood_fr TEXT,
  ADD COLUMN IF NOT EXISTS city_en TEXT,
  ADD COLUMN IF NOT EXISTS city_fr TEXT;`;

const MIGRATION_SQL_COORDS = `-- קואורדינטות לנכס (מיקום במפה — נבחר מהצעות GovMap בטופס הנכס)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;`;

const MIGRATION_SQL_TRANSLATIONS_ES = `-- הוספת שדות תרגום לספרדית לכותרת, תיאור, שכונה ועיר
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS title_es TEXT,
  ADD COLUMN IF NOT EXISTS description_es TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood_es TEXT,
  ADD COLUMN IF NOT EXISTS city_es TEXT;`;

const MIGRATION_SQL_BLOG_TRANSLATIONS = `-- הוספת שדות תרגום (אנגלית/צרפתית/ספרדית) למאמרי הבלוג
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_fr TEXT,
  ADD COLUMN IF NOT EXISTS title_es TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_fr TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_es TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS content_fr TEXT,
  ADD COLUMN IF NOT EXISTS content_es TEXT,
  ADD COLUMN IF NOT EXISTS keywords_en TEXT[],
  ADD COLUMN IF NOT EXISTS keywords_fr TEXT[],
  ADD COLUMN IF NOT EXISTS keywords_es TEXT[];`;

const MIGRATION_SQL_ADDRESS_TRANSLATIONS = `-- הוספת תעתיק לטיני של הכתובת המדויקת (רחוב+מספר) לכל שפה
-- (בניגוד לעיר/שכונה, זה לא תרגום משמעות אלא תעתיק פונטי — לשימוש בתצוגה בלבד,
-- לא בקישורי Waze/Google Maps שממשיכים להשתמש בכתובת העברית המקורית)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS address_en TEXT,
  ADD COLUMN IF NOT EXISTS address_fr TEXT,
  ADD COLUMN IF NOT EXISTS address_es TEXT;`;

const MIGRATION_SQL_CRM_ID = `-- שמירת מזהה CRM (Nadlan One) על נכסים שיובאו/ייובאו דרך /admin/properties/import
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS crm_id TEXT;`;

export default function SetupPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">הגדרות</p>
        <h1 className="font-display text-3xl font-light text-white">חיבור Supabase</h1>
      </div>

      {isConfigured ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 mb-8">
          <p className="text-emerald-400 font-semibold">✓ Supabase מחובר ופעיל</p>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-8">
          <p className="text-amber-400 font-semibold">⚠️ Supabase לא מחובר</p>
          <p className="text-amber-300/70 text-sm mt-1">פעל לפי ההוראות למטה</p>
        </div>
      )}

      <div className="space-y-8">
        <Step num={1} title="צור פרויקט ב-Supabase">
          <p className="text-sm text-gray-light">
            גש ל-<a href="https://supabase.com" target="_blank" className="text-gold hover:underline">supabase.com</a>,
            התחבר עם GitHub, ולחץ <strong className="text-cream">New project</strong>.
            בחר שם ואזור (מומלץ: Frankfurt).
          </p>
        </Step>

        <Step num={2} title="צור את טבלת הנכסים">
          <p className="text-sm text-gray-light mb-3">
            ב-Supabase פתח <strong className="text-cream">SQL Editor</strong> והרץ:
          </p>
          <pre className="bg-black rounded-lg p-4 text-xs text-cream overflow-x-auto leading-relaxed font-mono">
            {SQL}
          </pre>
        </Step>

        <Step num={3} title="הוסף משתני סביבה ל-Vercel">
          <p className="text-sm text-gray-light mb-3">
            ב-Supabase: <strong className="text-cream">Project Settings → API</strong>.
            ב-Vercel: <strong className="text-cream">idan-lanadlan → Settings → Environment Variables</strong>.
          </p>
          <div className="bg-black rounded-lg p-4 font-mono text-xs text-cream space-y-2">
            <p>NEXT_PUBLIC_SUPABASE_URL=<span className="text-gold">https://xxx.supabase.co</span></p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=<span className="text-gold">eyJ...</span></p>
            <p>SUPABASE_SERVICE_ROLE_KEY=<span className="text-gold">eyJ...</span></p>
            <p>ADMIN_PASSWORD=<span className="text-gold">סיסמה_חזקה_שתבחר</span></p>
          </div>
          <p className="text-xs text-gray-light mt-2">
            ה-Service Role Key נמצא תחת <em>service_role secret</em> — שמור אותו בסוד.
          </p>
        </Step>

        <Step num={4} title="עשה Redeploy">
          <p className="text-sm text-gray-light">
            ב-Vercel: <strong className="text-cream">Deployments → ⋯ → Redeploy</strong>.
            אחרי הפריסה, חזור לכאן ותראה ✓ מחובר.
          </p>
        </Step>

        <Step num={5} title="עדכון: שדות נכס חדשים (חניה, ממ״ד, מקלט, מעלית, מרפסת, שירותים)">
          <p className="text-sm text-gray-light mb-3">
            אם הטבלה כבר קיימת (הפרויקט כבר מחובר), הרץ ב-<strong className="text-cream">SQL Editor</strong> את זה כדי להוסיף את השדות החדשים:
          </p>
          <pre className="bg-black rounded-lg p-4 text-xs text-cream overflow-x-auto leading-relaxed font-mono">
            {MIGRATION_SQL}
          </pre>
        </Step>

        <Step num={6} title="עדכון: תרגום אוטומטי של נכסים (אנגלית/צרפתית)">
          <p className="text-sm text-gray-light mb-3">
            כדי שכותרת/תיאור/שכונה/עיר יוצגו מתורגמים כשמחליפים שפה באתר, הרץ ב-<strong className="text-cream">SQL Editor</strong> את זה:
          </p>
          <pre className="bg-black rounded-lg p-4 text-xs text-cream overflow-x-auto leading-relaxed font-mono">
            {MIGRATION_SQL_TRANSLATIONS}
          </pre>
        </Step>

        <Step num={7} title="עדכון: מיקום נכס במפה (קואורדינטות)">
          <p className="text-sm text-gray-light mb-3">
            כדי שנכסים שנשמרים בטופס (עם בחירת כתובת מהצעות GovMap) יופיעו במפת הנכסים, הרץ ב-<strong className="text-cream">SQL Editor</strong> את זה:
          </p>
          <pre className="bg-black rounded-lg p-4 text-xs text-cream overflow-x-auto leading-relaxed font-mono">
            {MIGRATION_SQL_COORDS}
          </pre>
        </Step>

        <Step num={8} title="עדכון: תרגום אוטומטי של נכסים (ספרדית)">
          <p className="text-sm text-gray-light mb-3">
            הוספת שפה רביעית (ספרדית) לאתר — כדי שכותרת/תיאור/שכונה/עיר יתורגמו גם לספרדית, הרץ ב-<strong className="text-cream">SQL Editor</strong> את זה:
          </p>
          <pre className="bg-black rounded-lg p-4 text-xs text-cream overflow-x-auto leading-relaxed font-mono">
            {MIGRATION_SQL_TRANSLATIONS_ES}
          </pre>
        </Step>

        <Step num={9} title="עדכון: תרגום אוטומטי של מאמרי הבלוג (אנגלית/צרפתית/ספרדית)">
          <p className="text-sm text-gray-light mb-3">
            כדי שמאמרי הבלוג יתורגמו אוטומטית לשלוש השפות (חדשים, ונדרש כפתור "תרגם" ידני לקיימים), הרץ ב-<strong className="text-cream">SQL Editor</strong> את זה:
          </p>
          <pre className="bg-black rounded-lg p-4 text-xs text-cream overflow-x-auto leading-relaxed font-mono">
            {MIGRATION_SQL_BLOG_TRANSLATIONS}
          </pre>
        </Step>

        <Step num={10} title="עדכון: תעתיק לטיני לכתובת המדויקת">
          <p className="text-sm text-gray-light mb-3">
            כדי שהכתובת המדויקת (רחוב+מספר) תוצג בתעתיק לטיני בשפות שאינן עברית (במקום עברית גולמית), הרץ ב-<strong className="text-cream">SQL Editor</strong> את זה:
          </p>
          <pre className="bg-black rounded-lg p-4 text-xs text-cream overflow-x-auto leading-relaxed font-mono">
            {MIGRATION_SQL_ADDRESS_TRANSLATIONS}
          </pre>
        </Step>

        <Step num={11} title="עדכון: מזהה CRM על נכסים">
          <p className="text-sm text-gray-light mb-3">
            כדי ששמירת נכס (כולל דרך ייבוא מ-CRM) לא תיכשל ושמזהה ה-CRM יישמר, הרץ ב-<strong className="text-cream">SQL Editor</strong> את זה:
          </p>
          <pre className="bg-black rounded-lg p-4 text-xs text-cream overflow-x-auto leading-relaxed font-mono">
            {MIGRATION_SQL_CRM_ID}
          </pre>
        </Step>
      </div>
    </div>
  );
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="flex-none w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center text-sm font-bold">
        {num}
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}
