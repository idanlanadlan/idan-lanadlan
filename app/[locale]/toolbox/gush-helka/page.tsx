import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import GushHelkaLookup from "@/components/tools/GushHelkaLookup";
import { translations } from "@/lib/translations";
import { isLocale } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const t = translations[l].toolbox.tools.gush_helka;
  return { title: t.meta_title, description: t.meta_description };
}

export default async function GushHelkaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const t = translations[l].toolbox.tools.gush_helka;

  return (
    <>
      <Header />
      <ToolShell title={t.shell_title} description={t.shell_description} disclaimer={t.shell_disclaimer}>
        <GushHelkaLookup />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
