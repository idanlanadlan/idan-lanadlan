import type { Metadata } from "next";
import SellersClient from "./SellersClient";
import { translations } from "@/lib/translations";
import { isLocale } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const s = translations[l].sellers;
  return { title: s.meta_title, description: s.meta_description };
}

export default function SellersPage() {
  return <SellersClient />;
}
