"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Link2, Search, MapPin, BedDouble, Maximize2, Star, ArrowRight, Upload, FileText } from "lucide-react";
import { previewFromCRMLink, saveImportedProperty } from "@/app/actions/crm-import";
import { parsePropertyFromImage, parsePropertyFromText } from "@/app/actions/ai-import";
import type { Property } from "@/lib/types";
import Link from "next/link";

type Preview = Omit<Property, "id" | "created_at">;
type Tab = "crm" | "image" | "text";

const CRM_ERRORS: Record<string, string> = {
  invalid_input: "הלינק לא תקין — הדבק קישור לנכס מ-Nadlan One או מזהה מספרי",
  not_found: "הנכס לא נמצא — ייתכן שהמזהה שגוי או שה-API לא הופעל",
  not_configured: "ה-API לא מוגדר — הוסף NADLAN_ONE_PROP_KEY ו-NADLAN_ONE_LEAD_KEY ל-Vercel",
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
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
          else { w = Math.round((w * MAX) / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({ base64: dataUrl.split(",")[1], mimeType: "image/jpeg" });
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "crm", label: "לינק CRM", icon: <Link2 size={14} />, desc: "הדבק קישור מ-Nadlan One" },
  { id: "image", label: "צילום מסך", icon: <Upload size={14} />, desc: "תמונה → נתונים אוטומטית" },
  { id: "text", label: "הדבקת טקסט", icon: <FileText size={14} />, desc: "טקסט מכל מקור" },
];

const typeLabel: Record<string, string> = { sale: "למכירה", rent: "להשכרה", project: "פרויקט" };

export default function ImportPage() {
  const [tab, setTab] = useState<Tab>("crm");

  // Per-tab inputs
  const [crmInput, setCrmInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageObjectUrl, setImageObjectUrl] = useState("");
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shared output
  const [preview, setPreview] = useState<Preview | null>(null);
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState("");
  const [isParsing, startParse] = useTransition();
  const [isSaving, startSave] = useTransition();

  function switchTab(t: Tab) {
    setTab(t);
    setPreview(null);
    setError("");
  }

  function onParseResult(result: { ok: true; property: Preview } | { ok: false; error: string }, errorMap: Record<string, string>) {
    if (result.ok) {
      setPreview(result.property);
      setFeatured(result.property.featured);
      setError("");
    } else {
      setError(errorMap[result.error] ?? "שגיאה לא ידועה");
      setPreview(null);
    }
  }

  function handleCRMFetch() {
    setPreview(null); setError("");
    startParse(async () => {
      const r = await previewFromCRMLink(crmInput);
      onParseResult(r, CRM_ERRORS);
    });
  }

  function handleImageSelect(file: File) {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    setImageFile(file);
    setImageObjectUrl(URL.createObjectURL(file));
    setPreview(null); setError("");
  }

  function handleImageAnalyze() {
    if (!imageFile) return;
    setPreview(null); setError("");
    startParse(async () => {
      const { base64, mimeType } = await compressImage(imageFile);
      const r = await parsePropertyFromImage(base64, mimeType);
      onParseResult(r, AI_ERRORS);
    });
  }

  function handleTextAnalyze() {
    if (!textInput.trim()) return;
    setPreview(null); setError("");
    startParse(async () => {
      const r = await parsePropertyFromText(textInput);
      onParseResult(r, AI_ERRORS);
    });
  }

  function handleSave() {
    if (!preview) return;
    startSave(async () => {
      await saveImportedProperty({ ...preview, featured });
    });
  }

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
        <p className="text-xs text-gray-light mt-1">בחר שיטת ייבוא — כל שיטה מובילה לתצוגה מקדימה ושמירה לאתר</p>
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
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Input card */}
      <div className="bg-charcoal border border-gray-dark rounded-xl p-6 mb-6">

        {/* ── Tab: CRM Link ── */}
        {tab === "crm" && (
          <>
            <label className="block text-xs text-gold tracking-widest uppercase mb-3">
              קישור לנכס או מזהה מספרי
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Link2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light" />
                <input
                  type="text"
                  value={crmInput}
                  onChange={(e) => setCrmInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCRMFetch()}
                  placeholder="https://mls.nadlanone.co.il/... או מספר ID"
                  dir="ltr"
                  className="w-full bg-black/30 border border-gray-dark rounded-lg pr-8 pl-4 py-3 text-sm text-cream placeholder:text-gray-light/40 focus:border-gold outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleCRMFetch}
                disabled={!crmInput.trim() || isParsing}
                className="flex items-center gap-2 bg-gold text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Search size={15} />
                {isParsing ? "טוען..." : "שלוף"}
              </button>
            </div>
          </>
        )}

        {/* ── Tab: Screenshot ── */}
        {tab === "image" && (
          <>
            <label className="block text-xs text-gold tracking-widest uppercase mb-3">
              צילום מסך של הנכס
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f?.type.startsWith("image/")) handleImageSelect(f);
              }}
              className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                imageObjectUrl ? "border-gold/30" : "border-gray-dark hover:border-gold/30"
              }`}
            >
              {imageObjectUrl ? (
                <div className="h-44 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageObjectUrl} alt="תצוגה מקדימה" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="py-10 text-center">
                  <Upload size={28} className="mx-auto text-gray-light mb-3" />
                  <p className="text-sm text-gray-light">
                    גרור תמונה לכאן <span className="text-white">או לחץ לבחירה</span>
                  </p>
                  <p className="text-[11px] text-gray-light/50 mt-1">PNG, JPG, WebP — כל גודל</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageSelect(f);
                  e.target.value = "";
                }}
              />
            </div>
            {imageFile && (
              <button
                onClick={handleImageAnalyze}
                disabled={isParsing}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-gold text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Search size={15} />
                {isParsing ? "מנתח תמונה..." : "נתח צילום מסך"}
              </button>
            )}
            <p className="mt-2 text-[11px] text-gray-light/60 text-center">
              משתמש ב-Claude AI · ~$0.01 לניתוח
            </p>
          </>
        )}

        {/* ── Tab: Text paste ── */}
        {tab === "text" && (
          <>
            <label className="block text-xs text-gold tracking-widest uppercase mb-3">
              הדבק טקסט מודעת נכס
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`הדבק כאן טקסט מכל מקור — Nadlan One, Yad2, WhatsApp, מייל...\n\nלדוגמה:\nדירת 4 חדרים, 120 מ"ר, קומה 5, נמל תל אביב\nמחיר: 4,500,000 ₪\nרחוב הירקון 100`}
              rows={8}
              dir="rtl"
              className="w-full bg-black/30 border border-gray-dark rounded-xl px-4 py-3 text-sm text-cream placeholder:text-gray-light/40 focus:border-gold outline-none transition-colors resize-none"
            />
            <button
              onClick={handleTextAnalyze}
              disabled={!textInput.trim() || isParsing}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-gold text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Search size={15} />
              {isParsing ? "מנתח טקסט..." : "נתח טקסט"}
            </button>
            <p className="mt-2 text-[11px] text-gray-light/60 text-center">
              משתמש ב-Claude AI · פחות מ-$0.01 לניתוח
            </p>
          </>
        )}

        {/* Shared error */}
        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}
      </div>

      {/* Preview (shared for all tabs) */}
      {preview && (
        <div className="bg-charcoal border border-gold/20 rounded-xl overflow-hidden">
          {preview.images.length > 0 && (
            <div className="relative h-56 bg-black">
              <Image
                src={preview.images[0]}
                alt={preview.title}
                fill
                className="object-cover opacity-90"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {preview.images.length > 1 && (
                <span className="absolute bottom-3 left-3 text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                  +{preview.images.length - 1} תמונות
                </span>
              )}
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 ml-2">
                  {typeLabel[preview.type] ?? preview.type}
                </span>
                {preview.crm_id && (
                  <span className="text-[10px] text-gray-light">#{preview.crm_id}</span>
                )}
                <h2 className="font-display text-xl text-white font-light mt-2">{preview.title}</h2>
              </div>
              <p className="text-lg font-semibold text-gold shrink-0">
                ₪{preview.price.toLocaleString("he-IL")}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-light mb-4">
              {(preview.neighborhood || preview.city) && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-gold" />
                  {[preview.neighborhood, preview.city].filter(Boolean).join(", ")}
                </span>
              )}
              {preview.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <BedDouble size={12} className="text-gold" />
                  {preview.bedrooms} חדרים
                </span>
              )}
              {preview.size_sqm > 0 && (
                <span className="flex items-center gap-1">
                  <Maximize2 size={12} className="text-gold" />
                  {preview.size_sqm} מ״ר
                </span>
              )}
              {preview.lat && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">קואורדינטות זוהו</span>
                </span>
              )}
            </div>

            {preview.description && (
              <p className="text-xs text-gray-light leading-relaxed mb-5 line-clamp-3">
                {preview.description}
              </p>
            )}

            {/* Featured toggle */}
            <label className="flex items-center gap-3 cursor-pointer mb-5">
              <button
                type="button"
                role="switch"
                aria-checked={featured}
                onClick={() => setFeatured(!featured)}
                className={`w-10 h-5 rounded-full transition-colors relative ${featured ? "bg-gold" : "bg-gray-dark"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    featured ? "translate-x-[-1.25rem]" : "translate-x-[-0.25rem]"
                  }`}
                />
              </button>
              <span className="flex items-center gap-1 text-sm text-white">
                <Star size={13} className={featured ? "text-gold" : "text-gray-light"} fill={featured ? "currentColor" : "none"} />
                הצג בדף הבית (נכס מוצג)
              </span>
            </label>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gold text-black py-3 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSaving ? "שומר..." : "הוסף לאתר ←"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
