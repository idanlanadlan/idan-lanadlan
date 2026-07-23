"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { pickCopy } from "@/lib/site-copy";
import { safeJsonLd } from "@/lib/json-ld";

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const { t, locale } = useLanguage();
  const settings = useSettings();
  const faq = t.sections.faq;
  const faqs = faq.items;
  const eyebrow = pickCopy(settings, "faq_eyebrow", locale, faq.eyebrow);
  const title = pickCopy(settings, "faq_title", locale, faq.title);
  const subtitle = pickCopy(settings, "faq_subtitle", locale, faq.subtitle);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="py-24 bg-black" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3" aria-hidden="true">{eyebrow}</p>
          <div className="divider-gold mx-auto mb-6" aria-hidden="true" />
          <h2 id="faq-heading" className="font-display text-4xl font-light text-white">
            {title}
          </h2>
          <p className="text-gray-light mt-3 text-sm">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(201,169,110,0.2)" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-right bg-charcoal hover:bg-charcoal/80 transition-colors"
                aria-expanded={open === i}
              >
                <span className="text-sm font-medium text-white leading-relaxed">{faq.q}</span>
                {open === i ? (
                  <Minus size={16} className="text-gold shrink-0" />
                ) : (
                  <Plus size={16} className="text-gold shrink-0" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 py-4 text-sm text-gray-light leading-relaxed bg-black/30">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
