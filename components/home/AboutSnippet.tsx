"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutSnippet() {
  const { t } = useLanguage();
  const a = t.sections.about;

  const [quoteLine1, quoteLine2] = a.quote.split("\n");

  return (
    <section className="py-28 bg-charcoal overflow-hidden" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 border border-gold/15 translate-x-3 -translate-y-3 pointer-events-none" aria-hidden="true" />
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <Image
                src="/idan-photo.jpg"
                alt="עידן חולי — מנהל עידן לנדל״ן"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal/60 to-transparent" aria-hidden="true" />
            </div>
            <div className="absolute bottom-6 end-0 translate-x-4 bg-black border border-gold/20 px-6 py-5" aria-label="20 שנות ניסיון">
              <p className="font-display text-4xl text-gold font-extralight leading-none">20+</p>
              <p className="text-[10px] text-gray-light/60 mt-2 tracking-[0.3em] uppercase">שנות ניסיון</p>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span id="about-heading" className="text-[10px] tracking-[0.45em] text-gold/60 uppercase block mb-5">
              {a.eyebrow}
            </span>

            <blockquote className="font-display text-2xl sm:text-3xl text-white font-extralight leading-snug mb-8 border-s-2 border-gold/30 ps-6 italic">
              {quoteLine1}
              <br />
              {quoteLine2}
            </blockquote>

            <p className="text-sm text-gray-light/70 leading-[2] mb-4">
              אחרי כ-20 שנה בליווי לקוחות בתהליכי קבלת החלטות פיננסיות ובהשקעות נדל״ן פרטיות,
              הפכתי את התשוקה לקריירה מלאה: למצוא לכם בית נכון או השקעה נכונה.
            </p>
            <p className="text-sm text-gray-light/70 leading-[2] mb-10">
              אני מאמין בשקיפות מלאה, חשיבה יצירתית בעסקאות מורכבות, ונחישות להביא תוצאה איפה שאחרים נופלים.
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-12 border-t border-gray-dark/50 pt-8">
              {[
                ["20+", "שנות ניסיון"],
                ["500+", "עסקאות"],
                ["נמל ת״א", "כתובת המשרד"],
                ["★ 5.0", "גוגל"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className="font-display text-xl text-gold font-light">{val}</p>
                  <p className="text-[11px] text-gray-light/50 mt-0.5 tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs tracking-widest text-gold/70 hover:text-gold transition-colors duration-300 uppercase border-b border-gold/20 hover:border-gold/60 pb-0.5"
            >
              {a.read_more}
              <ArrowLeft size={13} className="rtl-flip" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
