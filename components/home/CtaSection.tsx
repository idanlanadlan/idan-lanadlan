"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-black to-charcoal" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">מוכנים לצעד הבא?</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
            בואו נמצא את
            <br />
            <span className="text-gold-gradient italic">הנכס המושלם שלכם</span>
          </h2>
          <p className="text-gray-light text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            מוכרים, קונים, משכירים או מחפשים השקעה — עידן חולי כאן לענות על כל שאלה ולהוביל אתכם לתוצאה הטובה ביותר.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-10 py-4 rounded-lg text-base flex items-center gap-3 text-lg"
            >
              <MessageCircle size={20} />
              שלח הודעה ב-WhatsApp
            </a>
            <a
              href="tel:+972549791171"
              className="btn-outline-gold px-10 py-4 rounded-lg text-base flex items-center gap-3"
            >
              <Phone size={18} />
              054-979-1171
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
