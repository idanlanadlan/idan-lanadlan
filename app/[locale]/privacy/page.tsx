import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | עידן לנדל״ן",
  description: "מדיניות הפרטיות של עידן לנדל״ן — כיצד אנו אוספים ומשתמשים במידע.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">משפטי</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              מדיניות פרטיות
            </h1>
            <p className="text-gray-light text-sm">עדכון אחרון: יוני 2025</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 prose-luxury">
            <div className="space-y-10 text-gray-light leading-relaxed">

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">1. כללי</h2>
                <p className="text-sm leading-[2]">
                  עידן לנדל״ן (עידן חולי, מס׳ רישיון תיווך <strong className="text-cream">3205360</strong>) מחויב להגן על פרטיות המשתמשים
                  באתר <em>idanlanadlan.co.il</em> בהתאם לחוק הגנת הפרטיות תשמ״א-1981 ותקנותיו,
                  ולתקנות האיחוד האירופי (GDPR) ככל שחלות.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">2. המידע שנאסף</h2>
                <ul className="text-sm leading-[2.2] list-disc list-inside space-y-1 marker:text-gold">
                  <li>פרטי יצירת קשר שמסרתם מרצון (שם, מספר טלפון) דרך WhatsApp או שיחה טלפונית</li>
                  <li>נתוני גלישה אנונימיים: דפים שנצפו, משך שהייה, סוג דפדפן ומכשיר</li>
                  <li>העדפות שמורות מקומית: שפה וערכת נושא (אחסון בדפדפן בלבד — לא נשלחות לשרת)</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">3. מטרת האיסוף</h2>
                <ul className="text-sm leading-[2.2] list-disc list-inside space-y-1 marker:text-gold">
                  <li>מתן שירותי תיווך נדל״ן ומענה לפניות</li>
                  <li>שיפור חוויית הגלישה ואופטימיזציית האתר</li>
                  <li>ניתוח תנועה אנונימי לצרכי שיווק</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">4. העברה לצדדים שלישיים</h2>
                <p className="text-sm leading-[2]">
                  אין העברת מידע אישי מזהה לצדדים שלישיים ללא הסכמתכם המפורשת,
                  אלא אם נדרש על פי דין או צו שיפוטי. האתר עשוי להשתמש בשירותי ניתוח אנונימיים
                  (כגון Google Analytics) בהתאם למדיניות הפרטיות שלהם.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">5. עוגיות (Cookies)</h2>
                <p className="text-sm leading-[2] mb-3">
                  האתר משתמש בעוגיות מסוגים הבאים:
                </p>
                <ul className="text-sm leading-[2.2] list-disc list-inside space-y-1 marker:text-gold">
                  <li><strong className="text-cream">עוגיות טכניות הכרחיות</strong> — שמירת העדפות שפה וערכת נושא (לא ניתנות לביטול)</li>
                  <li><strong className="text-cream">עוגיות ניתוח</strong> — ניתוח תנועה אנונימי (ניתן לדחות בלחיצה על "דחה" בבאנר)</li>
                </ul>
                <p className="text-sm leading-[2] mt-3">
                  ניתן לנהל עוגיות דרך הגדרות הדפדפן שלכם בכל עת.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">6. אבטחת מידע</h2>
                <p className="text-sm leading-[2]">
                  אנו נוקטים באמצעי אבטחה סבירים להגנת המידע בהתאם לתקנות הגנת הפרטיות (אבטחת מידע)
                  תשע״ז-2017, לרבות שימוש בפרוטוקול HTTPS מוצפן לכל תעבורת האתר.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">7. זכויות המשתמש</h2>
                <p className="text-sm leading-[2] mb-3">
                  בהתאם לחוק הגנת הפרטיות תשמ״א-1981 ולתקנת GDPR (לתושבי האיחוד האירופי), עומדות לכם הזכויות הבאות:
                </p>
                <ul className="text-sm leading-[2.2] list-disc list-inside space-y-1 marker:text-gold">
                  <li>זכות עיון — לדעת אילו נתונים מוחזקים אודותיכם</li>
                  <li>זכות תיקון — לתקן מידע שגוי</li>
                  <li>זכות מחיקה — למחוק מידע אישי ("הזכות להישכח")</li>
                  <li>זכות ניידות — לקבל את המידע בפורמט קריא</li>
                </ul>
                <p className="text-sm leading-[2] mt-3">
                  לממש זכויות אלה, פנו אלינו בדרכי הקשר המפורטות למטה.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-white font-light mb-4">8. יצירת קשר לעניין פרטיות</h2>
                <div className="border border-gray-dark rounded p-6 space-y-2">
                  <p className="text-sm"><span className="text-gold">שם:</span> עידן חולי</p>
                  <p className="text-sm"><span className="text-gold">טלפון / WhatsApp:</span>{" "}
                    <a href="tel:+972549791171" className="hover:text-gold transition-colors">054-979-1171</a>
                  </p>
                  <p className="text-sm"><span className="text-gold">כתובת:</span> הירקון 319, נמל ת"א</p>
                </div>
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
