import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "הצהרת נגישות | עידן לנדל״ן",
  description: "הצהרת נגישות אתר עידן לנדל״ן בהתאם לתקן ישראלי ת״י 5568 ורמת WCAG 2.1 AA.",
};

export default function AccessibilityPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">נגישות</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              הצהרת נגישות
            </h1>
            <p className="text-gray-light text-sm">עדכון אחרון: יולי 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="space-y-10 text-gray-light leading-relaxed">

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">1. מחויבותנו לנגישות</h2>
                <p className="text-sm leading-[2]">
                  עידן לנדל״ן מחויב לאפשר לאנשים עם מוגבלויות גישה מלאה ושוויונית לתכני האתר,
                  בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות תשנ״ח-1998 ותקנות הנגישות
                  לשירות (תיקון מס׳ 19), וכן בהתאם להנחיות WCAG 2.1 ברמת AA.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">2. תקן הנגישות</h2>
                <p className="text-sm leading-[2]">
                  האתר פועל לעמוד בדרישות <strong className="text-cream">תקן ישראלי ת״י 5568</strong> המבוסס על
                  {" "}<strong className="text-cream">WCAG 2.1 ברמת AA</strong>.
                  תקן זה מחייב עסקים בישראל המספקים שירות לציבור לוודא שאתריהם נגישים מאז ינואר 2021.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">3. מה בוצע לשיפור הנגישות</h2>
                <ul className="text-sm leading-[2.2] list-disc list-inside space-y-2 marker:text-gold">
                  <li><strong className="text-cream">רכיב נגישות ייעודי</strong> — כפתור צף בפינת המסך המאפשר הגדלת טקסט (עד 125%), מצב ניגודיות גבוהה, עצירת אנימציות והדגשת קישורים; ההעדפות נשמרות בין ביקורים</li>
                  <li>מצב תצוגה בהיר/כהה לבחירת המשתמש</li>
                  <li>תוויות נגישות (aria) על הרכיבים האינטראקטיביים, כולל טפסים, חלונות דו-שיח ורשימות הצעות</li>
                  <li>טקסט חלופי (alt) תיאורי לתמונות התוכן באתר</li>
                  <li>ניגודיות צבעים העומדת בדרישות רמת AA, ובנוסף מצב ניגודיות גבוהה ייעודי ברכיב הנגישות</li>
                  <li>ניווט מקלדת — האלמנטים האינטראקטיביים נגישים ב-Tab, עם סימון פוקוס נראה; חלונות נסגרים ב-Escape</li>
                  <li>קישור "דלג לתוכן" בראש העמוד לניווט מהיר לקוראי מסך</li>
                  <li>תוויות מקושרות לשדות בכל הטפסים והכרזת שגיאות לקוראי מסך</li>
                  <li>מבנה כותרות היררכי ותמיכה בכיוון RTL (עברית) ו-LTR (אנגלית, צרפתית)</li>
                  <li>אנימציות מכבדות את הגדרת מערכת ההפעלה (prefers-reduced-motion) וניתנות לעצירה מלאה דרך רכיב הנגישות</li>
                  <li>גופנים ניתנים להגדלה ללא שבירת הפריסה</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">4. הסדרי נגישות באתר</h2>
                <p className="text-sm leading-[2]">
                  לפתיחת רכיב הנגישות לחצו על כפתור הנגישות העגול (סמל אדם) בפינה התחתונה של המסך,
                  או נווטו אליו באמצעות מקש Tab. מהרכיב ניתן להגדיל את הטקסט, להפעיל ניגודיות
                  גבוהה, לעצור אנימציות ולהדגיש קישורים — וההגדרות נשמרות לביקורים הבאים.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">5. מגבלות ידועות</h2>
                <p className="text-sm leading-[2]">
                  אנו עובדים באופן שוטף לשיפור הנגישות, וייתכן שחלקים מסוימים טרם הונגשו במלואם.
                  בנוסף, האתר משלב תכנים ושירותים של גורמים חיצוניים שאינם בשליטתנו הישירה — כגון
                  מפות מוטמעות (Google Maps, GovMap), נגני רשתות חברתיות ושירות WhatsApp — ונגישותם
                  תלויה בספקים אלה. נתקלתם בקושי? דווחו לנו ונדאג לחלופה נגישה.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">6. רכז הנגישות — דיווח על בעיות</h2>
                <p className="text-sm leading-[2] mb-4">
                  נתקלתם בבעיית נגישות? נשמח לדעת כדי לפתור אותה בהקדם.
                </p>
                <div className="border border-gray-dark rounded p-6 space-y-2">
                  <p className="text-sm"><span className="text-gold">שם:</span> עידן חולי — רכז נגישות</p>
                  <p className="text-sm">
                    <span className="text-gold">טלפון / WhatsApp:</span>{" "}
                    <a href="tel:+972549791171" className="hover:text-gold transition-colors">054-979-1171</a>
                  </p>
                  <p className="text-sm">
                    <span className="text-gold">מייל:</span>{" "}
                    <a href="mailto:idanlanadlan@gmail.com" className="hover:text-gold transition-colors">idanlanadlan@gmail.com</a>
                  </p>
                  <p className="text-sm"><span className="text-gold">כתובת:</span> הירקון 319, נמל ת"א</p>
                  <p className="text-sm text-gray-light mt-2">אנו מתחייבים לחזור תוך 5 ימי עסקים.</p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">7. רשות לנגישות</h2>
                <p className="text-sm leading-[2]">
                  אם לא קיבלתם מענה מספק, ניתן לפנות ל
                  <a
                    href="https://www.gov.il/he/departments/bureaus/disabilities-equal-rights-commission"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline mx-1"
                  >
                    הנציבות לשוויון זכויות של אנשים עם מוגבלות
                  </a>
                  במשרד המשפטים.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
