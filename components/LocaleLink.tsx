"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/locale-path";

/**
 * Drop-in replacement for next/link that prefixes internal hrefs with the
 * current locale (/en, /fr; Hebrew stays prefix-free). Admin/API links and
 * external URLs pass through untouched.
 */
export default function LocaleLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const { locale } = useLanguage();
  const localized =
    typeof href === "string" &&
    href.startsWith("/") &&
    !href.startsWith("/admin") &&
    !href.startsWith("/api")
      ? localizedPath(href, locale)
      : href;
  return <Link href={localized} {...rest} />;
}
