import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import InspectionChecklist from "@/components/tools/InspectionChecklist";
import { translations } from "@/lib/translations";
import { isLocale } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const t = translations[l].toolbox.tools.inspection_checklist;
  return { title: t.meta_title, description: t.meta_description };
}

export default async function InspectionChecklistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const t = translations[l].toolbox.tools.inspection_checklist;

  return (
    <>
      <Header />
      <ToolShell title={t.shell_title} description={t.shell_description}>
        <InspectionChecklist />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
