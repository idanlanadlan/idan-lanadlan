"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { mockTestimonials } from "@/lib/mock-data";

export default function Testimonials() {
  const testimonials = mockTestimonials.filter((t) => t.featured).slice(0, 6);

  return (
    <section className="py-28 bg-black" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[10px] tracking-[0.45em] text-gold uppercase block mb-5" aria-hidden="true">
            לקוחות מדברים
          </span>
          <h2 id="testimonials-heading" className="font-display text-4xl sm:text-5xl font-extralight text-white">
            מה אומרים עלינו
          </h2>
        </motion.div>

        {/* Grid — hairline separators via gap + parent bg */}
        <div className="grid md:grid-cols-3 gap-px bg-gray-dark/25">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="bg-black px-7 py-10 flex flex-col"
            >
              {/* Large decorative quote mark */}
              <span
                className="font-display text-[5rem] leading-none text-gold/10 mb-2 block select-none"
                aria-hidden="true"
              >
                ״
              </span>

              {/* Review text */}
              <blockquote className="text-sm text-gray-light leading-[1.85] flex-1 mb-8">
                {t.text}
              </blockquote>

              {/* Author row */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-xs text-cream font-medium">{t.name}</p>
                  {t.source === "google" && (
                    <p className="text-[10px] text-gold mt-0.5 tracking-wider">ביקורת גוגל</p>
                  )}
                </div>
                <div
                  role="img"
                  aria-label={`דירוג: ${t.rating} מתוך 5 כוכבים`}
                  className="flex gap-0.5"
                >
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-gold text-xs" aria-hidden="true">★</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href="https://maps.app.goo.gl/RG3BgZUUxTh1g9u89"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-widest text-gray-light hover:text-gold transition-colors duration-300 uppercase"
            aria-label="כל הביקורות בגוגל (נפתח בחלון חדש)"
          >
            <ExternalLink size={12} aria-hidden="true" />
            כל הביקורות בגוגל
          </a>
        </motion.div>
      </div>
    </section>
  );
}
