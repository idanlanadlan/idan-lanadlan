import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Link from "@/components/LocaleLink";

export const metadata: Metadata = {
  title: "תנאי שימוש | עידן לנדל״ן",
  description: "תנאי השימוש באתר עידן לנדל״ן.",
  robots: { index: false, follow: false },
};

const h2 = "font-display text-2xl text-white font-light mb-4";
const p = "text-sm leading-[2]";
const ul = "text-sm leading-[2.2] list-disc list-inside space-y-1 marker:text-gold";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">משפטי</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              תנאי שימוש
            </h1>
            <p className="text-gray-light text-sm">עדכון אחרון: יולי 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="space-y-10 text-gray-light leading-relaxed">

              <div>
                <h2 className={h2}>1. כללי והסכמה לתנאים</h2>
                <p className={p}>
                  אתר <em>idanlanadlan.co.il</em> (להלן: "האתר") מופעל על ידי עידן חולי — עידן לנדל״ן,
                  מתווך מורשה מס׳ רישיון <strong className="text-cream">3205360</strong>. הגלישה והשימוש
                  באתר מהווים הסכמה לתנאים אלה. אם אינכם מסכימים לתנאים — אנא הימנעו משימוש באתר.
                </p>
              </div>

              <div>
                <h2 className={h2}>2. אופי השירות והמידע באתר</h2>
                <ul className={ul}>
                  <li>האתר מציג מידע על נכסים, מאמרים מקצועיים וכלים חישוביים אינטראקטיביים</li>
                  <li><strong className="text-cream">המידע באתר אינו מהווה ייעוץ משפטי, מיסויי, פיננסי או שמאי</strong>, ואינו תחליף לייעוץ מקצועי פרטני</li>
                  <li>תוצאות המחשבונים והכלים (תשואה, משכנתא, מיסים, גוש/חלקה ועוד) הן <strong className="text-cream">הערכה להמחשה בלבד</strong>, על בסיס הנתונים שהוזנו ונתונים כלליים שעשויים להשתנות; אין להסתמך עליהן לביצוע עסקה ללא בדיקה מול הגורמים המוסמכים</li>
                  <li>פרטי הנכסים המוצגים עשויים להשתנות, להתעדכן או להימכר/להיות מושכרים בכל עת, ואינם מהווים הצעה מחייבת</li>
                </ul>
              </div>

              <div>
                <h2 className={h2}>3. שירותי תיווך</h2>
                <p className={p}>
                  שירותי תיווך במקרקעין ניתנים בהתאם לחוק המתווכים במקרקעין תשנ״ו-1996, וכפופים
                  לחתימה על הזמנת שירותי תיווך בכתב. הצגת נכס באתר או פנייה דרכו אינן יוצרות
                  כשלעצמן התחייבות לתיווך או זכאות לדמי תיווך, אלא בהתאם להסכם שייחתם.
                </p>
              </div>

              <div>
                <h2 className={h2}>4. היועץ הדיגיטלי (AI)</h2>
                <p className={p}>
                  הצ׳אט באתר מופעל באמצעות בינה מלאכותית ומספק מידע כללי בלבד. התשובות עשויות
                  להכיל אי-דיוקים או מידע שאינו מעודכן, ואין להסתמך עליהן ללא אימות מול גורם מוסמך.
                  השימוש בצ׳אט כפוף גם ל<Link href="/privacy" className="text-gold hover:underline">מדיניות הפרטיות</Link>.
                </p>
              </div>

              <div>
                <h2 className={h2}>5. קניין רוחני</h2>
                <p className={p}>
                  כל הזכויות בתכני האתר — טקסטים, עיצוב, לוגו, תמונות (למעט תמונות שסופקו על ידי
                  צדדים שלישיים) וקוד — שמורות לעידן לנדל״ן. אין להעתיק, לשכפל או לעשות שימוש מסחרי
                  בתכנים ללא אישור מראש ובכתב.
                </p>
              </div>

              <div>
                <h2 className={h2}>6. הגבלת אחריות וקישורים חיצוניים</h2>
                <ul className={ul}>
                  <li>האתר ותכניו מסופקים כפי שהם (As-Is); איננו מתחייבים לזמינות רציפה או להיעדר שגיאות</li>
                  <li>האתר מקושר לשירותים חיצוניים (וואטסאפ, מפות GovMap וגוגל, רשתות חברתיות) — איננו אחראים לתכניהם, לזמינותם או למדיניות הפרטיות שלהם</li>
                  <li>בכפוף לכל דין, לא נישא באחריות לנזק עקיף שנגרם מהסתמכות על מידע או כלי באתר</li>
                </ul>
              </div>

              <div>
                <h2 className={h2}>7. שימוש אסור</h2>
                <p className={p}>
                  אין לעשות באתר שימוש בלתי חוקי, לפגוע בפעולתו התקינה, לבצע כריית נתונים
                  אוטומטית או להזין תוכן פוגעני או שקרי בטפסים ובצ׳אט.
                </p>
              </div>

              <div>
                <h2 className={h2}>8. שינויים בתנאים, דין וסמכות שיפוט</h2>
                <p className={p}>
                  אנו רשאים לעדכן תנאים אלה מעת לעת; הנוסח המחייב הוא זה המפורסם באתר במועד השימוש.
                  על השימוש באתר יחול הדין הישראלי בלבד, וסמכות השיפוט הבלעדית נתונה לבתי המשפט
                  המוסמכים בתל אביב-יפו.
                </p>
              </div>

              <div>
                <h2 className={h2}>9. יצירת קשר</h2>
                <div className="border border-gray-dark rounded p-6 space-y-2">
                  <p className="text-sm"><span className="text-gold">שם:</span> עידן חולי — עידן לנדל״ן</p>
                  <p className="text-sm"><span className="text-gold">טלפון / WhatsApp:</span>{" "}
                    <a href="tel:+972549791171" className="hover:text-gold transition-colors">054-979-1171</a>
                  </p>
                  <p className="text-sm"><span className="text-gold">מייל:</span>{" "}
                    <a href="mailto:idanlanadlan@gmail.com" className="hover:text-gold transition-colors">idanlanadlan@gmail.com</a>
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
