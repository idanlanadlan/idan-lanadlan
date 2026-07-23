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
  const { terms } = translations[l].legal;
  return {
    title: terms.meta_title,
    description: terms.meta_description,
    robots: { index: false, follow: false },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const { common, terms } = translations[l].legal;

  return (
    <LegalPage
      eyebrow={common.eyebrow_legal}
      title={terms.title}
      updated={common.updated}
      sections={terms.sections}
      contactName={terms.contact_name}
      common={common}
    />
  );
}
