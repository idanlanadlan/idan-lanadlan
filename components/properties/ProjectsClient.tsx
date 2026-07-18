"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Map } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMap from "@/components/properties/PropertyMap";
import type { Property } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProjectsClient({ properties }: { properties: Property[] }) {
  const [view, setView] = useState<"list" | "map">("list");
  const { t } = useLanguage();
  const p = t.sections.projects;

  return (
    <>
      {/* View toggle */}
      <section className="py-8 bg-black border-b border-gray-dark sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-end">
          <div className="flex items-center gap-1 border border-gray-dark rounded-lg p-1">
            <button
              onClick={() => setView("list")}
              title="רשימה"
              className={`p-1.5 rounded transition-colors ${view === "list" ? "bg-gold text-black" : "text-gray-light hover:text-gold"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("map")}
              title="מפה"
              className={`p-1.5 rounded transition-colors ${view === "map" ? "bg-gold text-black" : "text-gray-light hover:text-gold"}`}
            >
              <Map size={16} />
            </button>
          </div>
        </div>
      </section>

      {view === "map" ? (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Suspense fallback={<div className="h-[480px] bg-charcoal border border-gray-dark rounded-xl animate-pulse" />}>
              <PropertyMap properties={properties} height="480px" />
            </Suspense>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {properties.length === 0 ? (
              <p className="text-center text-gray-light py-24">{p.empty}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property, i) => (
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
      )}
    </>
  );
}
