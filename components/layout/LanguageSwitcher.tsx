"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/lib/translations";

const LOCALES: { code: Locale; countryCode: string; label: string }[] = [
  { code: "he", countryCode: "il", label: "עברית" },
  { code: "en", countryCode: "gb", label: "English" },
  { code: "fr", countryCode: "fr", label: "Français" },
];

interface Props {
  size?: "sm" | "lg";
  onSelect?: () => void;
}

export default function LanguageSwitcher({ size = "sm", onSelect }: Props) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="בחירת שפה">
      {LOCALES.map(({ code, countryCode, label }) => (
        <button
          key={code}
          onClick={() => { setLocale(code); onSelect?.(); }}
          aria-pressed={locale === code}
          aria-label={`שפה: ${label}`}
          title={label}
          className={`rounded transition-all ${
            size === "lg" ? "p-1" : "p-0.5"
          } ${
            locale === code
              ? "opacity-100 scale-110"
              : "opacity-35 hover:opacity-75"
          }`}
        >
          <span
            className={`fi fi-${countryCode} fi-rounded`}
            style={{ fontSize: size === "lg" ? "1.4rem" : "1rem" }}
          />
        </button>
      ))}
    </div>
  );
}
