@AGENTS.md

# עידן לנדל"ן — CLAUDE.md

## סקירת הפרויקט
אתר נדל"ן יוקרה מאפס לעסק תיווך ושיווק של עידן חולי — עידן לנדל"ן.
דומיין יעד: `idanlanadlan.co.il`

---

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + RTL עברית
- **Animations:** framer-motion
- **Fonts:** David Libre (עברית+לטינית, body — סריף היסטורי של עיצוב ישראל, יוקרתי ולא גנרי) + Frank Ruhl Libre/Cormorant Garamond (display)
- **Database (עתידי):** Supabase
- **Deployment:** Vercel (יחובר ל-GitHub)

---

## עיצוב ומותג

### צבעים
```css
--black:  #0A0A0A   /* רקע ראשי */
--gold:   #C9A96E   /* אקסנט זהב */
--cream:  #F5F5F0   /* טקסט בהיר */
```

### סגנון
יוקרתי-מינימליסטי. אין צבעים צעקניים. הכל שחור/זהב/קרם.

---

## פרטי קשר ורשתות
- **טלפון / WhatsApp:** 054-979-1171
- **Google Maps:** https://maps.app.goo.gl/RG3BgZUUxTh1g9u89
- **Facebook עסקי:** https://www.facebook.com/profile.php?id=100086018108373
- **TikTok:** https://www.tiktok.com/@idan.lanadlan
- **LinkedIn:** https://www.linkedin.com/in/idan-huli/
- **אינסטגרם:** לא ידוע עדיין

---

## מבנה הפרויקט

```
app/
  page.tsx                # Home: Hero, Stats, נכסים, אודות, ביקורות, בלוג, סושיאל, CTA
  nadlan/
    page.tsx              # רשימת נכסים עם פילטר
    [id]/page.tsx         # עמוד נכס בודד
  blog/
    page.tsx              # רשימת מאמרים
    [slug]/page.tsx       # מאמר בודד + Schema BlogPosting
  about/page.tsx          # אודות עידן
  contact/page.tsx        # צור קשר + Google Maps embed
  admin/page.tsx          # דשבורד ניהול (skeleton בלבד)
  sitemap.ts              # Sitemap דינמי
  layout.tsx              # Root layout + Schema.org RealEstateAgent + LocalBusiness
  globals.css             # Design tokens Tailwind v4

components/
  layout/
    Header.tsx            # Header נגלל עם mobile menu
    Footer.tsx
    WhatsAppButton.tsx    # כפתור WhatsApp צף
  home/
    Hero.tsx
    StatsBar.tsx
    FeaturedProperties.tsx
    AboutSnippet.tsx
    Testimonials.tsx
    SocialFeed.tsx
    BlogPreview.tsx
    CtaSection.tsx
  properties/
    PropertyCard.tsx      # כרטיס נכס

lib/
  types.ts                # TypeScript types
  mock-data.ts            # Mock data: 3 נכסים, 5 ביקורות, 3 מאמרים

public/
  robots.txt

next.config.ts            # image domains: unsplash + supabase
```

---

## מה נשאר לעשות

### עדיפות גבוהה
1. **GitHub + Vercel** — `gh auth login` (gh מותקן אבל לא logged in), ואז `/setup-github` + `/setup-vercel`
2. **חיבור דומיין** — idanlanadlan.co.il → Vercel (אחרי deploy)

### ממתין לחומרים מהמשתמש
- לוגו
- תמונה מקצועית של עידן
- handle אינסטגרם
- טקסטים לביקורות אמיתיות מלקוחות

### פיתוח עתידי
- **Supabase** — פרויקט חדש, סכמה: `properties`, `blog_posts`, `testimonials`
- **Admin CRUD** — הדשבורד skeleton, צריך טפסים לנכסים ומאמרים
- **ביקורות** — יש mock data, צריך לעדכן לביקורות אמיתיות

---

## Gotchas
- Tailwind v4: אין `@apply` כמו ב-v3, design tokens מוגדרים ב-`globals.css`
- RTL: כל ה-layout בעברית, `dir="rtl"` ב-root layout
- mock-data.ts מחזיק את כל הנתונים הזמניים — כשמחברים Supabase מחליפים אותו
