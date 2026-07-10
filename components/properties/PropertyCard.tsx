"use client";

import { useState } from "react";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { BedDouble, Maximize2, Layers, Wind, Car, Shield, ShieldCheck, Tag } from "lucide-react";
import type { Property } from "@/lib/types";
import { pricePerSqm, localizedField } from "@/lib/property-utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "large";
}

export default function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const { locale, t } = useLanguage();
  const pd = t.sections.property_detail;
  const isLarge = variant === "large";
  const [imgError, setImgError] = useState(false);

  const typeLabel: Record<Property["type"], string> = {
    sale: pd.type_sale,
    rent: pd.type_rent,
    project: pd.type_project,
  };

  function formatPrice(price: number, type: Property["type"]) {
    if (type === "rent") return `₪${price.toLocaleString("he-IL")}/${pd.per_month}`;
    return `₪${price.toLocaleString("he-IL")}`;
  }

  const title = localizedField(property, "title", locale);
  const neighborhood = localizedField(property, "neighborhood", locale);
  const city = localizedField(property, "city", locale);

  const hasBadges =
    (property.balcony_sqm ?? 0) > 0 ||
    (property.parking_spots ?? 0) > 0 ||
    property.has_mamad ||
    property.has_shelter;

  return (
    <Link href={`/nadlan/${property.id}`} className="group block h-full">
      <div className="card-luxury overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className={`relative overflow-hidden shrink-0 ${isLarge ? "h-80 sm:h-96 md:h-[420px]" : "h-56 sm:h-64"}`}>
          {!imgError ? (
            <Image
              src={property.images[0]}
              alt={title}
              fill
              sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-charcoal flex items-center justify-center">
              <span className="text-[10px] tracking-widest text-gray-light/40 uppercase">תמונה בקרוב</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Type badge */}
          <span className="absolute top-4 end-4 text-[10px] px-3 py-1.5 bg-gold text-black font-semibold tracking-widest uppercase">
            {typeLabel[property.type]}
          </span>

          {/* Price — exact amount, in display font */}
          <p className={`absolute bottom-4 end-4 font-display font-light text-white ${isLarge ? "text-2xl" : "text-lg"}`}>
            {formatPrice(property.price, property.type)}
          </p>
        </div>

        {/* Details */}
        <div className={`flex flex-col flex-1 ${isLarge ? "p-7" : "p-5"}`}>
          <h3 className={`font-semibold text-cream mb-1 line-clamp-1 ${isLarge ? "text-lg" : "text-base"}`}>
            {title}
          </h3>
          <p className="text-xs text-gray-light mb-5">
            {neighborhood}, {city}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-light mt-auto">
            <span className="flex items-center gap-1.5">
              <BedDouble size={12} className="text-gold/70" aria-hidden="true" />
              {property.bedrooms} {pd.rooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 size={12} className="text-gold/70" aria-hidden="true" />
              {property.size_sqm} {pd.sqm}
            </span>
            {property.type !== "rent" && (
              <span className="flex items-center gap-1.5">
                <Tag size={12} className="text-gold/70" aria-hidden="true" />
                {pd.price_per_sqm}: ₪{pricePerSqm(property).toLocaleString("he-IL")}
              </span>
            )}
            {property.floor != null && (
              <span className="flex items-center gap-1.5">
                <Layers size={12} className="text-gold/70" aria-hidden="true" />
                {pd.floor} {property.floor}
              </span>
            )}
          </div>

          {hasBadges && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-light mt-2">
              {(property.balcony_sqm ?? 0) > 0 && (
                <span className="flex items-center gap-1.5">
                  <Wind size={12} className="text-gold/70" aria-hidden="true" />
                  {pd.balcony} {property.balcony_sqm} {pd.sqm}
                </span>
              )}
              {(property.parking_spots ?? 0) > 0 && (
                <span className="flex items-center gap-1.5">
                  <Car size={12} className="text-gold/70" aria-hidden="true" />
                  {property.parking_spots} {pd.parking}
                </span>
              )}
              {property.has_mamad && (
                <span className="flex items-center gap-1.5">
                  <Shield size={12} className="text-gold/70" aria-hidden="true" />
                  {pd.mamad}
                </span>
              )}
              {property.has_shelter && (
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-gold/70" aria-hidden="true" />
                  {pd.shelter}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
