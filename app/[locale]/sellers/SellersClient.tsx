"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Phone, MessageCircle, Shield, TrendingUp, Clock, Star, Award, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";

const BENEFIT_ICONS = [TrendingUp, Clock, Shield, Eye, Star, Award];

export default function SellersClient() {
  const { t } = useLanguage();
  const s = t.sellers;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">

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
              {s.eyebrow}
            </motion.p>
            <div className="divider-gold mb-6 mx-auto w-12" />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl font-light text-white mb-6 leading-tight"
            >
              {s.title_line1}
              <br />
              <span className="text-gold">{s.title_line2}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-light text-lg leading-relaxed max-w-2xl mx-auto mb-10"
            >
              {s.subtitle}
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
                {s.whatsapp_button}
              </a>
              <a
                href="tel:+972549791171"
                className="btn-outline-gold px-8 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                {s.phone_button}
              </a>
            </motion.div>
          </div>
        </section>

        {/* 6 Questions */}
        <section id="qa" className="py-20 bg-charcoal">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{s.qa_eyebrow}</p>
              <div className="divider-gold mb-4 mx-auto w-12" />
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white">
                {s.qa_title}
              </h2>
              <p className="text-gray-light mt-4">{s.qa_subtitle}</p>
            </div>

            <div className="flex flex-col gap-3">
              {s.faqs.map((faq, i) => (
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
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{s.comparison_eyebrow}</p>
              <div className="divider-gold mb-4 mx-auto w-12" />
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white">
                {s.comparison_title}
              </h2>
              <p className="text-gray-light mt-4">{s.comparison_subtitle}</p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-dark">
              {/* Header row */}
              <div className="grid grid-cols-3 bg-charcoal">
                <div className="px-5 py-4 text-xs tracking-widest text-gray-light uppercase">{s.comparison_header_aspect}</div>
                <div className="px-5 py-4 text-xs tracking-widest text-gold uppercase border-x border-gray-dark text-center">
                  {s.comparison_header_exclusive}
                </div>
                <div className="px-5 py-4 text-xs tracking-widest text-gray-light uppercase text-center">
                  {s.comparison_header_open}
                </div>
              </div>

              {s.comparison_rows.map((row, i) => (
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
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{s.benefits_eyebrow}</p>
              <div className="divider-gold mb-4 mx-auto w-12" />
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white">
                {s.benefits_title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {s.benefits.map(({ title, text }, i) => {
                const Icon = BENEFIT_ICONS[i];
                return (
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
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-24 bg-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-15"
            style={{ backgroundImage: "radial-gradient(ellipse at 40% 50%, #C9A96E44 0%, transparent 65%)" }}
          />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative">
            <p className="text-xs tracking-[0.35em] text-gold uppercase mb-3">{s.cta_eyebrow}</p>
            <div className="divider-gold mb-6 mx-auto w-12" />
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-4">
              {s.cta_title_line1}
              <br />
              <span className="text-gold">{s.cta_title_line2}</span>
            </h2>
            <p className="text-gray-light mb-10 leading-relaxed">{s.cta_subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93%20%D7%A2%D7%9C%20%D7%A9%D7%99%D7%95%D7%95%D7%A7%20%D7%94%D7%A0%D7%9B%D7%A1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-8 py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                {s.cta_whatsapp_button}
              </a>
              <a
                href="tel:+972549791171"
                className="btn-outline-gold px-8 py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                {s.cta_phone_button}
              </a>
            </div>
            <p className="mt-8 text-xs text-gray-light">{s.footer_note}</p>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
