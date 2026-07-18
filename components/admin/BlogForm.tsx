"use client";

import type { BlogPost } from "@/lib/types";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

interface Props {
  action: (formData: FormData) => Promise<void>;
  post?: Partial<BlogPost>;
}

export default function BlogForm({ action, post }: Props) {
  return (
    <form action={action} className="flex flex-col gap-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label className={label}>כותרת *</label>
        <input
          className={field}
          name="title"
          required
          defaultValue={post?.title}
          placeholder="5 טעויות שכל רוכש דירה עושה"
        />
      </div>

      <div>
        <label className={label}>Slug (URL)</label>
        <input
          className={`${field} font-mono text-xs`}
          name="slug"
          defaultValue={post?.slug}
          placeholder="5-mistakes-buyers (ריק = נוצר אוטומטי)"
          dir="ltr"
        />
        <p className="text-[10px] text-gray mt-1">יופיע כ: /blog/slug — אותיות לטיניות, מקפים בלבד</p>
      </div>

      <div>
        <label className={label}>תקציר (מוצג ברשימת המאמרים) *</label>
        <textarea
          className={`${field} h-20 resize-none`}
          name="excerpt"
          required
          defaultValue={post?.excerpt}
          placeholder="תיאור קצר של המאמר — 1-2 משפטים"
        />
      </div>

      <div>
        <label className={label}>תוכן המאמר</label>
        <textarea
          className={`${field} h-80 resize-y`}
          name="content"
          defaultValue={post?.content}
          placeholder={"פסקה ראשונה...\n\nפסקה שנייה...\n\nהפרד פסקאות בשורה ריקה"}
        />
        <p className="text-[10px] text-gray mt-1">הפרד פסקאות בשורה ריקה. HTML לא נתמך.</p>
      </div>

      <div>
        <label className={label}>
          תמונת כותרת (URL) <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          className={field}
          name="cover_image"
          type="url"
          defaultValue={post?.cover_image}
          placeholder="https://images.unsplash.com/photo-..."
          dir="ltr"
          required
          aria-required="true"
        />
      </div>

      <div>
        <label className={label}>מילות מפתח (מופרדות בפסיק)</label>
        <input
          className={field}
          name="keywords"
          defaultValue={post?.keywords?.join(", ")}
          placeholder="נדל״ן, תל אביב, רכישת דירה"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={post?.published ?? false}
          className="w-4 h-4 accent-gold"
        />
        <label htmlFor="published" className="text-sm text-cream cursor-pointer">
          פרסם מאמר (מוצג באתר)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="btn-gold flex-1 py-3 rounded-lg text-sm font-semibold"
        >
          {post?.id ? "שמור שינויים" : "צור מאמר"}
        </button>
        <a
          href="/admin/blog"
          className="px-6 py-3 rounded-lg text-sm text-gray-light border border-gray-dark hover:border-gold/40 hover:text-gold transition-colors"
        >
          ביטול
        </a>
      </div>
    </form>
  );
}
