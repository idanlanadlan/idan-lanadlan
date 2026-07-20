"use client";

import { useState, useTransition, useRef } from "react";
import {
  Link2, Search, ArrowRight,
  Upload, FileText,
} from "lucide-react";
import { previewFromCRMLink } from "@/app/actions/crm-import";
import { parsePropertyFromImage, parsePropertyFromText } from "@/app/actions/ai-import";
import { createPropertyAction } from "@/app/actions/properties";
import PropertyForm from "@/components/admin/PropertyForm";
import type { Property } from "@/lib/types";
import Link from "next/link";

type Preview = Omit<Property, "id" | "created_at">;
type Tab = "crm" | "image" | "text";

const CRM_ERRORS: Record<string, string> = {
  invalid_input: "הלינק לא תקין — הדבק קישור לנכס מ-Nadlan One או מזהה מספרי",
  not_found: "הנכס לא נמצא — ייתכן שהמזהה שגוי או שה-API לא הופעל",
  not_configured: "ה-API לא מוגדר — הוסף NADLAN_ONE_PROP_KEY ו-NADLAN_ONE_PROP_API_KEY ל-Vercel",
  api_error: "שגיאת חיבור ל-Nadlan One",
};

const AI_ERRORS: Record<string, string> = {
  not_configured: "ANTHROPIC_API_KEY לא מוגדר — הוסף אותו ב-Vercel כדי להשתמש בניתוח AI",
  parse_error: "לא הצלחתי לחלץ נתונים — נסה תמונה/טקסט ברורים יותר",
  api_error: "שגיאת חיבור ל-Claude API — נסה שוב",
};

