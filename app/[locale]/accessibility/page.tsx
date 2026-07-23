import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { translations } from "@/lib/translations";
import { isLocale } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const { accessibility } = translations[l].legal;
  return {
    title: accessibility.meta_title,
    description: accessibility.meta_description,
  };
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const { common, accessibility } = translations[l].legal;

  return (
    <LegalPage
      eyebrow={common.eyebrow_accessibility}
      title={accessibility.title}
      updated={common.updated}
      sections={accessibility.sections}
      contactName={accessibility.contact_name}
      contactNote={accessibility.contact_note}
      common={common}
    />
  );
}
