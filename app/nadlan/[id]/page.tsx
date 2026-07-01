import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPropertyById } from "@/lib/db";
import PropertyPageClient from "@/components/properties/PropertyPageClient";

function formatPrice(price: number, type: string) {
  if (type === "rent") return `₪${price.toLocaleString("he-IL")} לחודש`;
  return `₪${price.toLocaleString("he-IL")}`;
}

const typeLabel: Record<string, string> = {
  sale: "למכירה",
  rent: "להשכרה",
  project: "פרויקט",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getPropertyById(id);
  if (!p) return {};
  const priceStr = formatPrice(p.price, p.type);
  return {
    title: `${p.title} | עידן לנדל״ן`,
    description: `${p.bedrooms} חדרים, ${p.size_sqm} מ״ר ב${p.neighborhood}, ${p.city}. מחיר: ${priceStr}. תיווך עידן חולי — עידן לנדל״ן.`,
    openGraph: {
      title: p.title,
      description: `${typeLabel[p.type]} | ${p.bedrooms} חד׳ | ${p.size_sqm} מ״ר | ${priceStr}`,
      images: p.images[0] ? [{ url: p.images[0] }] : [],
    },
    alternates: {
      canonical: `https://idanlanadlan.co.il/nadlan/${p.id}`,
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://idanlanadlan.co.il/nadlan/${property.id}`,
    image: property.images[0] ?? "",
    price: property.price,
    priceCurrency: "ILS",
    numberOfRooms: property.bedrooms,
    floorSize: { "@type": "QuantitativeValue", value: property.size_sqm, unitCode: "MTK" },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
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
