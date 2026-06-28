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

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/nadlan/${property.id}`} className="group block">
      <div className="card-luxury rounded-lg overflow-hidden">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {/* Type badge */}
          <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full bg-gold text-black font-semibold tracking-wide">
            {typeLabel[property.type]}
          </span>
          {/* Price */}
          <p className="absolute bottom-3 right-3 font-display text-xl text-white font-light">
            {formatPrice(property.price, property.type)}
          </p>
        </div>

        {/* Details */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-cream mb-1 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs text-gray-light mb-4">
            {property.neighborhood}, {property.city}
          </p>

          <div className="flex items-center gap-5 text-xs text-gray-light">
            <span className="flex items-center gap-1.5">
              <BedDouble size={13} className="text-gold" />
              {property.bedrooms} חדרים
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={13} className="text-gold" />
              {property.bathrooms} מק״ר
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 size={13} className="text-gold" />
              {property.size_sqm} מ״ר
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
