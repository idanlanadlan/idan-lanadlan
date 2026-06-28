"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PropertyCard from "@/components/properties/PropertyCard";
import { mockProperties } from "@/lib/mock-data";
import type { PropertyType } from "@/lib/types";
import { motion } from "framer-motion";

const filterOptions: { value: PropertyType | "all"; label: string }[] = [
  { value: "all", label: "הכל" },
  { value: "sale", label: "למכירה" },
  { value: "rent", label: "להשכרה" },
  { value: "project", label: "פרויקטים" },
];

export default function PropertiesPage() {
  const [filter, setFilter] = useState<PropertyType | "all">("all");

  const filtered = filter === "all"
    ? mockProperties
    : mockProperties.filter((p) => p.type === filter);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        {/* Page header */}
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">הפורטפוליו שלנו</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              נכסים
            </h1>
            <p className="text-gray-light max-w-xl">
              מבחר נכסים יוקרתיים בגוש דן. מכירה, השכרה ופרויקטים חדשים.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-black border-b border-gray-dark sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-3">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-5 py-2 rounded text-sm font-medium transition-all ${
                  filter === opt.value
                    ? "bg-gold text-black"
                    : "border border-gray-dark text-gray-light hover:border-gold hover:text-gold"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-light py-24">
                אין נכסים זמינים בקטגוריה זו כרגע.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
