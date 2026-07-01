import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/db";
import { updateBlogPostAction, deleteBlogPost } from "@/app/actions/blog";
import BlogForm from "@/components/admin/BlogForm";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/admin/blog" className="text-xs text-gray-light hover:text-gold transition-colors mb-4 block">
          ← חזור למאמרים
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">עריכת מאמר</p>
            <h1 className="font-display text-3xl font-light text-white">עדכן מאמר</h1>
            <p className="text-xs text-gray-light mt-1 truncate max-w-md">{post.title}</p>
          </div>
          <div className="flex gap-3">
            {post.published && (
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="text-xs text-gray-light hover:text-gold transition-colors border border-gray-dark rounded-lg px-3 py-1.5"
              >
                צפה באתר ↗
              </Link>
            )}
            <ConfirmDeleteForm
              id={post.id}
              confirmMessage={`למחוק את "${post.title}"?`}
              action={deleteBlogPost}
              className="text-xs text-red-400 hover:text-red-300 transition-colors border border-red-500/30 hover:border-red-400/50 rounded-lg px-3 py-1.5"
            >
              מחק מאמר
            </ConfirmDeleteForm>
          </div>
        </div>
      </div>
      <BlogForm action={updateBlogPostAction} post={post} />
    </div>
  );
}
