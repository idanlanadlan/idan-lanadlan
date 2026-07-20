"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createProperty,
  updateProperty,
  deleteProperty as dbDeleteProperty,
} from "@/lib/db";
import { translatePropertyFields } from "@/lib/translate-property";
import type { PropertyType, PropertyStatus } from "@/lib/types";

function parseForm(formData: FormData) {
  const images = (formData.get("images") as string)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const crmId = formData.get("crm_id") as string | null;

  return {
    title: formData.get("title") as string,
    price: Number(formData.get("price")),
    type: formData.get("type") as PropertyType,
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    toilets: formData.get("toilets") ? Number(formData.get("toilets")) : undefined,
    size_sqm: Number(formData.get("size_sqm")),
    balcony_sqm: formData.get("balcony_sqm") ? Number(formData.get("balcony_sqm")) : undefined,
    floor: formData.get("floor") ? Number(formData.get("floor")) : undefined,
    parking_spots: formData.get("parking_spots") ? Number(formData.get("parking_spots")) : undefined,
    has_mamad: formData.get("has_mamad") === "on",
    has_shelter: formData.get("has_shelter") === "on",
    has_elevator: formData.get("has_elevator") === "on",
    address: formData.get("address") as string,
    // null (not undefined) so editing the address without re-picking a suggestion
    // clears stale coordinates in the DB — undefined keys are dropped from the update
    lat: formData.get("lat") ? Number(formData.get("lat")) : null,
    lng: formData.get("lng") ? Number(formData.get("lng")) : null,
    neighborhood: formData.get("neighborhood") as string,
    city: (formData.get("city") as string) || "תל אביב",
    description: formData.get("description") as string,
    images: images.length ? images : [],
    status: (formData.get("status") as PropertyStatus) || "available",
    featured: formData.get("featured") === "on",
    // Only set the key when a crm_id is actually present — the column is
    // still pending a migration (see admin/setup), and Supabase errors on
    // an unknown column even when the value would be undefined.
    ...(crmId ? { crm_id: crmId } : {}),
  };
}

export async function createPropertyAction(formData: FormData) {
  const data = parseForm(formData);
  const translations = await translatePropertyFields(data);
  await createProperty({ ...data, ...translations });
  revalidatePath("/");
  revalidatePath("/nadlan");
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function updatePropertyAction(formData: FormData) {
  const id = formData.get("id") as string;
  const data = parseForm(formData);
  const translations = await translatePropertyFields(data);
  await updateProperty(id, { ...data, ...translations });
  revalidatePath("/");
  revalidatePath("/nadlan");
  revalidatePath(`/nadlan/${id}`);
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function deleteProperty(formData: FormData) {
  const id = formData.get("id") as string;
  await dbDeleteProperty(id);
  revalidatePath("/");
  revalidatePath("/nadlan");
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function toggleFeatured(formData: FormData) {
  const id = formData.get("id") as string;
  const featured = formData.get("featured") === "true";
  await updateProperty(id, { featured });
  revalidatePath("/");
  revalidatePath("/admin/properties");
}

export async function updateStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as PropertyStatus;
  await updateProperty(id, { status });
  revalidatePath("/");
  revalidatePath("/nadlan");
  revalidatePath("/admin/properties");
}
