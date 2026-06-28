"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "20+", label: "שנות ניסיון" },
  { value: "500+", label: "עסקאות שהושלמו" },
  { value: "★ 5.0", label: "דירוג בגוגל" },
  { value: "ת״א — ר״ש", label: "אזור פעילות" },
];

export default function StatsBar() {
  return (
    <section className="bg-charcoal border-y border-gray-dark py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="font-display text-3xl sm:text-4xl font-light text-gold">
                {stat.value}
              </p>
              <p className="text-xs tracking-wider text-gray-light mt-1 uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
