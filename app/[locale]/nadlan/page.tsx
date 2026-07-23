import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PropertiesClient from "@/components/properties/PropertiesClient";
import MapSection from "@/components/home/MapSection";
import { getProperties } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = (await getProperties()).filter((p) => p.type !== "project");

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        {/* Page header — static, no i18n needed here since it's SEO-only content */}
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">נכסים</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              נכסים למכירה ולהשכרה
            </h1>
            <p className="text-gray-light max-w-xl">
              נכסים נבחרים בתל אביב וסביבתה — עידן חולי, עידן לנדל״ן
            </p>
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
