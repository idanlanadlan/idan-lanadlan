import { mockProperties } from "./mock-data";
import { createClient, createAdminClient, isConfigured } from "./supabase";
import type { Property } from "./types";

export async function getProperties(): Promise<Property[]> {
  if (!isConfigured) return mockProperties;
  const { data } = await createClient()
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Property[]) ?? [];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (!isConfigured) return mockProperties.find((p) => p.id === id) ?? null;
  const { data } = await createClient()
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  return (data as Property) ?? null;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  if (!isConfigured) return mockProperties.filter((p) => p.featured && p.status === "available");
  const { data } = await createClient()
    .from("properties")
    .select("*")
    .eq("featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(6);
  return (data as Property[]) ?? [];
}

export async function createProperty(property: Omit<Property, "id" | "created_at">): Promise<Property> {
  const { data, error } = await createAdminClient()
    .from("properties")
    .insert([property])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Property;
}

export async function updateProperty(id: string, property: Partial<Omit<Property, "id" | "created_at">>): Promise<Property> {
  const { data, error } = await createAdminClient()
    .from("properties")
    .update(property)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await createAdminClient()
    .from("properties")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
