"use client";

import { motion } from "framer-motion";

export default function SocialFeed() {
  return (
    <section className="py-24 bg-charcoal" aria-labelledby="social-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3" aria-hidden="true">עקבו אחרינו</p>
          <div className="divider-gold mx-auto mb-6" aria-hidden="true" />
          <h2 id="social-heading" className="font-display text-4xl font-light text-white">
            ברשתות החברתיות
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Facebook Page Plugin */}
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
                href="https://www.facebook.com/profile.php?id=100086018108373"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold hover:text-gold-light transition-colors"
                aria-label="לעמוד הפייסבוק של עידן לנדל״ן (נפתח בחלון חדש)"
              >
                לעמוד הפייסבוק שלנו ←
              </a>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-dark">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100086018108373&tabs=timeline&width=500&height=400&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
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

          {/* TikTok + LinkedIn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* TikTok */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-white" aria-hidden="true">TikTok</span>
                <a
                  href="https://www.tiktok.com/@idan.lanadlan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold hover:text-gold-light transition-colors"
                  aria-label="לחשבון TikTok של עידן לנדל״ן (נפתח בחלון חדש)"
                >
                  @idan.lanadlan ←
                </a>
              </div>
              <div className="border border-gray-dark rounded-lg p-6 flex flex-col items-center gap-4 bg-black/30">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-white" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.53V6.77a4.85 4.85 0 01-1.01-.08z" />
                </svg>
                <p className="text-sm text-gray-light text-center">
                  תוכן נדל״ן, טיפים ועדכונים שוק
                </p>
                <a
                  href="https://www.tiktok.com/@idan.lanadlan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold px-6 py-2 rounded text-sm"
                  aria-label="עבור לחשבון TikTok (נפתח בחלון חדש)"
                >
                  עבור ל-TikTok
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-white" aria-hidden="true">LinkedIn</span>
                <a
                  href="https://www.linkedin.com/in/idan-huli/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold hover:text-gold-light transition-colors"
                  aria-label="לפרופיל LinkedIn המקצועי של עידן חולי (נפתח בחלון חדש)"
                >
                  לפרופיל LinkedIn המקצועי שלנו ←
                </a>
              </div>
              <div className="border border-gray-dark rounded-lg p-6 flex flex-col items-center gap-4 bg-black/30">
                <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#0A66C2]" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <p className="text-sm text-gray-light text-center">
                  ניסיון מקצועי ורשת קשרים עסקיים
                </p>
                <a
                  href="https://www.linkedin.com/in/idan-huli/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold px-6 py-2 rounded text-sm"
                  aria-label="עבור לפרופיל LinkedIn (נפתח בחלון חדש)"
                >
                  עבור ל-LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
