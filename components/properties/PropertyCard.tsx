"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/types";

function formatPrice(price: number, type: Property["type"]) {
  if (type === "rent") return `₪${price.toLocaleString("he-IL")}/חודש`;
  return `₪${(price / 1000000).toFixed(1)}M`;
}

const typeLabel: Record<Property["type"], string> = {
  sale: "למכירה",
  rent: "להשכרה",
  project: "פרויקט",
};

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "large";
}

export default function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const isLarge = variant === "large";
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/nadlan/${property.id}`} className="group block h-full">
      <div className="card-luxury overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className={`relative overflow-hidden shrink-0 ${isLarge ? "h-80 sm:h-96 md:h-[420px]" : "h-56 sm:h-64"}`}>
          {!imgError ? (
            <Image
              src={property.images[0]}
              alt={property.title}
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

          {/* Price — large format in display font */}
          <p className={`absolute bottom-4 end-4 font-display font-light text-white ${isLarge ? "text-3xl" : "text-xl"}`}>
            {formatPrice(property.price, property.type)}
          </p>
        </div>

        {/* Details */}
        <div className={`flex flex-col flex-1 ${isLarge ? "p-7" : "p-5"}`}>
          <h3 className={`font-semibold text-cream mb-1 line-clamp-1 ${isLarge ? "text-lg" : "text-base"}`}>
            {property.title}
          </h3>
          <p className="text-xs text-gray-light/70 mb-5">
            {property.neighborhood}, {property.city}
          </p>

          <div className="flex items-center gap-6 text-xs text-gray-light mt-auto">
            <span className="flex items-center gap-1.5">
              <BedDouble size={12} className="text-gold/70" />
              {property.bedrooms} חדרים
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={12} className="text-gold/70" />
              {property.bathrooms} מק״ר
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 size={12} className="text-gold/70" />
              {property.size_sqm} מ״ר
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
