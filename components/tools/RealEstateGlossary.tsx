"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RealEstateGlossary() {
  const { t } = useLanguage();
  const terms = t.tools_ui.glossary.terms;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {terms.map((term, i) => (
        <div key={term.term} className="border border-gray-dark rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls={`glossary-panel-${i}`}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-black/40 text-right hover:bg-black/60 transition-colors"
          >
            <span className="text-sm font-semibold text-white">{term.term}</span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`text-gold shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div id={`glossary-panel-${i}`} className="px-4 py-4 text-sm text-gray-light leading-relaxed bg-black/20">
              {term.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
