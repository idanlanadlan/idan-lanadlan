"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Phone, MessageCircle, Shield, TrendingUp, Clock, Star, Award, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const faqs = [
  {
    q: "אם אתן בלעדיות למתווך אחד — האם אני לא חושף את הנכס לפחות קונים?",
    a: "להפך. מתווך ללא בלעדיות לא ישקיע בשיווק הנכס — כי אחר יכול לסגור לפניו ולגזול את העמלה. מתווך עם בלעדיות משקיע צילום מקצועי, פרסום ממומן, הבאת קונים רציניים, ומוכר את הנכס שלך ולא של כולם. תוצאה: יותר קונים, פחות בלאגן.",
  },
  {
    q: "מה קורה אם אני מוצא קונה לבד — חבר, שכן, מכר?",
    a: "בהסכם בלעדיות שאנחנו עורכים, אפשר להגדיר רשימה חריגים מראש — אנשים שידועים לך שמתעניינים. אם אחד מהם קונה, לא משולמת עמלה. כל השאר — עם ליווי מלא.",
  },
  {
    q: "כמה זמן נמשכת הבלעדיות — ומה אם הנכס לא נמכר?",
    a: "בדרך כלל 3–6 חודשים. אם הנכס לא נמכר בתקופה זו — הבלעדיות פוקעת ואתה חופשי. במציאות, נכסים עם שיווק נכון נמכרים הרבה יותר מהר מהממוצע. אני לוקח על עצמי מחויבות, לא מבטיח ריק.",
  },
  {
    q: "כמה עולה דמי התיווך בבלעדיות?",
    a: "2% + מע\"מ מהמוכר — הסטנדרט בשוק. אבל ההחזר על ההשקעה הזו הוא עצום: שיווק ממומן שעולה אלפי שקלים, צילום מקצועי, הצגות מנוהלות, משא ומתן מקצועי שמצדיק את המחיר — הכל נכלל.",
  },
  {
    q: "מה בדיוק אתה עושה שאני לא יכול לעשות לבד?",
    a: "אתה יכול לעלות ליד 2 או Homeless — אני מפרסם בכולם בו-זמנית, עם פרסום ממומן ממוקד, צילום ווידאו מקצועי, הצגות מסוננות (רק קונים רציניים), ניהול משא ומתן בשמך, ליווי עד חוזה וסיום עסקה. בנוסף — רשת קשרים ומאגר קונים פעיל.",
  },
  {
    q: "האם הנכס שלי ימכר במחיר טוב יותר עם בלעדיות?",
    a: "כן. שיווק חזק יוצר תחרות בין קונים — ותחרות מעלה מחירים. נכס שמופיע בכל מקום עם תמונות מקצועיות, הסתר נכון ומחיר מושחז מושך הצעות טובות יותר. בנכסי יוקרה, ההפרש יכול להגיע לעשרות אלפי שקלים.",
  },
];

const comparison = [
  {
    aspect: "השקעה בשיווק",
    exclusive: "מקסימלית — פרסום ממומן, צילום מקצועי, וידאו",
    open: "מינימלית — אין תמריץ להשקיע",
  },
  {
    aspect: "מחיר מכירה",
    exclusive: "גבוה יותר — תחרות בין קונים",
    open: "נמוך יותר — אין לחץ על הקונה",
  },
  {
    aspect: "זמן מכירה",
    exclusive: "קצר יותר — שיווק ממוקד ואינטנסיבי",
    open: "ארוך יותר — פיזור מאמצים",
  },
  {
    aspect: "הצגות הנכס",
    exclusive: "מסוננות — רק קונים רציניים עם יכולת",
    open: "לא מסוננות — עלולות לבזבז זמן",
  },
  {
    aspect: "מאמץ מהמוכר",
    exclusive: "מינימלי — הכל מנוהל",
    open: "גבוה — ריכוז עם מספר גורמים",
  },
  {
    aspect: "שקט נפשי",
    exclusive: "אדם אחד אחראי, אחד שעונה",
    open: "בלבול — כל מתווך אומר משהו אחר",
  },
];

const benefits = [
  { icon: TrendingUp, title: "מחיר גבוה יותר", text: "שיווק מקצועי יוצר תחרות בין קונים" },
  { icon: Clock, title: "מכירה מהירה יותר", text: "אינטנסיביות שיווקית מקצרת את הדרך" },
  { icon: Shield, title: "הגנה מלאה", text: "ליווי מקצועי בכל שלבי העסקה" },
  { icon: Eye, title: "חשיפה מקסימלית", text: "כל הפלטפורמות + פרסום ממומן ממוקד" },
  { icon: Star, title: "קונים מסוננים בלבד", text: "רק רוכשים רציניים עם יכולת פיננסית" },
  { icon: Award, title: "מומחיות נדל\"ן יוקרה", text: "ניסיון בנכסי יוקרה בתל אביב" },
];

