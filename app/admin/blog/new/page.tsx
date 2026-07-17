import Link from "next/link";
import { createBlogPostAction } from "@/app/actions/blog";
import BlogForm from "@/components/admin/BlogForm";

// Translating a full article into 3 languages via Claude can exceed Vercel's
// default Server Action timeout — same fix as the AI blog generator.
export const maxDuration = 120;

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/admin/blog" className="text-xs text-gray-light hover:text-gold transition-colors mb-4 block">
          ← חזור למאמרים
        </Link>
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">מאמר חדש</p>
        <h1 className="font-display text-3xl font-light text-white">כתוב מאמר</h1>
      </div>
      <BlogForm action={createBlogPostAction} />
    </div>
  );
}
