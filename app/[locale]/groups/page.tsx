import type { Metadata } from "next";
import { translations } from "@/lib/translations";
import { isLocale, canonicalAlternates } from "@/lib/locale-path";
import GroupsClient from "./GroupsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const gp = translations[l].groups_page;
  return {
    title: gp.meta_title,
    description: gp.meta_description,
    alternates: canonicalAlternates("/groups", l),
  };
}

export default function GroupsPage() {
  return <GroupsClient />;
}
