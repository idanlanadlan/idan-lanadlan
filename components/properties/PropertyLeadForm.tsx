"use client";

import { useId, useState } from "react";
import { MessageSquare } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import { sendPropertyLead } from "@/app/actions/property-leads";
import { isValidPhone } from "@/lib/validation";
import ConsentCheckboxes, { type ConsentValue } from "@/components/ConsentCheckboxes";
import { useLanguage } from "@/contexts/LanguageContext";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-widest uppercase mb-2";

interface Props {
  propertyTitle: string;
  propertyUrl: string;
}

export default function PropertyLeadForm({ propertyTitle, propertyUrl }: Props) {
  const uid = useId();
  const { t } = useLanguage();
  const cf = t.contact_form;
  const pd = t.sections.property_detail;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [consent, setConsent] = useState<ConsentValue>({ privacy: false, marketing: false });

  const phoneValid = isValidPhone(phone);
  const canSubmit = name.trim() && city.trim() && phoneValid && consent.privacy;

  function handlePhoneBlur() {
    setPhoneTouched(true);
    setPhoneError(phone.trim() && !isValidPhone(phone) ? cf.phone_error : "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneTouched(true);
    if (!phoneValid) {
      setPhoneError(cf.phone_error);
      return;
    }
    if (!name.trim() || !city.trim() || !consent.privacy) return;

    setStatus("loading");
    const result = await sendPropertyLead({
      propertyTitle,
      propertyUrl,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      notes: notes.trim() || undefined,
      privacyConsent: consent.privacy,
      marketingConsent: consent.marketing,
    });
    setStatus(result.success ? "success" : "error");
    if (result.success) {
      try { sendGAEvent("event", "generate_lead", { form: "property_lead" }); } catch {}
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-gold font-semibold">{cf.success_subtitle}</p>
        <p className="text-sm text-gray-light mt-1">{pd.lead_success_note}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <p className="text-sm font-semibold text-white flex items-center gap-2">
        <MessageSquare size={15} className="text-gold" />
        {pd.lead_title}
      </p>

      <div>
        <label htmlFor={`${uid}-name`} className={label}>
          {cf.name_label} <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-name`}
          className={field}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor={`${uid}-phone`} className={label}>
          {cf.phone_label} <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-phone`}
          className={`${field} ${phoneError ? "border-red-500/70" : ""}`}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={handlePhoneBlur}
          required
          aria-required="true"
          aria-invalid={phoneTouched && phoneError ? true : undefined}
          aria-describedby={phoneTouched && phoneError ? `${uid}-phone-err` : undefined}
        />
        {phoneTouched && phoneError && (
          <p id={`${uid}-phone-err`} role="alert" className="mt-1.5 text-xs text-red-400">{phoneError}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${uid}-city`} className={label}>
          {pd.lead_city_label} <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-city`}
          className={field}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor={`${uid}-notes`} className={label}>
          {pd.lead_notes_label}{" "}
          <span className="text-gray-light text-xs normal-case tracking-normal">{pd.lead_notes_optional}</span>
        </label>
        <textarea
          id={`${uid}-notes`}
          className={`${field} h-20 resize-none`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <ConsentCheckboxes value={consent} onChange={setConsent} />

      {status === "error" && (
        <p role="alert" className="text-xs text-red-400 text-center">{cf.generic_error}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || status === "loading"}
        className="btn-gold w-full py-3 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {status === "loading" ? cf.submit_loading : pd.lead_submit}
      </button>
    </form>
  );
}
