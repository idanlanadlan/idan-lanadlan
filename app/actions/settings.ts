"use server";

import { revalidatePath } from "next/cache";
import { upsertSettings } from "@/lib/db";
import { translateAboutFields, type AboutFields } from "@/lib/translate-about";
import { translateHeroSubtitle } from "@/lib/translate-hero";

const ABOUT_HE_KEYS = [
  "about_eyebrow_he",
  "about_heading_line1_he",
  "about_heading_line2_he",
  "about_bio1_he",
  "about_bio2_he",
  "about_bio3_he",
] as const;

export async function saveSettings(formData: FormData) {
  const keys = [
    "phone", "phone_raw", "email", "whatsapp", "whatsapp_catalog",
    "facebook", "tiktok", "linkedin", "instagram",
    "maps_url", "address", "about_snippet",
    "hero_subtitle_he",
    ...ABOUT_HE_KEYS,
  ];

  const settings: Record<string, string> = {};
  for (const key of keys) {
    const val = formData.get(key);
    if (val !== null) settings[key] = val as string;
  }

  const aboutHe: AboutFields = {
    eyebrow: settings.about_eyebrow_he ?? "",
    heading_line1: settings.about_heading_line1_he ?? "",
    heading_line2: settings.about_heading_line2_he ?? "",
    bio1: settings.about_bio1_he ?? "",
    bio2: settings.about_bio2_he ?? "",
    bio3: settings.about_bio3_he ?? "",
  };
  const translations = await translateAboutFields(aboutHe);
  if (translations) {
    for (const locale of ["en", "fr", "es"] as const) {
      const t = translations[locale];
      settings[`about_eyebrow_${locale}`] = t.eyebrow;
      settings[`about_heading_line1_${locale}`] = t.heading_line1;
      settings[`about_heading_line2_${locale}`] = t.heading_line2;
      settings[`about_bio1_${locale}`] = t.bio1;
      settings[`about_bio2_${locale}`] = t.bio2;
      settings[`about_bio3_${locale}`] = t.bio3;
    }
  }

  if (settings.hero_subtitle_he) {
    const heroTranslations = await translateHeroSubtitle(settings.hero_subtitle_he);
    if (heroTranslations) {
      settings.hero_subtitle_en = heroTranslations.en;
      settings.hero_subtitle_fr = heroTranslations.fr;
      settings.hero_subtitle_es = heroTranslations.es;
    }
  }

  await upsertSettings(settings);
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/about");
  revalidatePath("/en/about");
  revalidatePath("/fr/about");
  revalidatePath("/es/about");
  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/fr");
  revalidatePath("/es");
}
