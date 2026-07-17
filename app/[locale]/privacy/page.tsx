import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | עידן לנדל״ן",
  description: "מדיניות הפרטיות של עידן לנדל״ן — איזה מידע נאסף, לאיזו מטרה, למי הוא מועבר ומהן זכויותיכם.",
  robots: { index: false, follow: false },
};

const h2 = "font-display text-2xl text-white font-light mb-4";
const p = "text-sm leading-[2]";
const ul = "text-sm leading-[2.2] list-disc list-inside space-y-1 marker:text-gold";

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
            <p className="text-gray-light text-sm">עדכון אחרון: יולי 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 prose-luxury">
            <div className="space-y-10 text-gray-light leading-relaxed">

              <div>
                <h2 className={h2}>1. כללי</h2>
                <p className={p}>
                  עידן לנדל״ן (עידן חולי, מס׳ רישיון תיווך <strong className="text-cream">3205360</strong>) מחויב
                  להגן על פרטיות המשתמשים באתר <em>idanlanadlan.co.il</em> בהתאם לחוק הגנת הפרטיות
                  תשמ״א-1981 ותקנותיו, <strong className="text-cream">לרבות תיקון 13 לחוק</strong> (בתוקף
                  מאוגוסט 2025), ולתקנות האיחוד האירופי (GDPR) ככל שחלות. מסירת מידע באתר היא
                  וולונטרית — אינכם חייבים על פי חוק למסור מידע, אך בלעדיו לא נוכל לחזור אליכם.
                </p>
              </div>

              <div>
                <h2 className={h2}>2. המידע שנאסף — לפי ערוץ</h2>
                <ul className={ul}>
                  <li><strong className="text-cream">טופס יצירת קשר</strong> — סוג הפנייה, שם מלא, טלפון, עיר, ומייל (אם נמסר)</li>
                  <li><strong className="text-cream">טפסי ארגז הכלים</strong> (צ׳קליסט, שאלון התאמה, איתור גוש/חלקה ועוד) — שם, טלפון, מייל (אופציונלי) ופרטי החיפוש/הסימולציה שהזנתם (למשל כתובת או מספרי גוש וחלקה)</li>
                  <li><strong className="text-cream">טופס הצטרפות לקבוצות וואטסאפ</strong> — שם, טלפון, מה אתם מחפשים, תקציב ומטרת הנכס; הפרטים נשלחים כהודעת וואטסאפ מהמכשיר שלכם ישירות לעידן</li>
                  <li><strong className="text-cream">היועץ הדיגיטלי (צ׳אט AI)</strong> — תוכן השיחה בלבד, לצורך הפקת מענה; השיחה אינה נשמרת אצלנו לאחר סגירת החלון</li>
                  <li><strong className="text-cream">העדפות דפדפן</strong> — שפה, ערכת נושא, הגדרות נגישות ובחירת עוגיות נשמרות מקומית בדפדפן שלכם בלבד (localStorage) ואינן נשלחות לשרת</li>
                </ul>
              </div>

              <div>
                <h2 className={h2}>3. מטרות השימוש במידע</h2>
                <ul className={ul}>
                  <li>מענה לפנייתכם ומתן שירותי תיווך ושיווק נדל״ן</li>
                  <li>תיעוד הסכמות כנדרש על פי דין</li>
                  <li><strong className="text-cream">דיוור שיווקי (טלפון/וואטסאפ/מייל) — אך ורק אם סימנתם במפורש את תיבת ההסכמה הנפרדת</strong>, בהתאם לסעיף 30א לחוק התקשורת (תיקון 40, "חוק הספאם"). ניתן לבטל את ההסכמה בכל עת בהודעה חוזרת, בוואטסאפ או בטלפון, ונחדל מהדיוור בתוך 3 ימי עסקים</li>
                </ul>
              </div>

              <div>
                <h2 className={h2}>4. למי המידע מועבר (מעבדי מידע)</h2>
                <p className={`${p} mb-3`}>
                  איננו סוחרים במידע שלכם. המידע מועבר אך ורק לספקי השירות התפעוליים של האתר, בהיקף
                  המינימלי הנדרש:
                </p>
                <ul className={ul}>
                  <li><strong className="text-cream">Resend</strong> — שליחת התראת מייל על פנייתכם אל עידן</li>
                  <li><strong className="text-cream">Vercel</strong> — אירוח האתר ותשתית השרתים</li>
                  <li><strong className="text-cream">Supabase</strong> — מסד הנתונים של תוכן האתר (נכסים ומאמרים); פניותיכם אינן נשמרות בו</li>
                  <li><strong className="text-cream">נדל״ן וואן (Nadlan One)</strong> — מערכת ניהול הלידים המשרדית, אליה עשויה פנייה מטופס יצירת הקשר להיות מועברת</li>
                  <li><strong className="text-cream">Anthropic</strong> — עיבוד שיחות היועץ הדיגיטלי (AI)</li>
                  <li><strong className="text-cream">GovMap / המרכז למיפוי ישראל</strong> — בכלי איתור גוש/חלקה ובמפות, שאילתת הכתובת שהקלדתם נשלחת לשירות הממשלתי לצורך האיתור</li>
                  <li><strong className="text-cream">WhatsApp (Meta)</strong> — כאשר בחרתם ליצור קשר או להצטרף לקבוצה דרך וואטסאפ</li>
                </ul>
                <p className={`${p} mt-3`}>
                  חלק מהספקים מאחסנים מידע מחוץ לישראל; ההעברה נעשית בכפוף לתקנות הגנת הפרטיות
                  (העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה). מעבר לכך, מידע אישי לא יועבר
                  לצד שלישי ללא הסכמתכם, אלא אם נדרש על פי דין או צו שיפוטי.
                </p>
              </div>

              <div>
                <h2 className={h2}>5. עוגיות ואחסון מקומי</h2>
                <p className={p}>
                  האתר משתמש <strong className="text-cream">באחסון מקומי ובעוגיות פונקציונליות בלבד</strong> —
                  לשמירת העדפות השפה, ערכת הנושא, הגדרות הנגישות ובחירתכם בבאנר העוגיות.{" "}
                  <strong className="text-cream">איננו מפעילים כלי אנליטיקה, פיקסלים פרסומיים או מעקב
                  שיווקי כלשהו.</strong> ניתן למחוק את הנתונים המקומיים בכל עת דרך הגדרות הדפדפן.
                </p>
              </div>

              <div>
                <h2 className={h2}>6. תקופת שמירת המידע</h2>
                <p className={p}>
                  פניות שהתקבלו נשמרות בתיבת המייל העסקית ובמערכת ניהול הלידים כל עוד הדבר נדרש
                  לטיפול בפנייה, לקיום קשר עסקי או לעמידה בחובות על פי דין. ניתן לבקש מחיקה בכל עת
                  (ראו סעיף 8) ונפעל בהתאם, בכפוף לחובות שמירה חוקיות.
                </p>
              </div>

              <div>
                <h2 className={h2}>7. אבטחת מידע</h2>
                <p className={p}>
                  אנו נוקטים אמצעי אבטחה בהתאם לתקנות הגנת הפרטיות (אבטחת מידע) תשע״ז-2017:
                  כל תעבורת האתר מוצפנת (HTTPS), הגישה למידע מוגבלת לעידן חולי בלבד, ופרטי הפניות
                  אינם נשמרים במסד הנתונים הציבורי של האתר.
                </p>
              </div>

              <div>
                <h2 className={h2}>8. זכויותיכם</h2>
                <p className={`${p} mb-3`}>
                  על פי חוק הגנת הפרטיות (כולל תיקון 13), עומדות לכם הזכויות הבאות:
                </p>
                <ul className={ul}>
                  <li>זכות עיון — לדעת אילו נתונים מוחזקים אודותיכם</li>
                  <li>זכות תיקון — לתקן מידע שגוי או לא מעודכן</li>
                  <li>זכות מחיקה — לבקש מחיקת מידע אישי</li>
                  <li>זכות לביטול הסכמה לדיוור — בכל עת וללא נימוק</li>
                </ul>
                <p className={`${p} mt-3`}>
                  לא נענינו לפנייתכם? ניתן לפנות לרשות להגנת הפרטיות (
                  <a
                    href="https://www.gov.il/he/departments/the_privacy_protection_authority"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    gov.il
                  </a>
                  ).
                </p>
              </div>

              <div>
                <h2 className={h2}>9. יצירת קשר לעניין פרטיות</h2>
                <div className="border border-gray-dark rounded p-6 space-y-2">
                  <p className="text-sm"><span className="text-gold">שם:</span> עידן חולי</p>
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
