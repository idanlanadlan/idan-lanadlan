"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function CharReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.055,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen overflow-hidden md:grid md:grid-cols-[1fr_1fr]">

      {/* ── Text panel ── */}
      <div className="relative flex flex-col justify-center px-8 sm:px-14 pt-36 pb-20 md:pt-32 bg-black min-h-[65vh] md:min-h-screen">

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="text-[10px] tracking-[0.5em] text-gold/80 uppercase mb-8 block"
        >
          {t.hero.eyebrow}
        </motion.span>

        <h1
          className="font-display font-extralight leading-[0.9] text-white mb-10"
          style={{ fontSize: "clamp(2.8rem, 6.5vw, 7.5rem)" }}
        >
          {/* Line 1 — char-by-char blur reveal */}
          <span className="block">
            <CharReveal text={t.hero.line1} delay={0.15} />
          </span>

          {/* Separator — animated gold scan line */}
          <motion.span
            aria-hidden="true"
            className="block my-3 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.span
              className="block h-px w-full origin-right"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.92, duration: 0.7, ease: "easeOut" }}
              style={{
                background:
                  "linear-gradient(to left, #C9A96E 0%, #f5dfa0 50%, transparent 100%)",
              }}
            />
          </motion.span>

          {/* Line 2 — gold shimmer sweep */}
          <motion.em
            className="not-italic block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            style={{
              background:
                "linear-gradient(110deg, #C9A96E 0%, #C9A96E 20%, #f9e8b0 45%, #ffe9a0 50%, #f9e8b0 55%, #C9A96E 80%, #C9A96E 100%)",
              backgroundSize: "250% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer-sweep 5s linear infinite",
            }}
          >
            {t.hero.line2}
          </motion.em>
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 1.4, ease: "easeOut" }}
          className="w-14 h-px mb-10 origin-right"
          style={{ background: "linear-gradient(to left, rgba(201,169,110,0.5), transparent)" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-sm text-gray-light leading-[2] max-w-[17rem] mb-12"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.65 }}
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
          transition={{ delay: 2.0 }}
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
          style={{ backgroundImage: "url('/hero4-telaviv.jpg')" }}
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
          transition={{ delay: 1.8, duration: 0.7 }}
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
