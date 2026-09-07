import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPropertyById } from "@/lib/db";
import PropertyPageClient from "@/components/properties/PropertyPageClient";
import { localizedField, schemaStreetAddress } from "@/lib/property-utils";
import { isLocale, localizedPath } from "@/lib/locale-path";
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
        es: propertyUrl(p.id, "es"),
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

  const nav = translations[l].nav;
  const pd = translations[l].sections.property_detail;
  const title = localizedField(property, "title", l);
  // Masked to match address_visibility — the full street address must not leak
  // into structured data when the page itself hides it.
  const streetAddress = schemaStreetAddress(property);

  const amenities = [
    property.has_mamad && pd.mamad,
    property.has_shelter && pd.shelter,
    property.has_elevator && pd.elevator,
    (property.parking_spots ?? 0) > 0 && pd.parking,
    (property.balcony_sqm ?? 0) > 0 && pd.balcony,
    (property.yard_sqm ?? 0) > 0 && pd.yard,
  ].filter((v): v is string => Boolean(v));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: title,
        description: localizedField(property, "description", l),
        url: propertyUrl(property.id, l),
        image: property.images.length ? property.images : [],
        price: property.price,
        priceCurrency: "ILS",
        numberOfRooms: property.bedrooms,
        ...(property.bathrooms ? { numberOfBathroomsTotal: property.bathrooms } : {}),
        ...(property.floor != null ? { floorLevel: String(property.floor) } : {}),
        floorSize: { "@type": "QuantitativeValue", value: property.size_sqm, unitCode: "MTK" },
        ...(amenities.length
          ? { amenityFeature: amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })) }
          : {}),
        ...(property.lat != null && property.lng != null
          ? { geo: { "@type": "GeoCoordinates", latitude: property.lat, longitude: property.lng } }
          : {}),
        address: {
          "@type": "PostalAddress",
          ...(streetAddress ? { streetAddress } : {}),
          addressLocality: localizedField(property, "city", l),
          addressCountry: "IL",
        },
        seller: {
          "@type": "RealEstateAgent",
          name: "עידן חולי — עידן לנדל״ן",
          telephone: "+972-54-979-1171",
          url: BASE,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: nav.home, item: `${BASE}${localizedPath("/", l)}` },
          { "@type": "ListItem", position: 2, name: nav.properties, item: `${BASE}${localizedPath("/nadlan", l)}` },
          { "@type": "ListItem", position: 3, name: title },
        ],
      },
    ],
  };

  return <PropertyPageClient property={property} schema={schema} url={propertyUrl(property.id, l)} />;
}
