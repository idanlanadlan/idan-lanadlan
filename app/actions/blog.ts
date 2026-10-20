"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBlogPost, updateBlogPost, deleteBlogPost as dbDeleteBlogPost, getBlogPostById } from "@/lib/db";
import { translateBlogPostFields } from "@/lib/translate-blogpost";
import { generateWeeklyDraft } from "@/app/actions/blog-generate";
import { craftImagePrompt, createCoverFromPrompt, createDraftWithCover } from "@/lib/blog-image";
import { isAdmin } from "@/lib/require-admin";

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
    cover_image_alt: ((formData.get("cover_image_alt") as string | null) ?? "").trim(),
    keywords,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  };
}

export async function createBlogPostAction(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const data = parseForm(formData);
  const translations = await translateBlogPostFields(data);
  await createBlogPost({ ...data, ...translations });
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPostAction(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
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
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const post = await getBlogPostById(id);
  if (!post) return;
  const translations = await translateBlogPostFields({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    keywords: post.keywords,
    cover_image_alt: post.cover_image_alt,
  });
  if (translations) await updateBlogPost(id, translations);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
}

/**
 * Manual "generate this week's draft now" — the same generator the Sunday cron
 * runs (news digest + evergreen topic pool), but on demand from /admin/blog.
 * Saves an unpublished Hebrew draft and drops Idan straight into its editor.
 */
export async function generateWeeklyDraftNow() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const result = await generateWeeklyDraft();
  if (!result.ok) redirect(`/admin/blog?gen_error=${result.error}`);
  const { post } = await createDraftWithCover(result.draft);
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${post.id}/edit`);
}

export type RegenerateCoverResult =
  | { ok: true; url: string; alt: string }
  | { ok: false; error: "not_configured" | "no_prompt" | "generate_failed" };

/**
 * "צור תמונה מחדש" in the blog form. Works from the form's current text (so it
 * also serves unsaved AI drafts): Claude writes a fresh image prompt + alt, Gemini
 * draws it, and the URL goes back to the form without a reload, which keeps any
 * unsaved edits. Nothing is written to the post until Idan saves the form.
 */
export async function regenerateCoverImage(input: {
  title: string;
  excerpt: string;
  keywords: string[];
  slug: string;
}): Promise<RegenerateCoverResult> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  if (!process.env.GEMINI_API_KEY) return { ok: false, error: "not_configured" };
  const crafted = await craftImagePrompt(input.title, input.excerpt, input.keywords);
  if (!crafted) return { ok: false, error: "no_prompt" };
  const url = await createCoverFromPrompt(input.slug || slugify(input.title), crafted.image_prompt);
  if (!url) return { ok: false, error: "generate_failed" };
  return { ok: true, url, alt: crafted.cover_alt.slice(0, 160) };
}

export async function deleteBlogPost(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  await dbDeleteBlogPost(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function togglePublished(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = formData.get("id") as string;
  const published = formData.get("published") === "true";
  await updateBlogPost(id, { published });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
