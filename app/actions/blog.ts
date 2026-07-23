"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBlogPost, updateBlogPost, deleteBlogPost as dbDeleteBlogPost, getBlogPostById } from "@/lib/db";
import { translateBlogPostFields } from "@/lib/translate-blogpost";

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
    // Browser <textarea> form submissions normalize line breaks to \r\n,
    // which breaks the \n\n paragraph-split rendering on the public page.
    content: (formData.get("content") as string).replace(/\r\n/g, "\n"),
    cover_image: formData.get("cover_image") as string,
    keywords,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  };
}

export async function createBlogPostAction(formData: FormData) {
  const data = parseForm(formData);
  const translations = await translateBlogPostFields(data);
  await createBlogPost({ ...data, ...translations });
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPostAction(formData: FormData) {
  const id = formData.get("id") as string;
  const data = parseForm(formData);
  const translations = await translateBlogPostFields(data);
  await updateBlogPost(id, { ...data, ...translations });
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

/**
 * Manual backfill for posts published before auto-translation existed (or
 * whose translation failed silently). Re-translates from the current Hebrew
 * fields and updates in place — does not touch published/slug/etc.
 */
export async function translateExistingPost(formData: FormData) {
  const id = formData.get("id") as string;
  const post = await getBlogPostById(id);
  if (!post) return;
  const translations = await translateBlogPostFields({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    keywords: post.keywords,
  });
  if (translations) await updateBlogPost(id, translations);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
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
