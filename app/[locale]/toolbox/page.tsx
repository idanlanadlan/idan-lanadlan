import type { Metadata } from "next";
import Link from "@/components/LocaleLink";
import {
  TrendingUp,
  Scale,
  ClipboardCheck,
  Compass,
  BookOpen,
  Plane,
  Landmark,
  Receipt,
  LandPlot,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { translations, type T } from "@/lib/translations";
import { isLocale } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const idx = translations[l].toolbox.index;
  return { title: idx.meta_title, description: idx.meta_description };
}

const TOOL_META: { href: string; Icon: typeof TrendingUp; key: keyof T["toolbox"]["tools"] }[] = [
  { href: "/toolbox/roi-calculator", Icon: TrendingUp, key: "roi_calculator" },
  { href: "/toolbox/mortgage-calculator", Icon: Landmark, key: "mortgage_calculator" },
  { href: "/toolbox/tax-simulator", Icon: Receipt, key: "tax_simulator" },
  { href: "/toolbox/buy-vs-rent", Icon: Scale, key: "buy_vs_rent" },
  { href: "/toolbox/inspection-checklist", Icon: ClipboardCheck, key: "inspection_checklist" },
  { href: "/toolbox/property-match", Icon: Compass, key: "property_match" },
  { href: "/toolbox/gush-helka", Icon: LandPlot, key: "gush_helka" },
  { href: "/toolbox/glossary", Icon: BookOpen, key: "glossary" },
  { href: "/toolbox/oleh-tax", Icon: Plane, key: "oleh_tax" },
];

export default async function ToolboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const idx = translations[l].toolbox.index;
  const tools = translations[l].toolbox.tools;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        <section className="py-12 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{idx.eyebrow}</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">{idx.title}</h1>
            <p className="text-gray-light max-w-xl">{idx.subtitle}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOL_META.map(({ href, Icon, key }) => (
                <Link key={href} href={href} className="group block h-full">
                  <div className="card-luxury h-full rounded-xl p-6 flex flex-col">
                    <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-gold" />
                    </div>
                    <h2 className="text-white font-semibold mb-1.5 group-hover:text-gold transition-colors">
                      {tools[key].card_title}
                    </h2>
                    <p className="text-sm text-gray-light leading-relaxed mb-4">{tools[key].card_description}</p>
                    <span className="mt-auto flex items-center gap-1.5 text-xs text-gold uppercase tracking-widest">
                      {idx.open_tool}
                      <ArrowLeft size={12} className="rtl-flip" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
