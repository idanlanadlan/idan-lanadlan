"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen overflow-hidden md:grid md:grid-cols-[1fr_1fr]">

      {/* ── Text panel — RIGHT in RTL / LEFT in LTR ── */}
      <div className="relative flex flex-col justify-center px-8 sm:px-14 pt-32 pb-20 md:pt-28 bg-black min-h-[65vh] md:min-h-screen">

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="text-[10px] tracking-[0.5em] text-gold/50 uppercase mb-10 block"
        >
          {t.hero.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extralight leading-[0.87] text-white mb-10"
          style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
        >
          {t.hero.line1}
          <br />
          <em className="not-italic text-gold-gradient">{t.hero.line2}</em>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
          className="w-14 h-px mb-10 origin-right"
          style={{ background: "linear-gradient(to left, rgba(201,169,110,0.5), transparent)" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="text-sm text-gray-light leading-[2] max-w-[17rem] mb-12"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex items-center gap-8"
        >
          <Link
            href="/nadlan"
            className="btn-gold px-7 py-3.5 text-sm inline-flex items-center gap-2"
          >
            {t.hero.cta_properties}
            <ArrowLeft size={15} className="rtl-flip" />
          </Link>
          <a
            href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-light hover:text-gold transition-colors duration-300 underline underline-offset-4 decoration-gray-dark/40 hover:decoration-gold/40"
          >
            {t.hero.cta_contact}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-10 end-14 hidden md:block"
          aria-hidden="true"
        >
          <div className="w-px h-14 bg-gradient-to-b from-gold/30 to-transparent mx-auto" />
        </motion.div>
      </div>

      {/* ── Image panel ── */}
      <div className="relative min-h-[55vw] md:min-h-screen" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85')",
          }}
        />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, transparent 55%, rgba(10,10,10,0.35) 100%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="absolute bottom-8 start-8 bg-black/70 backdrop-blur-sm border border-white/10 px-5 py-4"
          role="img"
          aria-label="דירוג גוגל: 5 מתוך 5 כוכבים"
        >
          <p className="font-display text-2xl text-gold font-light tracking-wide" aria-hidden="true">★ 5.0</p>
          <p className="text-[9px] text-gray-light mt-1 tracking-[0.25em] uppercase">
            {t.hero.rating}
          </p>
        </motion.div>
      </div>

    </section>
  );
}
