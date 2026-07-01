"use client";

import { useState } from "react";
import { sendToolLead } from "@/app/actions/tool-leads";
import { isValidPhone, isValidEmail } from "@/lib/validation";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-widest uppercase mb-2";

interface Props {
  toolName: string;
  details?: string;
  ctaLabel?: string;
  submitLabel?: string;
}

export default function LeadCaptureForm({
  toolName,
  details,
  ctaLabel = "השאירו פרטים ונחזור אליכם",
  submitLabel = "שלח →",
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const phoneValid = isValidPhone(phone);
  const emailOk = !email.trim() || isValidEmail(email);
  const canSubmit = name.trim() && phoneValid && emailOk;

  function handlePhoneBlur() {
    setPhoneTouched(true);
    setPhoneError(phone.trim() && !isValidPhone(phone) ? "מספר טלפון לא תקין" : "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneTouched(true);
    if (!phoneValid) {
      setPhoneError("מספר טלפון לא תקין");
      return;
    }
    if (!name.trim()) return;

    setStatus("loading");
    const result = await sendToolLead({
      toolName,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      details,
    });

    setStatus(result.success ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <p className="text-gold text-lg font-semibold">הפרטים התקבלו</p>
        <p className="text-sm text-gray-light mt-2">עידן יחזור אליך בהקדם</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-semibold text-white mb-1">{ctaLabel}</p>

      <div>
        <label className={label}>
          שם מלא <span className="text-red-400">*</span>
        </label>
        <input
          className={field}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className={label}>
          טלפון <span className="text-red-400">*</span>
        </label>
        <input
          className={`${field} ${phoneError ? "border-red-500/70" : ""}`}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={handlePhoneBlur}
          required
        />
        {phoneTouched && phoneError && <p className="mt-1.5 text-xs text-red-400">{phoneError}</p>}
      </div>

      <div>
        <label className={label}>
          מייל <span className="text-gray-light text-xs normal-case tracking-normal">(אופציונלי)</span>
        </label>
        <input
          className={field}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400 text-center">שגיאה בשליחה. נסה שוב או פנה ב-WhatsApp.</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || status === "loading"}
        className="btn-gold w-full py-3.5 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {status === "loading" ? "שולח..." : submitLabel}
      </button>
    </form>
  );
}
