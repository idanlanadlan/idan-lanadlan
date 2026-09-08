"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import {
  createProperty,
  updateProperty,
  deleteProperty as dbDeleteProperty,
  createBroker,
  setPropertyBrokerLink,
} from "@/lib/db";
import { translatePropertyFields } from "@/lib/translate-property";
import { sendNewListingAlert } from "@/lib/newsletter";
import { isAdmin } from "@/lib/require-admin";
import type { PropertyType, PropertyStatus, AddressVisibility, CollabSplit } from "@/lib/types";

/**
 * Records who is marketing a property, from the "מקור הנכס" section of the
 * form. Runs after the listing itself is saved and is fully best-effort:
 * a missing brokers/property_brokers table (setup Step 14 not run) or any
 * other failure here must never surface as a failed property save.
 * Broker details live only in these admin-only tables — never on the
 * `properties` row the public site reads.
 */
async function applyBrokerLink(propertyId: string, formData: FormData) {
  const source = formData.get("listing_source") === "collab" ? "collab" : "self";
  try {
    if (source === "self") {
      await setPropertyBrokerLink(propertyId, { listing_source: "self", broker_id: null });
      return;
    }

    let brokerId = (formData.get("broker_id") as string | null) || null;
    const newName = ((formData.get("broker_new_name") as string) || "").trim();

    if ((brokerId === "__new__" || !brokerId) && newName) {
      const broker = await createBroker({
        name: newName,
        phone: ((formData.get("broker_new_phone") as string) || "").trim(),
        agency: ((formData.get("broker_new_agency") as string) || "").trim(),
        notes: ((formData.get("broker_new_notes") as string) || "").trim(),
      });
      brokerId = broker.id;
    }
    if (brokerId === "__new__") brokerId = null;

    const collabSplit: CollabSplit = formData.get("collab_split") === "partial" ? "partial" : "full";
    const rawPct = Number(formData.get("collab_fee_pct"));
    const collabFeePct =
      collabSplit === "partial" && Number.isFinite(rawPct) && rawPct > 0 ? rawPct : null;

    await setPropertyBrokerLink(propertyId, {
      listing_source: "collab",
      broker_id: brokerId,
      collab_split: collabSplit,
      collab_fee_pct: collabFeePct,
    });
  } catch (err) {
    console.error("[applyBrokerLink] skipped — is setup Step 14 done?", err);
  }
}

function parseForm(formData: FormData) {
  const images = (formData.get("images") as string)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const crmId = formData.get("crm_id") as string | null;
  const addressVisibility = formData.get("address_visibility") as string | null;
  const validVisibility: AddressVisibility =
    addressVisibility === "street" || addressVisibility === "neighborhood"
      ? addressVisibility
      : "full";

  return {
    title: formData.get("title") as string,
    price: Number(formData.get("price")),
    type: formData.get("type") as PropertyType,
    bedrooms: Number(formData.get("bedrooms")),
    // Bathrooms are always a whole number (Idan's convention) — round defensively
    // in case an old value or a pasted import carried a fraction.
    bathrooms: Math.round(Number(formData.get("bathrooms"))),
    toilets: formData.get("toilets") ? Number(formData.get("toilets")) : undefined,
    size_sqm: Number(formData.get("size_sqm")),
    balcony_sqm: formData.get("balcony_sqm") ? Number(formData.get("balcony_sqm")) : undefined,
    yard_sqm: formData.get("yard_sqm") ? Number(formData.get("yard_sqm")) : undefined,
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
    // Always sent (a toggle has to be able to go back to "full"). If setup
    // Step 13 hasn't run yet, createProperty/updateProperty drop this key
    // and retry rather than failing the whole save.
    address_visibility: validVisibility,
  };
}

export async function createPropertyAction(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const data = parseForm(formData);
  const translations = await translatePropertyFields(data);
  const created = await createProperty({ ...data, ...translations });
  await applyBrokerLink(created.id, formData);
  // Email newsletter subscribers about the new listing — after the response,
  // never blocking or failing the save. Create-only: no re-alert on edits.
  if (created.status === "available") {
    after(() => sendNewListingAlert(created));
  }
  revalidatePath("/");
  revalidatePath("/nadlan");
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function updatePropertyAction(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const data = parseForm(formData);
  const translations = await translatePropertyFields(data);
  await updateProperty(id, { ...data, ...translations });
  await applyBrokerLink(id, formData);
  revalidatePath("/");
  revalidatePath("/nadlan");
  revalidatePath(`/nadlan/${id}`);
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function deleteProperty(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  await dbDeleteProperty(id);
  revalidatePath("/");
  revalidatePath("/nadlan");
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function toggleFeatured(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const featured = formData.get("featured") === "true";
  await updateProperty(id, { featured });
  revalidatePath("/");
  revalidatePath("/admin/properties");
}

export async function updateStatus(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const status = formData.get("status") as PropertyStatus;
  await updateProperty(id, { status });
  revalidatePath("/");
  revalidatePath("/nadlan");
  revalidatePath("/admin/properties");
}
