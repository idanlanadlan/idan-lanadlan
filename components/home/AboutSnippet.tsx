"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle } from "lucide-react";

const highlights = [
  "20 שנות ניסיון בנדל״ן",
  "מאות עסקאות מוצלחות",
  "שקיפות מלאה בכל שלב",
  "ייעוץ אישי ומקצועי",
];

export default function AboutSnippet() {
  return (
    <section className="py-24 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image placeholder — replace with actual photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden h-96 relative">
              <Image
                src="/idan-photo.jpg"
                alt="עידן חולי — עידן לנדל״ן"
                fill
                className="object-cover object-top"
              />
            </div>
            {/* Gold frame accent */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-gold rounded-lg opacity-40" />
            <div className="absolute -top-4 -left-4 w-20 h-20 border border-gold rounded-lg opacity-20" />
            {/* Badge */}
            <div className="absolute bottom-6 left-6 bg-black/90 border border-gold/30 rounded-lg px-5 py-4">
              <p className="font-display text-3xl text-gold font-light">20+</p>
              <p className="text-xs text-gray-light mt-1">שנות ניסיון</p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">אודות</p>
            <div className="divider-gold mb-6" />
            <h2 className="font-display text-4xl sm:text-5xl font-light text-white mb-6 leading-tight">
              הנדל״ן שלך
              <br />
              <span className="text-gold-gradient italic">בידיים בטוחות</span>
            </h2>
            <p className="text-gray-light leading-relaxed mb-4">
              אחרי כ-20 שנה בליווי לקוחות בתהליכי קבלת החלטות פיננסיות ובהשקעות נדל״ן פרטיות,
              הפכתי את התשוקה לקריירה מלאה: למצוא לכם בית נכון או השקעה נכונה — עסקה שמשנה חיים.
            </p>
            <p className="text-gray-light leading-relaxed mb-8">
              אני מאמין בשקיפות מלאה, חשיבה יצירתית בעסקאות מורכבות, ונחישות להביא תוצאה איפה שאחרים נופלים.
            </p>

            <ul className="flex flex-col gap-3 mb-8">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-cream">
                  <CheckCircle size={16} className="text-gold shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="btn-outline-gold px-8 py-3 rounded text-sm inline-flex items-center gap-2"
            >
              קרא עוד עלי
              <ArrowLeft size={16} className="rtl-flip" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
