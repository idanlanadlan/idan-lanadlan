import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPropertyById } from "@/lib/db";
import PropertyPageClient from "@/components/properties/PropertyPageClient";
import { localizedField } from "@/lib/property-utils";
import { isLocale } from "@/lib/locale-path";
import { translations, type Locale } from "@/lib/translations";

const BASE = "https://idanlanadlan.co.il";

function propertyUrl(id: string, locale: Locale) {
  return locale === "he" ? `${BASE}/nadlan/${id}` : `${BASE}/${locale}/nadlan/${id}`;
}

function formatPrice(price: number, type: string, locale: Locale) {
  const t = translations[locale].sections.property_detail;
  const amount = `₪${price.toLocaleString(locale === "he" ? "he-IL" : "en-US")}`;
  return type === "rent" ? `${amount} ${t.per_month}` : amount;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "he";
  const p = await getPropertyById(id);
  if (!p) return {};
  const t = translations[l].sections.property_detail;
  const meta = translations[l].meta;
  const priceStr = formatPrice(p.price, p.type, l);
  const title = localizedField(p, "title", l);
  const neighborhood = localizedField(p, "neighborhood", l);
  const city = localizedField(p, "city", l);
  const typeLabel = { sale: t.type_sale, rent: t.type_rent, project: t.type_project }[p.type] ?? "";
  return {
    title: `${title} | ${meta.site_name}`,
    description: `${p.bedrooms} ${t.rooms}, ${p.size_sqm} ${t.sqm} — ${neighborhood}, ${city}. ${t.price_label}: ${priceStr}. ${meta.site_name}.`,
    openGraph: {
      title,
      description: `${typeLabel} | ${p.bedrooms} ${t.rooms} | ${p.size_sqm} ${t.sqm} | ${priceStr}`,
      images: p.images[0] ? [{ url: p.images[0] }] : [],
    },
    alternates: {
      canonical: propertyUrl(p.id, l),
      languages: {
        he: propertyUrl(p.id, "he"),
        en: propertyUrl(p.id, "en"),
        fr: propertyUrl(p.id, "fr"),
        "x-default": propertyUrl(p.id, "he"),
      },
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "he";
  const property = await getPropertyById(id);
  if (!property) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: localizedField(property, "title", l),
    description: localizedField(property, "description", l),
    url: propertyUrl(property.id, l),
    image: property.images[0] ?? "",
    price: property.price,
    priceCurrency: "ILS",
    numberOfRooms: property.bedrooms,
    floorSize: { "@type": "QuantitativeValue", value: property.size_sqm, unitCode: "MTK" },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: localizedField(property, "city", l),
      addressCountry: "IL",
    },
    seller: {
      "@type": "RealEstateAgent",
      name: "עידן חולי — עידן לנדל״ן",
      telephone: "+972-54-979-1171",
      url: "https://idanlanadlan.co.il",
    },
  };

  return <PropertyPageClient property={property} schema={schema} />;
}
