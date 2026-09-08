"use client";

import { BellRing } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Fixed tab on the inline-end edge of the viewport (left in RTL), vertically
 * centred. Opens the newsletter dialog via the `newsletter:open` event that
 * NewsletterModal listens for. Placed on /nadlan, where turning browsers into
 * subscribers is the whole job.
 */
export default function NewsletterCtaTab() {
  const { t } = useLanguage();
  const n = t.newsletter;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("newsletter:open"))}
      aria-haspopup="dialog"
      aria-label={n.cta_tab}
      title={n.cta_tab}
      className="nl-tab-in fixed top-1/2 -translate-y-1/2 end-0 z-[95]
                 flex items-center gap-2.5 rounded-s-2xl
                 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-black
                 shadow-xl shadow-black/50 ring-1 ring-black/10
                 p-3 md:py-4 md:pe-3 md:ps-3.5 md:max-w-[160px]
                 transition-[filter,box-shadow] hover:brightness-[1.06] hover:shadow-2xl
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
    >
      <BellRing size={19} className="shrink-0" aria-hidden="true" />
      <span className="hidden md:block text-[0.78rem] font-bold leading-[1.35] text-start">
        {n.cta_tab}
      </span>
    </button>
  );
}
