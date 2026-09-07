"use client";

import { useId, useState } from "react";
import { BellRing } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import { sendPropertyAlert } from "@/app/actions/property-leads";
import { isValidPhone } from "@/lib/validation";
import ConsentCheckboxes, { type ConsentValue } from "@/components/ConsentCheckboxes";
import { useLanguage } from "@/contexts/LanguageContext";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-widest uppercase mb-2";

interface Props {
  /** "section" = standalone panel with heading; "compact" = inside the empty-results state */
  variant?: "section" | "compact";
}

export default function PropertyAlertForm({ variant = "section" }: Props) {
  const uid = useId();
  const { t } = useLanguage();
  const cf = t.contact_form;
  const pp = t.properties_page;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [consent, setConsent] = useState<ConsentValue>({ privacy: false, marketing: false });

  const phoneValid = isValidPhone(phone);
  const canSubmit = name.trim() && phoneValid && consent.privacy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneTouched(true);
    if (!phoneValid) {
      setPhoneError(cf.phone_error);
      return;
    }
    if (!name.trim() || !consent.privacy) return;

    setStatus("loading");
    const result = await sendPropertyAlert({
      name: name.trim(),
      phone: phone.trim(),
      lookingFor: lookingFor.trim(),
      privacyConsent: consent.privacy,
      marketingConsent: consent.marketing,
    });
    if (result.success) {
      setStatus("success");
      try { sendGAEvent("event", "generate_lead", { form: "property_alert" }); } catch {}
    } else {
      setStatus("error");
    }
  }

  const wrap =
    variant === "section"
      ? "bg-charcoal border border-gray-dark rounded-2xl p-6 sm:p-8"
      : "bg-charcoal/60 border border-gray-dark rounded-2xl p-6";

  if (status === "success") {
    return (
      <div className={`${wrap} text-center`}>
        <div className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-gold font-semibold">{cf.success_subtitle}</p>
        <p className="text-sm text-gray-light mt-1">{pp.alert_success_note}</p>
      </div>
    );
  }

  return (
    <div className={wrap}>
      {variant === "section" ? (
        <>
          <p className="text-lg font-semibold text-white flex items-center gap-2">
            <BellRing size={18} className="text-gold" />
            {pp.alert_title}
          </p>
          <p className="text-sm text-gray-light mt-2 mb-5 max-w-xl">{pp.alert_subtitle}</p>
        </>
      ) : (
        <p className="text-sm text-gray-light mb-5">{pp.empty_cta}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-3.5">
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
              onBlur={() => {
                setPhoneTouched(true);
                setPhoneError(phone.trim() && !isValidPhone(phone) ? cf.phone_error : "");
              }}
              required
              aria-required="true"
              aria-invalid={phoneTouched && phoneError ? true : undefined}
              aria-describedby={phoneTouched && phoneError ? `${uid}-phone-err` : undefined}
            />
            {phoneTouched && phoneError && (
              <p id={`${uid}-phone-err`} role="alert" className="mt-1.5 text-xs text-red-400">{phoneError}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor={`${uid}-looking`} className={label}>{pp.alert_looking_label}</label>
          <input
            id={`${uid}-looking`}
            className={field}
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            placeholder={pp.alert_looking_placeholder}
          />
        </div>

        <ConsentCheckboxes value={consent} onChange={setConsent} />

        {status === "error" && (
          <p role="alert" className="text-xs text-red-400">{cf.generic_error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || status === "loading"}
          className="btn-gold px-6 py-3 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {status === "loading" ? cf.submit_loading : pp.alert_submit}
        </button>
      </form>
    </div>
  );
}
