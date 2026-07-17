"use client";

import { useState } from "react";
import LeadCaptureForm from "./LeadCaptureForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function InspectionChecklist() {
  const { t } = useLanguage();
  const c = t.tools_ui.inspection_checklist;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(item: string) {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  const checkedItems = Object.entries(checked)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const details = checkedItems.length
    ? `${c.lead_details_prefix.replace("{n}", String(checkedItems.length))}\n${checkedItems.join("\n")}`
    : c.lead_details_none;

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-light">{c.intro}</p>

      {c.categories.map((cat) => (
        <div key={cat.title}>
          <p className="text-xs tracking-widest text-gold uppercase mb-3">{cat.title}</p>
          <div className="space-y-2">
            {cat.items.map((item) => (
              <label
                key={item}
                className="flex items-center justify-between gap-3 bg-black/40 border border-gray-dark rounded-lg px-4 py-3 cursor-pointer"
              >
                <span className="text-sm text-cream">{item}</span>
                <input
                  type="checkbox"
                  checked={!!checked[item]}
                  onChange={() => toggle(item)}
                  className="w-4 h-4 accent-gold shrink-0"
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="border-t border-gray-dark pt-6">
        <LeadCaptureForm
          toolName={c.tool_name}
          details={details}
          ctaLabel={c.cta_label}
          submitLabel={c.submit_label}
        />
      </div>
    </div>
  );
}
