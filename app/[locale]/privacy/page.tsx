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
  const { privacy } = translations[l].legal;
  return {
    title: privacy.meta_title,
    description: privacy.meta_description,
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const { common, privacy } = translations[l].legal;

  return (
    <LegalPage
      eyebrow={common.eyebrow_legal}
      title={privacy.title}
      updated={common.updated}
      sections={privacy.sections}
      contactName={privacy.contact_name}
      common={common}
    />
  );
}
