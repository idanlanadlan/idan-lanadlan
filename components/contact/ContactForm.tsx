"use client";

import { useId, useState } from "react";
import { TrendingUp, Key, Search, Building2, ArrowRight } from "lucide-react";
import { sendContactForm } from "@/app/actions/contact";
import { isValidPhone, isValidEmail } from "@/lib/validation";
import ConsentCheckboxes, { type ConsentValue } from "@/components/ConsentCheckboxes";
import { useLanguage } from "@/contexts/LanguageContext";

const CATEGORY_ICONS = [TrendingUp, Key, Search, Building2];

export function ContactForm() {
  const uid = useId();
  const { t } = useLanguage();
  const f = t.contact_form;
  const [step, setStep] = useState<"category" | "details">("category");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [consent, setConsent] = useState<ConsentValue>({ privacy: false, marketing: false });

  function selectCategory(label: string) {
    setCategory(label);
    setStep("details");
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    if (phoneTouched) {
      setPhoneError(value.trim() && !isValidPhone(value) ? f.phone_error : "");
    }
  }

  function handlePhoneBlur() {
    setPhoneTouched(true);
    setPhoneError(phone.trim() && !isValidPhone(phone) ? f.phone_error : "");
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailTouched) {
      setEmailError(value.trim() && !isValidEmail(value) ? f.email_error : "");
    }
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailError(email.trim() && !isValidEmail(email) ? f.email_error : "");
  }

  const phoneValid = isValidPhone(phone);
  const emailOk = !email.trim() || isValidEmail(email);
  const canSubmit = name.trim() && city.trim() && phoneValid && emailOk && consent.privacy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneTouched(true);
    setEmailTouched(true);
    if (!phoneValid) { setPhoneError(f.phone_error); return; }
    if (!emailOk) { setEmailError(f.email_error); return; }
    if (!name.trim() || !city.trim() || !consent.privacy) return;

    setStatus("loading");
    const result = await sendContactForm({
      category,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      city: city.trim(),
      privacyConsent: consent.privacy,
      marketingConsent: consent.marketing,
    });

    if (result.success) {
      setStatus("success");
    } else if (result.error === "phone") {
      setPhoneError(f.phone_error_server);
      setStatus("idle");
    } else if (result.error === "email") {
      setEmailError(f.email_error_server);
      setStatus("idle");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h3 className="font-display text-3xl font-light text-white mb-2">
          {f.success_title}
        </h3>
        <p className="text-gold text-lg">{f.success_subtitle}</p>
        <p className="text-sm text-gray-light mt-3">{f.success_note}</p>
      </div>
    );
  }

  if (step === "category") {
    return (
      <div className="space-y-4">
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">{f.help_prompt}</p>
        <div className="grid grid-cols-2 gap-3">
          {f.categories.map((label, i) => {
            const Icon = CATEGORY_ICONS[i];
            return (
              <button
                key={label}
                type="button"
                onClick={() => selectCategory(label)}
                className="p-5 rounded-xl border border-gray-dark bg-black/40 text-gray-light hover:border-gold hover:text-white transition-all duration-200 text-right group"
              >
                <div className="mb-3 text-gray-light group-hover:text-gold transition-colors">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium leading-snug">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Selected category indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gold">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          {category}
        </div>
        <button
          type="button"
          onClick={() => setStep("category")}
          className="flex items-center gap-1 text-xs text-gray-light hover:text-gold transition-colors"
        >
          <ArrowRight size={12} className="rtl-flip" />
          {f.change_button}
        </button>
      </div>

      {/* שם מלא — חובה */}
      <div>
        <label htmlFor={`${uid}-name`} className="block text-xs text-gold tracking-widest uppercase mb-2">
          {f.name_label} <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
          autoFocus
          className="w-full bg-charcoal border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors"
        />
      </div>

      {/* טלפון — חובה */}
      <div>
        <label htmlFor={`${uid}-phone`} className="block text-xs text-gold tracking-widest uppercase mb-2">
          {f.phone_label} <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-phone`}
          type="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={handlePhoneBlur}
          required
          aria-required="true"
          aria-invalid={phoneError ? true : undefined}
          aria-describedby={`${uid}-phone-hint`}
          className={`w-full bg-charcoal border rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors ${
            phoneError ? "border-red-500/70" : "border-gray-dark"
          }`}
        />
        {phoneError ? (
          <p id={`${uid}-phone-hint`} role="alert" className="mt-1.5 text-xs text-red-400">{phoneError}</p>
        ) : (
          <p id={`${uid}-phone-hint`} className="mt-1.5 text-xs text-gray-light">{f.phone_hint}</p>
        )}
      </div>

      {/* עיר — חובה */}
      <div>
        <label htmlFor={`${uid}-city`} className="block text-xs text-gold tracking-widest uppercase mb-2">
          {f.city_label} <span className="text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-city`}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          aria-required="true"
          placeholder={f.city_placeholder}
          className="w-full bg-charcoal border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors"
        />
      </div>

      {/* מייל — לא חובה */}
      <div>
        <label htmlFor={`${uid}-email`} className="block text-xs text-gold tracking-widest uppercase mb-2">
          {f.email_label} <span className="text-gray-light text-xs normal-case tracking-normal">{f.email_optional}</span>
        </label>
        <input
          id={`${uid}-email`}
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={handleEmailBlur}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? `${uid}-email-err` : undefined}
          className={`w-full bg-charcoal border rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors ${
            emailError ? "border-red-500/70" : "border-gray-dark"
          }`}
        />
        {emailError && (
          <p id={`${uid}-email-err`} role="alert" className="mt-1.5 text-xs text-red-400">{emailError}</p>
        )}
      </div>

      <ConsentCheckboxes value={consent} onChange={setConsent} />

      {status === "error" && (
        <p role="alert" className="text-xs text-red-400 text-center">
          {f.generic_error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || status === "loading"}
        className="btn-gold w-full py-3.5 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {status === "loading" ? f.submit_loading : f.submit_button}
      </button>
    </form>
  );
}
