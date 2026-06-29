"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBlogPost, updateBlogPost, deleteBlogPost as dbDeleteBlogPost } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[֐-׿]/g, "") // remove Hebrew chars
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    || `post-${Date.now()}`;
}

function parseForm(formData: FormData) {
  const title = formData.get("title") as string;
  const keywords = (formData.get("keywords") as string)
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title,
    slug: (formData.get("slug") as string) || slugify(title),
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    cover_image: formData.get("cover_image") as string,
    keywords,
    published: formData.get("published") === "on",
  };
}

export async function createBlogPostAction(formData: FormData) {
  const data = parseForm(formData);
  await createBlogPost(data);
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPostAction(formData: FormData) {
  const id = formData.get("id") as string;
  const data = parseForm(formData);
  await updateBlogPost(id, data);
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  const id = formData.get("id") as string;
  await dbDeleteBlogPost(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function togglePublished(formData: FormData) {
  const id = formData.get("id") as string;
  const published = formData.get("published") === "true";
  await updateBlogPost(id, { published });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
