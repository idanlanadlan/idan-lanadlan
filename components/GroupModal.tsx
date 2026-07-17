"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ConsentCheckboxes, { type ConsentValue } from "@/components/ConsentCheckboxes";

type GroupType = "sale" | "rent";

const GROUP_LINKS: Record<GroupType, string> = {
  sale: "https://chat.whatsapp.com/GSOVeKqRQZu1QyOIRLBOZS",
  rent: "https://chat.whatsapp.com/GVsHdMLqhu5L22uyXpND0B",
};

interface Props {
  groupType: GroupType;
  onClose: () => void;
}

export default function GroupModal({ groupType, onClose }: Props) {
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [looking, setLooking] = useState("");
  const [budget, setBudget] = useState("");
  const [hasProperty, setHasProperty] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState<ConsentValue>({ privacy: false, marketing: false });
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const { t } = useLanguage();
  const m = t.groups_modal;
  const g = t.sections.groups;
  const link = GROUP_LINKS[groupType];
  const label = groupType === "sale" ? g.sale_title : g.rent_title;

  // Dialog behavior: Esc closes, focus moves in on open and back on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent.privacy) return;

    const typeLabel = groupType === "sale" ? "מכירה" : "השכרה";
    const purposeLabel = hasProperty === "investment" ? m.purpose_investment
      : hasProperty === "living" ? m.purpose_living
      : hasProperty === "both" ? m.purpose_both
      : "—";
    // Consent facts ride along in the WhatsApp message — its timestamp is the
    // record (this flow has no server action to log through).
    const msg = [
      `🏠 בקשת הצטרפות — קבוצת ${typeLabel}`,
      ``,
      `👤 שם: ${name}`,
      `📱 טלפון: ${phone}`,
      `🔍 מחפש: ${looking}`,
      `💰 תקציב: ${budget}`,
      `🏡 מטרת הנכס: ${purposeLabel}`,
      ``,
      `✅ אישור מדיניות פרטיות: כן`,
      `📨 הסכמה לעדכונים שיווקיים: ${consent.marketing ? "כן" : "לא"}`,
    ].join("\n");

    window.open(
      `https://wa.me/972549791171?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: "#111", border: "1px solid rgba(201,169,110,0.25)", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(201,169,110,0.15)" }}
        >
          <div>
            <p className="text-[11px] tracking-[0.25em] text-gold uppercase mb-0.5">
              {groupType === "sale" ? g.sale_badge : g.rent_badge}
            </p>
            <h2 id={`${uid}-title`} className="text-white font-semibold text-base">{label}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t.nav.close}
            className="p-1.5 text-gray-light hover:text-cream rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            /* Form */
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="px-6 py-5 flex flex-col gap-4 overflow-y-auto"
            >
              <p className="text-sm text-gray-light leading-relaxed">
                {m.description}
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <label htmlFor={`${uid}-name`} className="text-xs text-gold mb-1 block">{m.name_label}</label>
                  <input
                    id={`${uid}-name`}
                    ref={firstFieldRef}
                    type="text"
                    required
                    aria-required="true"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={m.name_placeholder}
                    className="w-full bg-white/5 border border-gray-dark/60 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-phone`} className="text-xs text-gold mb-1 block">{m.phone_label}</label>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    required
                    aria-required="true"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05X-XXX-XXXX"
                    dir="ltr"
                    className="w-full bg-white/5 border border-gray-dark/60 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-looking`} className="text-xs text-gold mb-1 block">
                    {groupType === "sale" ? m.looking_label_sale : m.looking_label_rent}
                  </label>
                  <input
                    id={`${uid}-looking`}
                    type="text"
                    value={looking}
                    onChange={(e) => setLooking(e.target.value)}
                    placeholder={groupType === "sale" ? m.looking_placeholder_sale : m.looking_placeholder_rent}
                    className="w-full bg-white/5 border border-gray-dark/60 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-budget`} className="text-xs text-gold mb-1 block">{m.budget_label}</label>
                  <input
                    id={`${uid}-budget`}
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder={groupType === "sale" ? m.budget_placeholder_sale : m.budget_placeholder_rent}
                    className="w-full bg-white/5 border border-gray-dark/60 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-purpose`} className="text-xs text-gold mb-1 block">
                    {m.purpose_label}
                  </label>
                  <select
                    id={`${uid}-purpose`}
                    value={hasProperty}
                    onChange={(e) => setHasProperty(e.target.value)}
                    className="w-full bg-[#111] border border-gray-dark/60 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
                  >
                    <option value="">{m.purpose_placeholder}</option>
                    <option value="investment">{m.purpose_investment}</option>
                    <option value="living">{m.purpose_living}</option>
                    <option value="both">{m.purpose_both}</option>
                  </select>
                </div>
              </div>

              <ConsentCheckboxes value={consent} onChange={setConsent} />

              <button
                type="submit"
                disabled={!consent.privacy}
                className="btn-gold w-full py-3 rounded-xl text-sm font-semibold mt-1 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {m.submit_button}
              </button>

              <p className="text-[11px] text-gray-light text-center">
                {m.disclaimer}
              </p>
            </motion.form>
          ) : (
            /* Success screen */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-8 flex flex-col items-center gap-5 text-center"
            >
              <CheckCircle size={52} className="text-gold" />
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{m.success_title}</h3>
                <p className="text-sm text-gray-light leading-relaxed">
                  {m.success_message}
                </p>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.112.549 4.093 1.508 5.814L.057 23.527c-.048.177.003.365.133.494.1.1.232.153.367.153.042 0 .085-.005.126-.016l5.91-1.522A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882c-1.95 0-3.77-.554-5.3-1.508l-.38-.225-3.506.902.946-3.42-.247-.395A9.838 9.838 0 012.118 12C2.118 6.527 6.527 2.118 12 2.118c5.473 0 9.882 4.409 9.882 9.882 0 5.473-4.409 9.882-9.882 9.882z"/>
                </svg>
                {m.success_button}
                <ExternalLink size={14} />
              </a>
              <button
                onClick={onClose}
                className="text-xs text-gray-light hover:text-cream transition-colors"
              >
                {t.nav.close}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
