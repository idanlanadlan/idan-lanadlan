"use client";

import { useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Map } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMap from "@/components/properties/PropertyMap";
import type { Property, PropertyType } from "@/lib/types";
import { localizedField } from "@/lib/property-utils";
import { useLanguage } from "@/contexts/LanguageContext";

type SortOption = "default" | "price_desc" | "price_asc";

export default function PropertiesClient({ properties }: { properties: Property[] }) {
  const [filter, setFilter] = useState<PropertyType | "all">("all");
  const [view, setView] = useState<"list" | "map">("list");
  const [city, setCity] = useState("all");
  const [neighborhood, setNeighborhood] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { locale, t } = useLanguage();
  const p = t.sections.properties;

  const filterOptions: { value: PropertyType | "all"; label: string }[] = [
    { value: "all", label: p.filter_all },
    { value: "sale", label: p.filter_sale },
    { value: "rent", label: p.filter_rent },
  ];

  const cities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((prop) => set.add(localizedField(prop, "city", locale)));
    return Array.from(set).sort((a, b) => a.localeCompare(locale));
  }, [properties, locale]);

  const neighborhoods = useMemo(() => {
    const set = new Set<string>();
    properties
      .filter((prop) => city === "all" || localizedField(prop, "city", locale) === city)
      .forEach((prop) => set.add(localizedField(prop, "neighborhood", locale)));
    return Array.from(set).sort((a, b) => a.localeCompare(locale));
  }, [properties, city, locale]);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;

    let result = properties.filter((prop) => {
      if (filter !== "all" && prop.type !== filter) return false;
      if (city !== "all" && localizedField(prop, "city", locale) !== city) return false;
      if (neighborhood !== "all" && localizedField(prop, "neighborhood", locale) !== neighborhood) return false;
      if (min != null && prop.price < min) return false;
      if (max != null && prop.price > max) return false;
      return true;
    });

    if (sort === "price_desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === "price_asc") result = [...result].sort((a, b) => a.price - b.price);

    // Sold/rented properties sink to the bottom, preserving whatever order was established above.
    result = [...result].sort((a, b) => Number(a.status !== "available") - Number(b.status !== "available"));

    return result;
  }, [properties, filter, city, neighborhood, sort, minPrice, maxPrice, locale]);

  function handleCityChange(value: string) {
    setCity(value);
    setNeighborhood("all");
  }

  const selectClass =
    "px-4 py-2 rounded text-sm bg-black border border-gray-dark text-gray-light hover:border-gold focus:border-gold focus:outline-none transition-colors";

  return (
    <>
      {/* Filters + view toggle */}
      <section className="py-6 bg-black border-b border-gray-dark sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
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

            {/* Spacer */}
            <div className="flex-1" />

            {/* View toggle */}
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

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              className={selectClass}
            >
              <option value="all">{p.filter_city_all}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className={selectClass}
            >
              <option value="all">{p.filter_neighborhood_all}</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className={selectClass}
              aria-label={p.sort_label}
            >
              <option value="default">{p.sort_label}: {p.sort_default}</option>
              <option value="price_desc">{p.sort_price_desc}</option>
              <option value="price_asc">{p.sort_price_asc}</option>
            </select>

            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder={p.budget_min}
              className={`${selectClass} w-32`}
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder={p.budget_max}
              className={`${selectClass} w-32`}
            />
          </div>
        </div>
      </section>

      {view === "map" ? (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Suspense fallback={<div className="h-[480px] bg-charcoal border border-gray-dark rounded-xl animate-pulse" />}>
              <PropertyMap properties={filtered} height="480px" />
            </Suspense>
          </div>
        </section>
      ) : (
        /* Grid */
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
      )}
    </>
  );
}
