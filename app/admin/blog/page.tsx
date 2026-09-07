import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, Sparkles, Languages, CalendarClock } from "lucide-react";
import { getAllBlogPosts } from "@/lib/db";
import { deleteBlogPost, togglePublished, translateExistingPost, generateWeeklyDraftNow } from "@/app/actions/blog";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

export const dynamic = "force-dynamic";
// translateExistingPost / generateWeeklyDraftNow call Claude on a full article
// — same timeout headroom as the create/edit forms.
export const maxDuration = 120;

const GEN_ERRORS: Record<string, string> = {
  not_configured: "ANTHROPIC_API_KEY לא מוגדר ב-Vercel",
  parse_error: "ה-AI לא החזיר טיוטה תקינה — נסה שוב",
  api_error: "שגיאת חיבור ל-Claude API — נסה שוב",
};

export default async function BlogAdmin({
  searchParams,
}: {
  searchParams: Promise<{ gen_error?: string }>;
}) {
  const [posts, { gen_error }] = await Promise.all([getAllBlogPosts(), searchParams]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">ניהול</p>
          <h1 className="font-display text-3xl font-light text-white">מאמרים</h1>
          <p className="text-xs text-gray-light mt-1">{posts.length} מאמרים בסך הכל</p>
        </div>
        <div className="flex items-center gap-3">
          <form action={generateWeeklyDraftNow}>
            <button
              type="submit"
              title="מייצר טיוטה מכותרות החדשות של השבוע + מאגר נושאים — נשמרת כטיוטה בעברית"
              className="flex items-center gap-2 border border-gold/40 text-gold px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/10 transition-colors"
            >
              <CalendarClock size={16} />
              טיוטה שבועית עכשיו
            </button>
          </form>
          <Link
            href="/admin/blog/generate"
            className="flex items-center gap-2 border border-gold/40 text-gold px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/10 transition-colors"
          >
            <Sparkles size={16} />
            צור מאמר עם AI
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 bg-gold text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors"
          >
            <Plus size={16} />
            מאמר חדש
          </Link>
        </div>
      </div>

      {gen_error && (
        <p className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {GEN_ERRORS[gen_error] ?? "יצירת הטיוטה נכשלה — נסה שוב"}
        </p>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-light">
          <p className="text-lg mb-2">אין מאמרים עדיין</p>
          <Link href="/admin/blog/new" className="text-gold hover:underline text-sm">
            כתוב מאמר ראשון
          </Link>
        </div>
      ) : (
        <div className="bg-charcoal border border-gray-dark rounded-xl overflow-hidden">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-black/20 transition-colors ${
                i < posts.length - 1 ? "border-b border-gray-dark" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="text-sm text-white hover:text-gold transition-colors block truncate"
                >
                  {post.title}
                </Link>
                <p className="text-xs text-gray-light mt-0.5 truncate">
                  {new Date(post.created_at).toLocaleDateString("he-IL")} · /{post.slug}
                </p>
              </div>

              {/* Published toggle */}
              <form action={togglePublished}>
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="published" value={String(!post.published)} />
                <button
                  type="submit"
                  title={post.published ? "הסתר (ביטול פרסום)" : "פרסם"}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors ${
                    post.published
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400"
                      : "bg-gray-dark text-gray-light hover:bg-emerald-500/10 hover:text-emerald-400"
                  }`}
                >
                  {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                  {post.published ? "פורסם" : "טיוטה"}
                </button>
              </form>

              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="p-1.5 text-gray-light hover:text-gold transition-colors"
                title="צפה במאמר"
              >
                <Eye size={15} />
              </Link>

              <form action={translateExistingPost}>
                <input type="hidden" name="id" value={post.id} />
                <button
                  type="submit"
                  className="p-1.5 text-gray-light hover:text-gold transition-colors"
                  title="תרגם מחדש לאנגלית/צרפתית/ספרדית"
                >
                  <Languages size={15} />
                </button>
              </form>

              <Link
                href={`/admin/blog/${post.id}/edit`}
                className="p-1.5 text-gray-light hover:text-gold transition-colors"
                title="עריכה"
              >
                <Pencil size={15} />
              </Link>

              <ConfirmDeleteForm
                id={post.id}
                confirmMessage={`למחוק את "${post.title}"?`}
                action={deleteBlogPost}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
