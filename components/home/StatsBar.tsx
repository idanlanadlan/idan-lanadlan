"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StatsBar() {
  const { t } = useLanguage();

  const stats: { value: string; label: string; ariaValue?: string }[] = [
    { value: "20+",           label: t.stats.experience },
    { value: "500+",          label: t.stats.deals },
    { value: "★ 5.0",         label: t.stats.rating, ariaValue: "דירוג 5.0 כוכבים" },
    { value: t.stats.office_value, label: t.stats.office },
  ];

  return (
    <section className="border-y border-gray-dark/40 bg-black" aria-label="נתונים עיקריים">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-around">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative flex-1 flex flex-col items-center py-10 px-6 text-center
                         [&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:absolute
                         [&:not(:last-child)]:after:top-1/4 [&:not(:last-child)]:after:end-0
                         [&:not(:last-child)]:after:h-1/2 [&:not(:last-child)]:after:w-px
                         [&:not(:last-child)]:after:bg-gray-dark/50 [&:not(:last-child)]:after:hidden
                         md:[&:not(:last-child)]:after:block"
            >
              <p
                className="font-display text-4xl sm:text-5xl font-extralight text-white mb-2 tracking-tight"
                aria-label={stat.ariaValue}
              >
                {stat.value}
              </p>
              <p className="text-[10px] tracking-[0.35em] text-gray-light uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
