"use client";

import { useState } from "react";
import { TrendingUp, Key, Search, Building2, ArrowRight } from "lucide-react";
import { sendContactForm } from "@/app/actions/contact";

const CATEGORIES = [
  { label: "מעוניין למכור נכס", Icon: TrendingUp },
  { label: "מעוניין להשכיר נכס", Icon: Key },
  { label: "מחפש נכס לרכישה", Icon: Search },
  { label: "מחפש דירה להשכרה", Icon: Building2 },
];

function isValidPhone(raw: string): boolean {
  // Strip spaces, dashes, dots, parens — but keep the leading +
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (!cleaned) return false;
  // Israeli mobile (05X): exactly 10 digits
  if (/^05\d{8}$/.test(cleaned)) return true;
  // Israeli VOIP (07X): exactly 10 digits
  if (/^07\d{8}$/.test(cleaned)) return true;
  // Israeli landline (02/03/04/08/09): exactly 9 digits — explicitly excludes 05/06/07
  if (/^0[23489]\d{7}$/.test(cleaned)) return true;
  // International: + followed by 7-15 digits
  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) return true;
  return false;
}

export function ContactForm() {
  const [step, setStep] = useState<"category" | "details">("category");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function selectCategory(label: string) {
    setCategory(label);
    setStep("details");
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    if (phoneTouched) {
      setPhoneError(value.trim() && !isValidPhone(value) ? "מספר טלפון לא תקין" : "");
    }
  }

  function handlePhoneBlur() {
    setPhoneTouched(true);
    setPhoneError(phone.trim() && !isValidPhone(phone) ? "מספר טלפון לא תקין" : "");
  }

  const phoneValid = isValidPhone(phone);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phoneValid) {
      setPhoneTouched(true);
      if (!phoneValid) setPhoneError("מספר טלפון לא תקין");
      return;
    }
    setStatus("loading");
    const result = await sendContactForm({ category, name: name.trim(), phone: phone.trim() });
    setStatus(result.success ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="text-center py-12" dir="rtl">
        <div className="w-20 h-20 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h3 className="font-display text-3xl font-light text-white mb-2">
          העידן שלך לנדל״ן
        </h3>
        <p className="text-gold text-lg">פנייתך התקבלה</p>
        <p className="text-sm text-gray-light mt-3">עידן יחזור אליך בהקדם</p>
      </div>
    );
  }

  if (step === "category") {
    return (
      <div className="space-y-4" dir="rtl">
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">במה אוכל לעזור?</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ label, Icon }) => (
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
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
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
          <ArrowRight size={12} />
          שנה
        </button>
      </div>

      <div>
        <label className="block text-xs text-gold tracking-widest uppercase mb-2">שם מלא</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="w-full bg-charcoal border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-gold tracking-widest uppercase mb-2">טלפון</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={handlePhoneBlur}
          required
          className={`w-full bg-charcoal border rounded-lg px-4 py-3 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors ${
            phoneError ? "border-red-500/70" : "border-gray-dark"
          }`}
        />
        {phoneError && (
          <p className="mt-1.5 text-xs text-red-400">{phoneError}</p>
        )}
        <p className="mt-1.5 text-xs text-gray-light">ישראלי (05X-XXXXXXX) או בינלאומי (+XX...)</p>
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400 text-center">
          שגיאה בשליחה. נסה שוב או פנה אלינו ישירות.
        </p>
      )}

      <button
        type="submit"
        disabled={!name.trim() || !phoneValid || status === "loading"}
        className="btn-gold w-full py-3.5 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {status === "loading" ? "שולח..." : "שלח פנייה →"}
      </button>
    </form>
  );
}