export default function SellersPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-24">

        {/* Hero */}
        <section className="relative py-24 overflow-hidden bg-black">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(ellipse at 60% 50%, #C9A96E33 0%, transparent 70%)" }}
          />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-[0.35em] text-gold uppercase mb-4"
            >
              בעלי נכסים
            </motion.p>
            <div className="divider-gold mb-6 mx-auto w-12" />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl font-light text-white mb-6 leading-tight"
            >
              למה בלעדיות
              <br />
              <span className="text-gold">משתלמת לך?</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-light text-lg leading-relaxed max-w-2xl mx-auto mb-10"
            >
              6 השאלות שכל בעל נכס שואל — ותשובות ישרות. בלי שטויות, בלי לחצים.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93%20%D7%A2%D7%9C%20%D7%91%D7%9C%D7%A2%D7%93%D7%99%D7%95%D7%AA"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-8 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                שוחח עם עידן ב-WhatsApp
              </a>
              <a
                href="tel:+972549791171"
                className="btn-outline-gold px-8 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                054-979-1171
              </a>
            </motion.div>
          </div>
        </section>

        {/* 6 Questions */}
        <section id="qa" className="py-20 bg-charcoal">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">שאלות ותשובות</p>
              <div className="divider-gold mb-4 mx-auto w-12" />
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white">
                6 השאלות הקשות
              </h2>
              <p className="text-gray-light mt-4">שאלות שכל מוכר שואל — תשובות גלויות וישרות</p>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-gray-dark overflow-hidden"
                  style={{ background: "#111" }}
                >
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right"
                    aria-expanded={openIdx === i}
                  >
                    <span className="text-sm font-semibold text-white leading-snug">{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-gold shrink-0 transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-6 pb-5 text-sm text-gray-light leading-relaxed border-t border-gray-dark/50 pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section id="comparison" className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">השוואה</p>
              <div className="divider-gold mb-4 mx-auto w-12" />
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white">
                בלעדיות מול פתוחה
              </h2>
              <p className="text-gray-light mt-4">מה ההבדל בפועל — מספרים וסיבות</p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-dark">
              {/* Header row */}
              <div className="grid grid-cols-3 bg-charcoal">
                <div className="px-5 py-4 text-xs tracking-widest text-gray-light uppercase">נושא</div>
                <div className="px-5 py-4 text-xs tracking-widest text-gold uppercase border-x border-gray-dark text-center">
                  עם בלעדיות ✓
                </div>
                <div className="px-5 py-4 text-xs tracking-widest text-gray-light uppercase text-center">
                  ללא בלעדיות
                </div>
              </div>

              {comparison.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 border-t border-gray-dark ${i % 2 === 0 ? "bg-black" : "bg-[#0d0d0d]"}`}
                >
                  <div className="px-5 py-4 text-sm font-semibold text-cream">{row.aspect}</div>
                  <div className="px-5 py-4 text-sm text-gold border-x border-gray-dark flex items-start gap-2">
                    <Check size={14} className="mt-0.5 shrink-0" />
                    {row.exclusive}
                  </div>
                  <div className="px-5 py-4 text-sm text-gray-light flex items-start gap-2">
                    <X size={14} className="mt-0.5 shrink-0 text-gray-dark" />
                    {row.open}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits grid */}
        <section className="py-20 bg-charcoal">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">מה מקבלים</p>
              <div className="divider-gold mb-4 mx-auto w-12" />
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white">
                הבלעדיות שלי כוללת
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map(({ icon: Icon, title, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-gray-dark p-6"
                  style={{ background: "#111" }}
                >
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                  <p className="text-xs text-gray-light leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-24 bg-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-15"
            style={{ backgroundImage: "radial-gradient(ellipse at 40% 50%, #C9A96E44 0%, transparent 65%)" }}
          />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative">
            <p className="text-xs tracking-[0.35em] text-gold uppercase mb-3">בואו נדבר</p>
            <div className="divider-gold mb-6 mx-auto w-12" />
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-4">
              רוצים לדעת כמה שווה
              <br />
              <span className="text-gold">הנכס שלכם?</span>
            </h2>
            <p className="text-gray-light mb-10 leading-relaxed">
              שיחת ייעוץ ראשונית ללא עלות — עידן יסביר בדיוק מה השיווק יכלול, תוך כמה זמן אפשר למכור, ובאיזה מחיר.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93%20%D7%A2%D7%9C%20%D7%A9%D7%99%D7%95%D7%95%D7%A7%20%D7%94%D7%A0%D7%9B%D7%A1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-8 py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                שלח הודעה ב-WhatsApp
              </a>
              <a
                href="tel:+972549791171"
                className="btn-outline-gold px-8 py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                054-979-1171
              </a>
            </div>
            <p className="mt-8 text-xs text-gray-light">
              עידן חולי — עידן לנדל״ן &nbsp;·&nbsp; רישיון תיווך 3205360 &nbsp;·&nbsp; ★ 5.0 בגוגל
            </p>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
