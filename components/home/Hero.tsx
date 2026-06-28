"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')",
        }}
      />
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />

      {/* Gold accent line */}
      <div
        className="absolute top-0 inset-x-0 h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-gold fill-gold" />
          ))}
          <span className="text-sm text-gold-light mr-2">5.0 בגוגל</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight mb-4"
        >
          הנדל״ן שלך{" "}
          <span className="text-gold-gradient italic">מגיע לך</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl text-gray-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          20 שנות ניסיון בתיווך ושיווק נדל״ן יוקרה באזור רמת השרון ותל אביב.
          <br />
          שקיפות מלאה, תוצאות אמיתיות.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/nadlan"
            className="btn-gold px-8 py-4 rounded text-base flex items-center gap-2"
          >
            <span>גלה נכסים</span>
            <ArrowLeft size={18} className="rtl-flip" />
          </Link>
          <a
            href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold px-8 py-4 rounded text-base"
          >
            דבר עם עידן
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-[0.25em] text-gray uppercase">גלול למטה</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
