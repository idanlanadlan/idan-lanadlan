"use client";

import { useState, useTransition } from "react";
import { Sparkles, Link2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { generateBlogDraft } from "@/app/actions/blog-generate";
import { createBlogPostAction } from "@/app/actions/blog";
import BlogForm from "@/components/admin/BlogForm";
import type { BlogPost } from "@/lib/types";

type Tab = "idea" | "content" | "link";

const TABS: { id: Tab; label: string; icon: React.ReactNode; placeholder: string }[] = [
  {
    id: "idea",
    label: "רעיון",
    icon: <Sparkles size={14} />,
    placeholder: "לדוגמה: 5 טעויות שכל רוכש דירה ראשונה בתל אביב עושה",
  },
  {
    id: "content",
    label: "תוכן קיים",
    icon: <FileText size={14} />,
    placeholder: "הדבק כאן טקסט/טיוטה קיימת — ה-AI יכתוב מחדש ויתמצת בקול המותג",
  },
  {
    id: "link",
    label: "קישור",
    icon: <Link2 size={14} />,
    placeholder: "https://... קישור למאמר קיים באתר אחר (משמש כהשראה בלבד)",
  },
];

const GENERATE_ERRORS: Record<string, string> = {
  not_configured: "ANTHROPIC_API_KEY לא מוגדר — הוסף אותו ב-Vercel כדי להשתמש ביצירת מאמרים",
  fetch_error: "לא הצלחתי לשלוף את הקישור — ודא שהוא תקין ונגיש",
  parse_error: "לא הצלחתי לחלץ טיוטה — נסה שוב או נסח את הרעיון אחרת",
  api_error: "שגיאת חיבור ל-Claude API — נסה שוב",
};

export default function GenerateClient() {
  const [tab, setTab] = useState<Tab>("idea");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Partial<BlogPost> | null>(null);
  const [isGenerating, startGenerate] = useTransition();

  function switchTab(t: Tab) {
    setTab(t);
    setValue("");
    setError("");
    setDraft(null);
  }

  function handleGenerate() {
    if (!value.trim()) return;
    setError("");
    setDraft(null);
    startGenerate(async () => {
      const result = await generateBlogDraft(tab, value.trim());
      if (result.ok) {
        setDraft(result.draft);
      } else {
        setError(GENERATE_ERRORS[result.error] ?? "שגיאה לא ידועה");
      }
    });
  }

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/admin/blog" className="flex items-center gap-1 text-xs text-gray-light hover:text-gold transition-colors mb-4">
          <ArrowRight size={12} className="rotate-180" />
          חזרה למאמרים
        </Link>
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">AI</p>
        <h1 className="font-display text-3xl font-light text-white">צור מאמר עם AI</h1>
        <p className="text-xs text-gray-light mt-1">
          רעיון, תוכן קיים או קישור — נוצרת טיוטה ממוטבת SEO/AEO לעריכה ואישור לפני פרסום
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-charcoal border border-gray-dark rounded-xl p-1 mb-4">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              tab === id ? "bg-gold text-black" : "text-gray-light hover:text-white"
            }`}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Input card */}
      <div className="bg-charcoal border border-gray-dark rounded-xl p-6 mb-6">
        <label className="block text-xs text-gold tracking-widest uppercase mb-3">
          {activeTab.label}
        </label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={activeTab.placeholder}
          rows={tab === "content" ? 8 : 4}
          dir={tab === "link" ? "ltr" : "rtl"}
          className="w-full bg-black/30 border border-gray-dark rounded-xl px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={!value.trim() || isGenerating}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-gold text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles size={15} />
          {isGenerating ? "כותב טיוטה..." : "צור טיוטה עם AI"}
        </button>
        <p className="mt-2 text-[11px] text-gray-light/60 text-center">משתמש ב-Claude AI · עשוי לקחת עד דקה</p>

        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}
      </div>

      {/* Draft → hand off to the existing blog form for review/edit/save */}
      {draft && (
        <div className="bg-charcoal border border-gold/20 rounded-xl p-6">
          <p className="text-xs text-gold tracking-widest uppercase mb-4">טיוטה — סקור וערוך לפני שמירה</p>
          <BlogForm action={createBlogPostAction} post={draft} />
        </div>
      )}
    </div>
  );
}
