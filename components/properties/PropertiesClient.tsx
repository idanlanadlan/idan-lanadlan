"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/properties/PropertyCard";
import type { Property, PropertyType } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PropertiesClient({ properties }: { properties: Property[] }) {
  const [filter, setFilter] = useState<PropertyType | "all">("all");
  const { t } = useLanguage();
  const p = t.sections.properties;

  const filterOptions: { value: PropertyType | "all"; label: string }[] = [
    { value: "all", label: p.filter_all },
    { value: "sale", label: p.filter_sale },
    { value: "rent", label: p.filter_rent },
    { value: "project", label: p.filter_projects },
  ];

  const filtered = filter === "all" ? properties : properties.filter((prop) => prop.type === filter);

  return (
    <>
      {/* Filters */}
      <section className="py-8 bg-black border-b border-gray-dark sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-3">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              aria-pressed={filter === opt.value}
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
            <p className="text-center text-gray-light py-24">{p.empty}</p>
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
    </>
  );
}
