"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Link2, Search, MapPin, BedDouble, Maximize2, Star, ArrowRight } from "lucide-react";
import { previewFromCRMLink, saveImportedProperty } from "@/app/actions/crm-import";
import type { Property } from "@/lib/types";
import Link from "next/link";

type Preview = Omit<Property, "id" | "created_at">;

const ERROR_MSG: Record<string, string> = {
  invalid_input: "הלינק לא תקין — הדבק קישור לנכס מ-Nadlan One או מזהה מספרי",
  not_found: "הנכס לא נמצא — ייתכן שהמזהה שגוי או שה-API לא הופעל",
  not_configured: "ה-API לא מוגדר — הוסף NADLAN_ONE_PROP_KEY ו-NADLAN_ONE_LEAD_KEY ל-Vercel",
  api_error: "שגיאת חיבור ל-Nadlan One — ייתכן שה-IP לא ב-Whitelist",
};

export default function CRMImportPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState("");
  const [isPreviewing, startPreview] = useTransition();
  const [isSaving, startSave] = useTransition();

  function handlePreview() {
    setError("");
    setPreview(null);
    startPreview(async () => {
      const result = await previewFromCRMLink(input);
      if (result.ok) {
        setPreview(result.property);
        setFeatured(result.property.featured);
      } else {
        setError(ERROR_MSG[result.error] ?? "שגיאה לא ידועה");
      }
    });
  }

  function handleSave() {
    if (!preview) return;
    startSave(async () => {
      await saveImportedProperty({ ...preview, featured });
    });
  }

  const typeLabel: Record<string, string> = { sale: "למכירה", rent: "להשכרה", project: "פרויקט" };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/admin/properties" className="flex items-center gap-1 text-xs text-gray-light hover:text-gold transition-colors mb-4">
          <ArrowRight size={12} className="rotate-180" />
          חזרה לנכסים
        </Link>
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">ייבוא</p>
        <h1 className="font-display text-3xl font-light text-white">ייבוא נכס מ-Nadlan One</h1>
        <p className="text-xs text-gray-light mt-1">הדבק קישור לנכס מ-CRM ואשר — הנכס ייכנס אוטומטית לאתר</p>
      </div>

      {/* Input */}
      <div className="bg-charcoal border border-gray-dark rounded-xl p-6 mb-6">
        <label className="block text-xs text-gold tracking-widest uppercase mb-3">
          קישור לנכס או מזהה מספרי
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Link2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePreview()}
              placeholder="https://app.nadlanone.co.il/.../100268"
              dir="ltr"
              className="w-full bg-black/30 border border-gray-dark rounded-lg pr-8 pl-4 py-3 text-sm text-cream placeholder:text-gray-light/40 focus:border-gold outline-none transition-colors"
            />
          </div>
          <button
            onClick={handlePreview}
            disabled={!input.trim() || isPreviewing}
            className="flex items-center gap-2 bg-gold text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Search size={15} />
            {isPreviewing ? "טוען..." : "שלוף"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="bg-charcoal border border-gold/20 rounded-xl overflow-hidden">
          {/* Images */}
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
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 mr-2">
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
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-gold" />
                {[preview.neighborhood, preview.city].filter(Boolean).join(", ")}
              </span>
              <span className="flex items-center gap-1">
                <BedDouble size={12} className="text-gold" />
                {preview.bedrooms} חדרים
              </span>
              <span className="flex items-center gap-1">
                <Maximize2 size={12} className="text-gold" />
                {preview.size_sqm} מ״ר
              </span>
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
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${featured ? "translate-x-[-1.25rem]" : "translate-x-[-0.25rem]"}`}
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
