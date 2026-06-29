"use server";

import { revalidatePath } from "next/cache";
import { upsertSettings } from "@/lib/db";

export async function saveSettings(formData: FormData) {
  const keys = [
    "phone", "phone_raw", "email", "whatsapp", "whatsapp_catalog",
    "facebook", "tiktok", "linkedin", "instagram",
    "maps_url", "address", "about_snippet",
    "hero_subtitle_he", "hero_subtitle_en", "hero_subtitle_fr",
  ];

  const settings: Record<string, string> = {};
  for (const key of keys) {
    const val = formData.get(key);
    if (val !== null) settings[key] = val as string;
  }

  await upsertSettings(settings);
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/about");
}
