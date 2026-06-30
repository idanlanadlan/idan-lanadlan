"use client";

import { useState } from "react";
import { TrendingUp, Key, Search, Building2 } from "lucide-react";
import { sendContactForm } from "@/app/actions/contact";

const CATEGORIES = [
  { label: "מעוניין למכור נכס", Icon: TrendingUp },
  { label: "מעוניין להשכיר נכס", Icon: Key },
  { label: "מחפש נכס לרכישה", Icon: Search },
  { label: "מחפש דירה להשכרה", Icon: Building2 },
];

export function ContactForm() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !name.trim() || !phone.trim()) return;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">במה אוכל לעזור?</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setCategory(label)}
              className={`p-5 rounded-xl border text-right transition-all duration-200 ${
                category === label
                  ? "border-gold bg-gold/10 text-white"
                  : "border-gray-dark bg-black/40 text-gray-light hover:border-gold/40 hover:text-cream"
              }`}
            >
              <div className={`mb-3 ${category === label ? "text-gold" : "text-gray-light"}`}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium leading-snug">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gold tracking-widest uppercase mb-2">שם מלא</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="ישראל ישראלי"
          className="w-full bg-charcoal border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-gold tracking-widest uppercase mb-2">טלפון</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="050-000-0000"
          className="w-full bg-charcoal border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400 text-center">
          שגיאה בשליחה. נסה שוב או פנה אלינו ישירות.
        </p>
      )}

      <button
        type="submit"
        disabled={!category || !name.trim() || !phone.trim() || status === "loading"}
        className="btn-gold w-full py-3.5 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {status === "loading" ? "שולח..." : "שלח פנייה →"}
      </button>
    </form>
  );
}
