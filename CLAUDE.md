@AGENTS.md

# עידן לנדל"ן — CLAUDE.md

## סקירת הפרויקט
אתר נדל"ן יוקרה לעסק תיווך ושיווק של עידן חולי — עידן לנדל"ן.
האתר חי ב-`idanlanadlan.co.il` (Vercel, מחובר ל-GitHub `idanlanadlan/idan-lanadlan`, deploy אוטומטי מ-`master`).

---

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 + RTL עברית
- **Animations:** framer-motion
- **Fonts:** David Libre (`--font-display`, כותרות) + Assistant (`--font-sans`, גוף)
- **Database:** Supabase (`lib/db.ts` — שכבת הנתונים היחידה; בלי Supabase מוגדר חוזרים ל-`lib/mock-data.ts`)
- **Email:** Resend (ניוזלטר, התראות, צור קשר). Cron ב-`vercel.json`: בלוג שבועי + digest ניוזלטר שבועי
- **AI:** Anthropic API (יועץ באתר, תרגום נכסים/בלוג, ייבוא נכסים, יצירת מאמרים)
- **Languages:** עברית (ללא prefix, נכתבת מחדש ל-`/he` ב-`proxy.ts`) + `/en` `/fr` `/es`
- **Deployment:** Vercel

---

## עיצוב ומותג

פלטת "White City" — לא שחור-זהב שטוח. הטוקנים ב-`app/globals.css` (`@theme`):
```css
--color-black:  #14181D   /* Ink — רקע ברירת מחדל (dark) */
--color-cream:  #FAF6EE   /* טקסט בהיר */
--color-gold:   #C9A96E   /* אקסנט פליז (+ gold-light #E8D5B0, gold-dark #9B7A45) */
--color-sea:    #2F5057   /* אקסנט ים-תיכוני, בשימוש חסכוני */
```
יש גם מצב בהיר (`ThemeContext`) עם גוון "Limestone".

### סגנון
יוקרתי-מינימליסטי. אין צבעים צעקניים.

---

## פרטי קשר ורשתות
ברירות המחדל ב-`lib/db.ts` (`DEFAULT_SETTINGS`); עידן עורך אותן ב-`/admin/settings`.
- **טלפון / WhatsApp:** 054-979-1171
- **Google Maps:** https://maps.app.goo.gl/RG3BgZUUxTh1g9u89
- **Facebook עסקי:** https://www.facebook.com/profile.php?id=100086018108373
- **TikTok:** https://www.tiktok.com/@idan.lanadlan
- **LinkedIn:** https://www.linkedin.com/in/idan-huli/
- **אינסטגרם:** https://www.instagram.com/idan.huli

---

## מבנה הפרויקט

```
app/
  [locale]/               # האתר הציבורי (he/en/fr/es), layout.tsx = root layout + Schema.org
    page.tsx              # Home
    nadlan/               # רשימת נכסים; nadlan/[id] = עמוד נכס (noindex אם newsletter_only)
    projects/             # פרויקטים
    blog/                 # בלוג (+ [slug])
    toolbox/              # מחשבונים וכלים, עמוד נפרד לכל כלי (mortgage-calculator, roi-calculator...)
    newsletter/ groups/ sellers/ about/ contact/
    privacy/ terms/ accessibility/
  admin/                  # דשבורד ניהול (מוגן ב-proxy.ts): properties, blog, brokers,
                          # subscribers, settings, setup (מדריך הקמה במספרי Steps)
  actions/                # Server Actions (properties, blog, brokers, newsletter, settings...)
  api/                    # advisor, upload-images, newsletter confirm/unsubscribe, cron/*
  sitemap.ts              # Sitemap — route handler במטמון; הפעולות מרעננות אותו עם revalidatePath
  globals.css             # Design tokens Tailwind v4

components/               # layout, home, properties, admin, tools, contact, legal
                          # + NewsletterModal / NewsletterSignup / Advisor / CookieBanner ועוד
contexts/                 # Language, Settings, Theme
lib/
  db.ts                   # כל הגישה ל-Supabase; getProperties() גולמי, getPublicProperties() מסונן
  newsletter.ts           # שליחת מיילים (Resend)
  translations.ts         # טקסטי ממשק לפי שפה
  mock-data.ts            # נתוני fallback (בלי Supabase) + ביקורות
scripts/                  # check-newsletter.mjs (בדיקת Resend/Supabase), make-favicon, make-og-image
proxy.ts                  # הגנת /admin + ניתוב שפות
```

---

## נכסים: אתר + ניוזלטר מול ניוזלטר בלבד
לכל נכס יש `newsletter_only` (Step 19 ב-`/admin/setup`).
- `getPublicProperties()` מזין `/nadlan`, `/projects`, ה-sitemap והנכסים המומלצים בדף הבית. `getProperties()` נשאר לא מסונן לאדמין ולניוזלטר.
- עמוד הנכס נשאר נגיש בקישור ישיר אבל `noindex`.
- כל פעולה שמשנה נכס חייבת לרענן גם `revalidatePath("/sitemap.xml")`.
- הסינון הוא ברמת האפליקציה בלבד; RLS עם מפתח anon עדיין מאפשר לקרוא את השורה.
- מעבר נכס קיים ל-newsletter-only לא שולח התראה מיידית (ההתראה רק ביצירה); הוא יוצא ב-digest השבועי.

---

## מה נשאר לעשות

### לאימות
- **Resend בפרודקשן** — לא אומת שהמפתח והדומיין תקינים ושמיילים באמת נשלחים. `node scripts/check-newsletter.mjs --env .env.prod --send <מייל>` (אחרי `npx vercel env pull .env.prod --environment=production`; כותב סודות לדיסק).
- **ביקורות** — `components/home/Testimonials.tsx` עדיין קורא מ-`mockTestimonials`; צריך ביקורות אמיתיות מלקוחות (ואולי טבלת `testimonials` ב-Supabase).

### ממתין לחומרים מעידן
- לוגו
- תמונה מקצועית של עידן

### אופציונלי
- הקשחת RLS כך שנכסי newsletter-only לא יקראו עם מפתח anon.

---

## Gotchas
- Tailwind v4: אין `@apply` כמו ב-v3, design tokens מוגדרים ב-`globals.css`
- RTL: `dir` נקבע לפי שפה ב-`app/[locale]/layout.tsx` (עברית = rtl, שאר השפות ltr)
- Next.js 16: ה-middleware נקרא `proxy.ts`; קרא את `node_modules/next/dist/docs/` לפני שינוי API
- `lib/mock-data.ts` הוא fallback ולא מקור האמת — הנתונים האמיתיים ב-Supabase
- בסקריפטי node ב-Windows ההודעה `Assertion failed ... async.c` בסוף היא באג תמים של Node
