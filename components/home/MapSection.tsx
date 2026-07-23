"use client";

import { motion } from "framer-motion";
import PropertyMap from "@/components/properties/PropertyMap";
import type { Property } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { pickCopy } from "@/lib/site-copy";

interface Props {
  properties: Property[];
}

export default function MapSection({ properties }: Props) {
  const { t, locale } = useLanguage();
  const settings = useSettings();
  const m = t.sections.map;
  const p = t.sections.properties;
  const eyebrow = pickCopy(settings, "map_eyebrow", locale, m.eyebrow);
  const title = pickCopy(settings, "map_title", locale, m.title);
  const subtitle = pickCopy(settings, "map_subtitle", locale, m.subtitle);
  // Map popups have no status badge, so sold/rented properties would look active — show available only
  const mapped = properties.filter((prop) => prop.lat && prop.lng && prop.status === "available");

  // No coordinates yet — the whole section stays hidden (site convention: missing data → no section)
  if (mapped.length === 0) return null;

  return (
    <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6" aria-labelledby="map-heading">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <span className="text-[10px] tracking-[0.45em] text-gold uppercase block mb-5" aria-hidden="true">
          {eyebrow}
        </span>
        <h2
          id="map-heading"
          className="font-display text-4xl sm:text-5xl font-extralight text-white leading-tight"
        >
          {title}
        </h2>
        <p className="mt-4 text-sm text-gray-light max-w-xl">{subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <PropertyMap
          properties={mapped}
          height="440px"
          labels={{ sale: p.filter_sale, rent: p.filter_rent, on_map: m.on_map }}
        />
      </motion.div>
    </section>
  );
}
