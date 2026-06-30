"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize2, MapPin, ArrowRight, Phone, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Property } from "@/lib/types";

interface Props {
  property: Property;
  schema: object;
}

export default function PropertyPageClient({ property, schema }: Props) {
  const { t } = useLanguage();
  const pd = t.sections.property_detail;
  const [activeImg, setActiveImg] = useState(0);

  const images = property.images.length > 0 ? property.images : [];
  const hasGallery = images.length > 1;

  const typeLabel: Record<string, string> = {
    sale: pd.type_sale,
    rent: pd.type_rent,
    project: pd.type_project,
  };

  const formatPrice = (price: number, type: string) => {
    if (type === "rent") return `₪${price.toLocaleString("he-IL")} ${pd.per_month}`;
    return `₪${price.toLocaleString("he-IL")}`;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      <main className="min-h-screen pt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-xs text-gray-light">
          <Link href="/" className="hover:text-gold transition-colors">{t.nav.home}</Link>
          <ArrowRight size={12} className="rtl-flip" />
          <Link href="/nadlan" className="hover:text-gold transition-colors">{t.nav.properties}</Link>
          <ArrowRight size={12} className="rtl-flip" />
          <span className="text-cream">{property.title}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: images + details */}
            <div className="lg:col-span-2">
              {/* Main image */}
              <div className="relative h-80 sm:h-[500px] rounded-xl overflow-hidden mb-3">
                {images.length > 0 ? (
                  <Image
                    src={images[activeImg]}
                    alt={property.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover transition-opacity duration-300"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-charcoal flex items-center justify-center">
                    <span className="text-[10px] tracking-widest text-gray-light/40 uppercase">תמונה בקרוב</span>
                  </div>
                )}
                <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-gold text-black font-semibold">
                  {typeLabel[property.type]}
                </span>
                {/* Arrow nav (shown when >1 image) */}
                {hasGallery && (
                  <>
                    <button
                      onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                      aria-label="תמונה קודמת"
                    >
                      <ChevronRight size={18} className="text-white" />
                    </button>
                    <button
                      onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                      aria-label="תמונה הבאה"
                    >
                      <ChevronLeft size={18} className="text-white" />
                    </button>
                    <span className="absolute bottom-3 left-3 text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                      {activeImg + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {hasGallery && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                        i === activeImg ? "ring-2 ring-gold" : "opacity-60 hover:opacity-90"
                      }`}
                    >
                      <Image src={src} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}

              {/* Property info */}
              <div className="bg-charcoal rounded-xl border border-gray-dark p-6 mb-6">
                <h1 className="font-display text-3xl sm:text-4xl font-light text-white mb-2">
                  {property.title}
                </h1>
                <p className="flex items-center gap-2 text-sm text-gray-light mb-6">
                  <MapPin size={14} className="text-gold" />
                  {property.address}, {property.neighborhood}, {property.city}
                </p>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-dark mb-6">
                  <div className="text-center">
                    <BedDouble size={22} className="text-gold mx-auto mb-2" />
                    <p className="text-lg font-semibold text-white">{property.bedrooms}</p>
                    <p className="text-xs text-gray-light">{pd.rooms}</p>
                  </div>
                  <div className="text-center">
                    <Bath size={22} className="text-gold mx-auto mb-2" />
                    <p className="text-lg font-semibold text-white">{property.bathrooms}</p>
                    <p className="text-xs text-gray-light">{pd.bathrooms}</p>
                  </div>
                  <div className="text-center">
                    <Maximize2 size={22} className="text-gold mx-auto mb-2" />
                    <p className="text-lg font-semibold text-white">{property.size_sqm}</p>
                    <p className="text-xs text-gray-light">{pd.sqm}</p>
                  </div>
                </div>

                <h2 className="text-sm font-semibold text-white mb-3">{pd.description_title}</h2>
                <p className="text-gray-light leading-relaxed text-sm">{property.description}</p>
              </div>

              {/* Map */}
              <div className="bg-charcoal rounded-xl border border-gray-dark overflow-hidden">
                <div className="px-6 pt-5 pb-3">
                  <h2 className="text-sm font-semibold text-white">{pd.location_title}</h2>
                  <p className="text-xs text-gray-light mt-1 flex items-center gap-1">
                    <MapPin size={11} className="text-gold" />
                    {property.address}, {property.neighborhood}, {property.city}
                  </p>
                </div>
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${property.address}, ${property.neighborhood}, ${property.city}, ישראל`)}&output=embed&z=15`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${pd.location_title} ${property.title}`}
                />
              </div>
            </div>

            {/* Right: sticky contact card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-charcoal rounded-xl border border-gray-dark p-6">
                <p className="text-xs tracking-widest text-gold uppercase mb-1">{pd.price_label}</p>
                <p className="font-display text-3xl text-white font-light mb-6">
                  {formatPrice(property.price, property.type)}
                </p>

                <div className="divider-gold mb-6" />

                <p className="text-sm text-gray-light mb-4">
                  {pd.contact_text}
                </p>

                <div className="flex flex-col gap-3">
                  <a
                    href={`https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93%20%D7%A2%D7%9C%20${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-5 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    {pd.whatsapp_button}
                  </a>
                  <a
                    href="tel:+972549791171"
                    className="btn-outline-gold px-5 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Phone size={16} />
                    054-979-1171
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-dark">
                  <p className="text-xs text-gray-light text-center">
                    עידן חולי — עידן לנדל״ן
                    <br />
                    ★ 5.0 בגוגל
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
