import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ProjectsClient from "@/components/properties/ProjectsClient";
import LeadCaptureForm from "@/components/tools/LeadCaptureForm";
import { getProperties } from "@/lib/db";
import { localizedField } from "@/lib/property-utils";
import { isLocale, localizedPath } from "@/lib/locale-path";
import { translations, type Locale } from "@/lib/translations";
import { safeJsonLd } from "@/lib/json-ld";

export const dynamic = "force-dynamic";

const BASE = "https://idanlanadlan.co.il";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "he";
  const meta = translations[l].meta;
  const p = translations[l].sections.projects;
  const canonical = `${BASE}${localizedPath("/projects", l)}`;
  return {
    title: `${p.title} | ${meta.site_name}`,
    description: p.subtitle,
    openGraph: {
      title: `${p.title} | ${meta.site_name}`,
      description: p.subtitle,
    },
    alternates: {
      canonical,
      languages: {
        he: `${BASE}${localizedPath("/projects", "he")}`,
        en: `${BASE}${localizedPath("/projects", "en")}`,
        fr: `${BASE}${localizedPath("/projects", "fr")}`,
        es: `${BASE}${localizedPath("/projects", "es")}`,
        "x-default": `${BASE}${localizedPath("/projects", "he")}`,
      },
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "he";
  const t = translations[l];
  const p = t.sections.projects;

  const properties = (await getProperties()).filter((prop) => prop.type === "project");

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: p.title,
    description: p.subtitle,
    url: `${BASE}${localizedPath("/projects", l)}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: properties.map((prop, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE}${localizedPath(`/nadlan/${prop.id}`, l)}`,
        name: localizedField(prop, "title", l),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        {/* Page header */}
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{p.eyebrow}</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              {p.title}
            </h1>
            <p className="text-gray-light max-w-xl">{p.subtitle}</p>
          </div>
        </section>

        <ProjectsClient properties={properties} />

        {/* Developer pitch */}
        <section className="py-20 border-t border-gray-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{p.pitch_eyebrow}</p>
              <div className="divider-gold mb-4" />
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-4">
                {p.pitch_title}
              </h2>
              <p className="text-gray-light mb-8">{p.pitch_subtitle}</p>
              <ul className="flex flex-col gap-3">
                {p.pitch_items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-cream">
                    <span className="text-gold mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-luxury p-6 sm:p-8">
              <LeadCaptureForm toolName="פרויקטים — פניית יזם" ctaLabel={p.pitch_form_title} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
