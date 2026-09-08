import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PropertiesClient from "@/components/properties/PropertiesClient";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getProperties } from "@/lib/db";
import { isLocale, canonicalAlternates, localizedPath } from "@/lib/locale-path";
import { translations } from "@/lib/translations";
import { localizedField } from "@/lib/property-utils";
import { safeJsonLd } from "@/lib/json-ld";

const BASE = "https://idanlanadlan.co.il";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const pp = translations[l].properties_page;
  return {
    title: pp.meta_title,
    description: pp.meta_description,
    alternates: canonicalAlternates("/nadlan", l),
  };
}

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const pp = translations[l].properties_page;
  const nav = translations[l].nav;
  const properties = (await getProperties()).filter((p) => p.type !== "project");
  const listable = properties.filter((p) => p.status === "available");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: pp.h1,
        description: pp.meta_description,
        url: `${BASE}${localizedPath("/nadlan", l)}`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: listable.length,
          itemListElement: listable.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${BASE}${localizedPath(`/nadlan/${p.id}`, l)}`,
            name: localizedField(p, "title", l),
            ...(p.images[0] ? { image: p.images[0] } : {}),
            offers: { "@type": "Offer", price: p.price, priceCurrency: "ILS" },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: nav.home, item: `${BASE}${localizedPath("/", l)}` },
          { "@type": "ListItem", position: 2, name: nav.properties, item: `${BASE}${localizedPath("/nadlan", l)}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{pp.eyebrow}</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              {pp.h1}
            </h1>
            <p className="text-gray-light max-w-xl">{pp.subtitle}</p>
            <p className="text-sm text-gray-light/80 max-w-3xl mt-4 leading-relaxed">{pp.intro}</p>
          </div>
        </section>

        <section className="relative border-b border-gray-dark/60 bg-charcoal overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: "radial-gradient(ellipse 55% 75% at 75% 50%, rgba(47,80,87,0.14) 0%, transparent 70%)" }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
            <NewsletterSignup variant="band" />
          </div>
        </section>

        <PropertiesClient properties={properties} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
