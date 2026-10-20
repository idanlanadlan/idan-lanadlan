"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Sparkles, Upload } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { regenerateCoverImage } from "@/app/actions/blog";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

interface Props {
  action: (formData: FormData) => Promise<void>;
  post?: Partial<BlogPost>;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-gold flex-1 py-3 rounded-lg text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending && <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />}
      {pending ? "שומר... (כולל תרגום אוטומטי, עד כדקה)" : isEdit ? "שמור שינויים" : "צור מאמר"}
    </button>
  );
}

export default function BlogForm({ action, post }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const altInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [coverPreview, setCoverPreview] = useState(post?.cover_image ?? "");

  async function handleFileSelect(file: File) {
    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch("/api/upload-images", { method: "POST", body: formData });
      const json = (await res.json()) as { urls?: string[]; error?: string };

      if (!res.ok || json.error || !json.urls?.length) {
        setUploadError(
          json.error === "not_configured"
            ? "Supabase לא מחובר — לא ניתן להעלות תמונות"
            : "שגיאה בהעלאת תמונה — נסה שוב"
        );
        return;
      }
      const url = json.urls[0];
      if (coverInputRef.current) coverInputRef.current.value = url;
      setCoverPreview(url);
    } finally {
      setUploading(false);
    }
  }

  // Draws a fresh AI cover from the text currently in the form (works for unsaved
  // drafts too) and drops the URL + alt text into the fields. Nothing is saved
  // until the form is submitted.
  async function handleRegenerate() {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) {
      setUploadError("הוסף כותרת למאמר לפני יצירת תמונה");
      return;
    }
    setUploadError("");
    setGenerating(true);
    try {
      const res = await regenerateCoverImage({
        title,
        excerpt: String(fd.get("excerpt") ?? ""),
        keywords: String(fd.get("keywords") ?? "")
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        slug: String(fd.get("slug") ?? ""),
      });
      if (!res.ok) {
        setUploadError(
          res.error === "not_configured"
            ? "יצירת תמונות AI לא מוגדרת (חסר GEMINI_API_KEY ב-Vercel)"
            : "לא הצלחנו ליצור תמונה — נסה שוב, או העלה קובץ"
        );
        return;
      }
      if (coverInputRef.current) coverInputRef.current.value = res.url;
      if (altInputRef.current) altInputRef.current.value = res.alt;
      setCoverPreview(res.url);
    } catch {
      setUploadError("לא הצלחנו ליצור תמונה — נסה שוב, או העלה קובץ");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-6">
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
          תמונת כותרת <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <div className="flex gap-2">
          <input
            ref={coverInputRef}
            className={`${field} flex-1`}
            name="cover_image"
            type="url"
            defaultValue={post?.cover_image}
            onChange={(e) => setCoverPreview(e.target.value)}
            placeholder="https://images.unsplash.com/photo-... או העלה קובץ"
            dir="ltr"
            required
            aria-required="true"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold border border-gray-dark text-gray-light hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={14} />
            {uploading ? "מעלה..." : "העלה קובץ"}
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={generating || uploading}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold border border-gold/40 text-gold hover:bg-gold/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={14} />
            {generating ? "יוצר תמונה (עד חצי דקה)..." : "צור תמונה מחדש"}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
            e.target.value = "";
          }}
        />
        {uploadError && <p className="mt-1.5 text-xs text-amber-400">{uploadError}</p>}
        {coverPreview && (
          <>
            {/* Whole image, never cropped: 16:9 matches the generated covers, and
                object-contain keeps hand-uploaded images of any shape fully visible. */}
            <div className="relative w-full max-w-2xl aspect-video mt-2 rounded-lg overflow-hidden border border-gray-dark bg-black">
              <Image src={coverPreview} alt="" fill sizes="672px" className="object-contain" unoptimized />
            </div>
            <p className="text-[10px] text-gray mt-1">
              בעמוד המאמר התמונה מוצגת במסגרת רחבה יותר, ולכן נחתכת מעט למעלה ולמטה.
            </p>
          </>
        )}
        <label className={`${label} mt-4`}>טקסט חלופי לתמונה (alt)</label>
        <input
          ref={altInputRef}
          className={field}
          name="cover_image_alt"
          defaultValue={post?.cover_image_alt}
          maxLength={160}
          placeholder="תיאור קצר של מה שרואים בתמונה — חשוב ל-SEO ולנגישות"
        />
        <p className="text-[10px] text-gray mt-1">
          מה שרואים בתמונה בפועל (לא הכותרת), עד כ-125 תווים. מתורגם אוטומטית לשאר השפות בשמירה.
        </p>
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

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          defaultChecked={post?.featured ?? true}
          className="w-4 h-4 accent-gold"
        />
        <label htmlFor="featured" className="text-sm text-cream cursor-pointer">
          הצג בעמוד הבית
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <SubmitButton isEdit={!!post?.id} />
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
