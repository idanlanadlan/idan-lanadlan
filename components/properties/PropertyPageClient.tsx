"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize2, MapPin, ArrowRight, Phone, MessageCircle } from "lucide-react";
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
              <div className="relative h-80 sm:h-[500px] rounded-xl overflow-hidden mb-4">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
                <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-gold text-black font-semibold">
                  {typeLabel[property.type]}
                </span>
              </div>

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
