"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translations, type Locale, type T } from "@/lib/translations";
import { localizedPath } from "@/lib/locale-path";


interface LanguageContextValue {
  locale: Locale;
  t: T;
  setLocale: (l: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "he",
  t: translations.he,
  setLocale: () => {},
});

/**
 * Locale is URL-driven: the server passes it down from the [locale] route
 * segment (Hebrew is served prefix-free via the proxy rewrite). Switching
 * language navigates to the same page under the new locale's prefix.
 * The provider is mounted with key={locale}, so navigation remounts it.
 */
export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = (l: Locale) => {
    if (l === initialLocale) return;
    router.push(localizedPath(pathname, l));
  };

  return (
    <LanguageContext.Provider
      value={{ locale: initialLocale, t: translations[initialLocale], setLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