async function compressImage(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target?.result as string;
      img.onload = () => {
        const MAX = 1500;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
          else { w = Math.round((w * MAX) / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({ base64: dataUrl.split(",")[1], mimeType: "image/jpeg" });
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "crm",   label: "לינק CRM",     icon: <Link2    size={14} /> },
  { id: "image", label: "צילום מסך",    icon: <Upload   size={14} /> },
  { id: "text",  label: "הדבקת טקסט",  icon: <FileText size={14} /> },
];

export default function ImportPage() {
  const [tab, setTab] = useState<Tab>("crm");

  // Per-tab inputs
  const [crmInput,      setCrmInput]      = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotUrl,  setScreenshotUrl]  = useState("");
  const [textInput,     setTextInput]     = useState("");
  const screenshotRef = useRef<HTMLInputElement>(null);

  // Shared output
  const [preview,   setPreview]   = useState<Preview | null>(null);
  const [error,     setError]     = useState("");
  const [isParsing, startParse]   = useTransition();

  // ── helpers ──────────────────────────────────────────────

  function switchTab(t: Tab) {
    setTab(t); setPreview(null); setError("");
  }

  function applyResult(
    result: { ok: true; property: Preview } | { ok: false; error: string },
    errMap: Record<string, string>
  ) {
    if (result.ok) {
      setPreview(result.property);
      setError("");
    } else {
      setError(errMap[result.error] ?? "שגיאה לא ידועה");
      setPreview(null);
    }
  }

  // ── per-tab fetch/analyze ────────────────────────────────

  function handleCRMFetch() {
    setPreview(null); setError("");
    startParse(async () => {
      applyResult(await previewFromCRMLink(crmInput), CRM_ERRORS);
    });
  }

  function handleScreenshotSelect(file: File) {
    if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
    setScreenshotFile(file);
    setScreenshotUrl(URL.createObjectURL(file));
    setPreview(null); setError("");
  }

  function handleScreenshotAnalyze() {
    if (!screenshotFile) return;
    setPreview(null); setError("");
    startParse(async () => {
      const { base64, mimeType } = await compressImage(screenshotFile);
      applyResult(await parsePropertyFromImage(base64, mimeType), AI_ERRORS);
    });
  }

  function handleTextAnalyze() {
    if (!textInput.trim()) return;
    setPreview(null); setError("");
    startParse(async () => {
      applyResult(await parsePropertyFromText(textInput), AI_ERRORS);
    });
  }

  // ─────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/properties" className="flex items-center gap-1 text-xs text-gray-light hover:text-gold transition-colors mb-4">
          <ArrowRight size={12} className="rotate-180" />
          חזרה לנכסים
        </Link>
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">ייבוא</p>
        <h1 className="font-display text-3xl font-light text-white">ייבוא נכס</h1>
        <p className="text-xs text-gray-light mt-1">בחר שיטת ייבוא — כל שיטה מובילה לטופס מלא לעריכה ואישור לפני שמירה</p>
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

        {/* ── CRM Tab ── */}
        {tab === "crm" && (
          <>
            <label className="block text-xs text-gold tracking-widest uppercase mb-3">קישור לנכס או מזהה מספרי</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Link2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light" />
                <input
                  type="text" value={crmInput} onChange={(e) => setCrmInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCRMFetch()}
                  placeholder="https://mls.nadlanone.co.il/... או מספר ID"
                  dir="ltr"
                  className="w-full bg-black/30 border border-gray-dark rounded-lg pr-8 pl-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleCRMFetch} disabled={!crmInput.trim() || isParsing}
                className="flex items-center gap-2 bg-gold text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Search size={15} />
                {isParsing ? "טוען..." : "שלוף"}
              </button>
            </div>
          </>
        )}

        {/* ── Screenshot Tab ── */}
        {tab === "image" && (
          <>
            <label className="block text-xs text-gold tracking-widest uppercase mb-3">צילום מסך של הנכס (לניתוח AI)</label>
            <div
              onClick={() => screenshotRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f?.type.startsWith("image/")) handleScreenshotSelect(f);
              }}
              className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                screenshotUrl ? "border-gold/30" : "border-gray-dark hover:border-gold/30"
              }`}
            >
              {screenshotUrl ? (
                <div className="h-44 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={screenshotUrl} alt="צילום מסך" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="py-10 text-center">
                  <Upload size={28} className="mx-auto text-gray-light mb-3" />
                  <p className="text-sm text-gray-light">גרור צילום מסך <span className="text-white">או לחץ לבחירה</span></p>
                  <p className="text-[11px] text-gray-light/50 mt-1">PNG, JPG, WebP — כל גודל</p>
                </div>
              )}
              <input ref={screenshotRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleScreenshotSelect(f); e.target.value = ""; }} />
            </div>
            {screenshotFile && (
              <button
                onClick={handleScreenshotAnalyze} disabled={isParsing}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-gold text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Search size={15} />
                {isParsing ? "מנתח תמונה..." : "נתח צילום מסך"}
              </button>
            )}
            <p className="mt-2 text-[11px] text-gray-light/60 text-center">משתמש ב-Claude AI · ~$0.01 לניתוח</p>
          </>
        )}

        {/* ── Text Tab ── */}
        {tab === "text" && (
          <>
            <label className="block text-xs text-gold tracking-widest uppercase mb-3">הדבק טקסט מודעת נכס</label>
            <textarea
              value={textInput} onChange={(e) => setTextInput(e.target.value)}
              placeholder={`הדבק כאן טקסט מכל מקור — Nadlan One, Yad2, WhatsApp, מייל...\n\nלדוגמה:\nדירת 4 חדרים, 120 מ"ר, קומה 5, נמל תל אביב\nמחיר: 4,500,000 ₪\nרחוב הירקון 100`}
              rows={7} dir="rtl"
              className="w-full bg-black/30 border border-gray-dark rounded-xl px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors resize-none"
            />
            <button
              onClick={handleTextAnalyze} disabled={!textInput.trim() || isParsing}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-gold text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Search size={15} />
              {isParsing ? "מנתח טקסט..." : "נתח טקסט"}
            </button>
            <p className="mt-2 text-[11px] text-gray-light/60 text-center">משתמש ב-Claude AI · פחות מ-$0.01 לניתוח</p>
          </>
        )}

        {/* Shared error */}
        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}
      </div>

      {/* Review + edit before saving — the same form used for manual create/edit */}
      {preview && (
        <div className="bg-charcoal border border-gold/20 rounded-xl p-6">
          <p className="text-xs text-gray-light mb-5">
            הנתונים חולצו אוטומטית — בדוק ותקן לפני השמירה.
          </p>
          <PropertyForm property={preview} action={createPropertyAction} />
        </div>
      )}
    </div>
  );
}
