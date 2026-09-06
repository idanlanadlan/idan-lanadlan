"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBroker, updateBroker, deleteBroker } from "@/lib/db";
import { isAdmin } from "@/lib/require-admin";

function parseBroker(formData: FormData) {
  return {
    name: ((formData.get("name") as string) || "").trim(),
    phone: ((formData.get("phone") as string) || "").trim(),
    agency: ((formData.get("agency") as string) || "").trim(),
    notes: ((formData.get("notes") as string) || "").trim(),
  };
}

export async function createBrokerAction(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const data = parseBroker(formData);
  if (!data.name) throw new Error("Broker name is required");
  await createBroker(data);
  revalidatePath("/admin/brokers");
  revalidatePath("/admin/properties");
  redirect("/admin/brokers");
}

export async function updateBrokerAction(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const data = parseBroker(formData);
  if (!data.name) throw new Error("Broker name is required");
  await updateBroker(id, data);
  revalidatePath("/admin/brokers");
  revalidatePath("/admin/properties");
  redirect("/admin/brokers");
}

export async function deleteBrokerAction(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  await deleteBroker(id);
  revalidatePath("/admin/brokers");
  revalidatePath("/admin/properties");
  redirect("/admin/brokers");
}
