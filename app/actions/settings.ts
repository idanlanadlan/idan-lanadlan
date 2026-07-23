"use server";

import { revalidatePath } from "next/cache";
import { upsertSettings } from "@/lib/db";
import { translateAboutFields, type AboutFields } from "@/lib/translate-about";
import { translateSiteCopy } from "@/lib/translate-site-copy";
import { isAdmin } from "@/lib/require-admin";

const ABOUT_HE_KEYS = [
  "about_eyebrow_he",
  "about_heading_line1_he",
  "about_heading_line2_he",
  "about_bio1_he",
  "about_bio2_he",
  "about_bio3_he",
] as const;

// Every homepage headline/eyebrow/subtitle field, editable in
// /admin/settings ("כותרות עמוד הבית"). Translated together in one Claude
// call on save (see lib/translate-site-copy.ts) — components fall back to
// the matching lib/translations.ts value until a field has been saved.
const HOME_COPY_HE_KEYS = [
  "hero_eyebrow_he",
  "hero_line1_he",
  "hero_line2_he",
  "hero_subtitle_he",
  "properties_eyebrow_he",
  "properties_title_he",
  "snippet_eyebrow_he",
  "snippet_quote_he",
  "testimonials_eyebrow_he",
  "testimonials_title_he",
  "cta_eyebrow_he",
  "cta_title1_he",
  "cta_title2_he",
  "cta_subtitle_he",
  "blog_eyebrow_he",
  "blog_title_he",
  "map_eyebrow_he",
  "map_title_he",
  "map_subtitle_he",
  "social_eyebrow_he",
  "social_title_he",
  "faq_eyebrow_he",
  "faq_title_he",
  "faq_subtitle_he",
] as const;

export async function saveSettings(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const keys = [
    "phone", "phone_raw", "email", "whatsapp", "whatsapp_catalog",
    "facebook", "tiktok", "linkedin", "instagram",
    "maps_url", "address", "about_snippet",
    ...ABOUT_HE_KEYS,
    ...HOME_COPY_HE_KEYS,
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
  const aboutTranslations = await translateAboutFields(aboutHe);
  if (aboutTranslations) {
    for (const locale of ["en", "fr", "es"] as const) {
      const t = aboutTranslations[locale];
      settings[`about_eyebrow_${locale}`] = t.eyebrow;
      settings[`about_heading_line1_${locale}`] = t.heading_line1;
      settings[`about_heading_line2_${locale}`] = t.heading_line2;
      settings[`about_bio1_${locale}`] = t.bio1;
      settings[`about_bio2_${locale}`] = t.bio2;
      settings[`about_bio3_${locale}`] = t.bio3;
    }
  }

  const homeCopyHe: Record<string, string> = {};
  for (const key of HOME_COPY_HE_KEYS) {
    const base = key.slice(0, -3); // strip "_he"
    homeCopyHe[base] = settings[key] ?? "";
  }
  const homeCopyTranslations = await translateSiteCopy(homeCopyHe);
  if (homeCopyTranslations) {
    for (const locale of ["en", "fr", "es"] as const) {
      const t = homeCopyTranslations[locale];
      for (const base of Object.keys(homeCopyHe)) {
        if (t[base]) settings[`${base}_${locale}`] = t[base];
      }
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
