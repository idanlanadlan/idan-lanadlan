"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  name: string;
  defaultImages?: string[];
}

export default function ImageManager({ name, defaultImages = [] }: Props) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSelect(files: FileList) {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .forEach((f) => formData.append("files", f));

      const res = await fetch("/api/upload-images", { method: "POST", body: formData });
      const json = (await res.json()) as { urls?: string[]; error?: string };

      if (!res.ok || json.error) {
        setError(
          json.error === "not_configured"
            ? "Supabase לא מחובר — לא ניתן להעלות תמונות"
            : "שגיאה בהעלאת תמונות — נסה שוב"
        );
        return;
      }
      setImages((prev) => [...prev, ...(json.urls ?? [])]);
    } finally {
      setUploading(false);
    }
  }

  function move(i: number, dir: -1 | 1) {
    setImages((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function remove(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <input type="hidden" name={name} value={images.join("\n")} />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="rounded-lg overflow-hidden border border-gray-dark bg-black">
              <div className="relative aspect-square">
                <Image src={url} alt="" fill sizes="200px" className="object-cover" unoptimized />
                {i === 0 && (
                  <span className="absolute top-1 end-1 text-[9px] bg-gold text-black font-bold px-1.5 py-0.5 rounded">
                    ראשית
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-1 bg-charcoal">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="הזז קודם"
                  className="flex-1 py-1 rounded flex items-center justify-center text-gray-light hover:text-gold disabled:opacity-25 disabled:hover:text-gray-light transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  aria-label="הזז הבא"
                  className="flex-1 py-1 rounded flex items-center justify-center text-gray-light hover:text-gold disabled:opacity-25 disabled:hover:text-gray-light transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="הסר תמונה"
                  className="flex-1 py-1 rounded flex items-center justify-center text-gray-light hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-dark hover:border-gold/40 flex items-center justify-center transition-colors"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImagePlus size={18} className="text-gray-light" />
            )}
          </button>
        </div>
      )}

      {images.length === 0 && (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) handleSelect(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-gray-dark hover:border-gold/30 rounded-xl py-8 text-center cursor-pointer transition-colors"
        >
          <ImagePlus size={24} className="mx-auto text-gray-light mb-2" />
          <p className="text-sm text-gray-light">
            גרור תמונות <span className="text-white">או לחץ לבחירה</span>
          </p>
          <p className="text-[11px] text-gray-light/50 mt-1">ניתן לבחור מספר תמונות בבת אחת</p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleSelect(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2">{error}</p>
      )}
      {images.length > 0 && (
        <p className="text-[10px] text-gray mt-1.5">
          התמונה הראשונה (מסומנת &quot;ראשית&quot;) מוצגת בכרטיס הנכס — השתמשו בחיצים כדי לשנות סדר
        </p>
      )}
    </div>
  );
}
