"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CtaSection() {
  const { t } = useLanguage();
  const c = t.sections.cta;

  return (
    <section className="relative overflow-hidden border-y border-gray-dark/40">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28">
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-16">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[10px] tracking-[0.45em] text-gold/60 uppercase block mb-5">
              {c.eyebrow}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extralight text-white leading-[1.05]">
              {c.title1}
              <br />
              <em className="not-italic text-gold-gradient">{c.title2}</em>
            </h2>
            <p className="text-sm text-gray-light/60 mt-6 leading-[2] max-w-md">
              {c.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-4 min-w-[220px]"
          >
            <a
              href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-8 py-4 text-sm flex items-center justify-center gap-3"
            >
              <MessageCircle size={17} aria-hidden="true" />
              {c.whatsapp}
            </a>
            <a
              href="tel:+972549791171"
              className="btn-outline-gold px-8 py-4 text-sm flex items-center justify-center gap-3"
              aria-label="התקשר לעידן חולי"
            >
              <Phone size={16} aria-hidden="true" />
              054-979-1171
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
