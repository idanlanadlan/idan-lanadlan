import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PropertiesClient from "@/components/properties/PropertiesClient";
import MapSection from "@/components/home/MapSection";
import { getProperties } from "@/lib/db";
import { isLocale, canonicalAlternates } from "@/lib/locale-path";
import { translations } from "@/lib/translations";

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
  const properties = (await getProperties()).filter((p) => p.type !== "project");

  return (
    <>
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
          </div>
        </section>

        <MapSection properties={properties} />
        <PropertiesClient properties={properties} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
