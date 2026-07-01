"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import type { Property } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: Props) {
  const { t } = useLanguage();
  const p = t.sections.properties;
  const featured = properties.slice(0, 3);

  return (
    <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6" aria-labelledby="properties-heading">

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-14"
      >
        <div>
          <span className="text-[10px] tracking-[0.45em] text-gold uppercase block mb-5" aria-hidden="true">
            {p.eyebrow}
          </span>
          <h2
            id="properties-heading"
            className="font-display text-4xl sm:text-5xl font-extralight text-white leading-tight"
          >
            {p.title}
          </h2>
        </div>
        <Link
          href="/nadlan"
          className="hidden sm:flex items-center gap-2 text-xs tracking-widest text-gray-light hover:text-gold transition-colors duration-300 uppercase"
        >
          {p.all}
          <ArrowLeft size={14} className="rtl-flip" aria-hidden="true" />
        </Link>
      </motion.div>

      {featured.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <PropertyCard property={featured[0]} variant="large" />
        </motion.div>
      )}

      {featured.length === 2 && (
        <div className="grid md:grid-cols-2 gap-3">
          {featured.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      )}

      {featured.length >= 3 && (
        <div className="grid md:grid-cols-[2fr_1fr] gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:row-span-2"
          >
            <PropertyCard property={featured[0]} variant="large" />
          </motion.div>
          {featured.slice(1, 3).map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.6 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center sm:hidden">
        <Link
          href="/nadlan"
          className="btn-outline-gold px-8 py-3 text-sm inline-flex items-center gap-2"
        >
          {p.all}
          <ArrowLeft size={14} className="rtl-flip" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
