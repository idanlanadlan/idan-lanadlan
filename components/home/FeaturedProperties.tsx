"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { mockProperties } from "@/lib/mock-data";

export default function FeaturedProperties() {
  const featured = mockProperties.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">נכסים נבחרים</p>
          <div className="divider-gold mb-4" />
          <h2 className="font-display text-4xl sm:text-5xl font-light text-white">
            הנכסים שלנו
          </h2>
        </div>
        <Link
          href="/nadlan"
          className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
        >
          כל הנכסים
          <ArrowLeft size={16} className="rtl-flip" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center sm:hidden">
        <Link
          href="/nadlan"
          className="btn-outline-gold px-8 py-3 rounded text-sm"
        >
          כל הנכסים
        </Link>
      </div>
    </section>
  );
}
