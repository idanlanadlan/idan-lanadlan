"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function SocialFeed() {
  const { t } = useLanguage();
  const s = useSettings();
  const so = t.sections.social;

  return (
    <section className="py-24 bg-charcoal" aria-labelledby="social-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3" aria-hidden="true">{so.eyebrow}</p>
          <div className="divider-gold mx-auto mb-6" aria-hidden="true" />
          <h2 id="social-heading" className="font-display text-4xl font-light text-white">
            {so.title}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-8">
          {/* Facebook Page Plugin — the only platform with a real live embed available */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-white" aria-hidden="true">Facebook</span>
              <a
                href={s.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold hover:text-gold-light transition-colors"
              >
                {so.facebook_link}
              </a>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-dark">
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(s.facebook)}&tabs=timeline&width=500&height=400&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`}
                width="100%"
                height="400"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="עמוד פייסבוק של עידן לנדל״ן"
              />
            </div>
          </motion.div>

          {/* Instagram + TikTok + LinkedIn — "follow us" cards (no live profile embed available on these platforms) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-1 gap-4"
          >
            {/* Instagram */}
            <div className="border border-gray-dark rounded-lg p-5 flex items-center gap-4 bg-black/30 hover:border-gold/30 transition-colors">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" }}>
                <InstagramIcon className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Instagram</p>
                <p className="text-xs text-gray-light line-clamp-1">{so.instagram_description}</p>
              </div>
              <a
                href={s.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-4 py-2 rounded text-xs shrink-0"
              >
                {so.instagram_button}
              </a>
            </div>

            {/* TikTok */}
            <div className="border border-gray-dark rounded-lg p-5 flex items-center gap-4 bg-black/30 hover:border-gold/30 transition-colors">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-black">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-white" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.53V6.77a4.85 4.85 0 01-1.01-.08z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">TikTok</p>
                <p className="text-xs text-gray-light line-clamp-1">{so.tiktok_description}</p>
              </div>
              <a
                href={s.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-4 py-2 rounded text-xs shrink-0"
              >
                {so.tiktok_button}
              </a>
            </div>

            {/* LinkedIn */}
            <div className="border border-gray-dark rounded-lg p-5 flex items-center gap-4 bg-black/30 hover:border-gold/30 transition-colors">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-[#0A66C2]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">LinkedIn</p>
                <p className="text-xs text-gray-light line-clamp-1">{so.linkedin_description}</p>
              </div>
              <a
                href={s.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-4 py-2 rounded text-xs shrink-0"
              >
                {so.linkedin_button}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
