"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronRight, ChevronLeft, ExternalLink } from "lucide-react";
import { mockTestimonials } from "@/lib/mock-data";

export default function Testimonials() {
  const testimonials = mockTestimonials.filter((t) => t.featured);
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">לקוחות מדברים</p>
          <div className="divider-gold mx-auto mb-6" />
          <h2 className="font-display text-4xl sm:text-5xl font-light text-white">
            מה אומרים עלינו
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="border-gold-glow rounded-xl p-8 sm:p-12 text-center"
            >
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-display text-xl sm:text-2xl text-cream font-light leading-relaxed mb-8 italic">
                &ldquo;{testimonials[current].text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center gap-1">
                <p className="font-semibold text-white text-sm">{testimonials[current].name}</p>
                {testimonials[current].source === "google" && (
                  <p className="text-xs text-gray-light flex items-center gap-1">
                    <span className="text-gold">★</span> ביקורת גוגל
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-dark flex items-center justify-center text-gray-light hover:border-gold hover:text-gold transition-colors"
              aria-label="הקודם"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-gold w-6" : "bg-gray-dark"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-dark flex items-center justify-center text-gray-light hover:border-gold hover:text-gold transition-colors"
              aria-label="הבא"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        {/* Google link */}
        <div className="text-center mt-10">
          <a
            href="https://maps.app.goo.gl/RG3BgZUUxTh1g9u89"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-light hover:text-gold transition-colors"
          >
            <ExternalLink size={14} />
            קרא את כל הביקורות בגוגל
          </a>
        </div>
      </div>
    </section>
  );
}
