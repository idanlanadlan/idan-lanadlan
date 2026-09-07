"use client";

import { useId, useState } from "react";
import { BellRing } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import LocaleLink from "@/components/LocaleLink";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { isValidEmail } from "@/lib/validation";
import { useLanguage } from "@/contexts/LanguageContext";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-widest uppercase mb-2";

interface Props {
  /** "section" = heading + pitch; "compact" = footer / empty-state; "page" = landing page */
  variant?: "section" | "compact" | "page";
}

export default function NewsletterSignup({ variant = "section" }: Props) {
  const uid = useId();
  const { t } = useLanguage();
  const n = t.newsletter;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "pending" | "already" | "error">("idle");

  const canSubmit = name.trim() && isValidEmail(email) && consent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    const res = await subscribeToNewsletter({ email: email.trim(), name: name.trim(), consent, hp });
    if (res.ok && res.state === "pending") {
      setStatus("pending");
      try { sendGAEvent("event", "sign_up", { method: "newsletter" }); } catch {}
    } else if (res.state === "already") {
      setStatus("already");
    } else {
      setStatus("error");
    }
  }

  const wrap =
    variant === "section"
      ? "bg-charcoal border border-gray-dark rounded-2xl p-6 sm:p-8"
      : variant === "page"
        ? "bg-charcoal border border-gray-dark rounded-2xl p-6 sm:p-10"
        : "bg-charcoal/60 border border-gray-dark rounded-2xl p-6";

  if (status === "pending" || status === "already") {
    return (
      <div className={`${wrap} text-center`}>
        <div className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-gold font-semibold">{n.success_title}</p>
        <p className="text-sm text-gray-light mt-1 max-w-md mx-auto">
          {status === "already" ? n.already : n.success_note}
        </p>
      </div>
    );
  }

  return (
    <div className={wrap}>
      {variant !== "compact" && (
        <>
          <p className="text-lg font-semibold text-white flex items-center gap-2">
            <BellRing size={18} className="text-gold" />
            {n.title}
          </p>
          <p className="text-sm text-gray-light mt-2 mb-5 max-w-xl">{n.subtitle}</p>
        </>
      )}
      {variant === "compact" && (
        <p className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <BellRing size={16} className="text-gold" />
          {n.title}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 max-w-xl">
        <div className={variant === "compact" ? "space-y-3.5" : "grid sm:grid-cols-2 gap-3.5"}>
          <div>
            <label htmlFor={`${uid}-name`} className={label}>
              {n.name_label} <span className="text-red-400" aria-hidden="true">*</span>
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
            <label htmlFor={`${uid}-email`} className={label}>
              {n.email_label} <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <input
              id={`${uid}-email`}
              className={field}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
        </div>

        {/* Honeypot — hidden from real users, bots fill it and get silently dropped */}
        <div hidden aria-hidden="true">
          <label>
            Company
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </label>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            required
            aria-required="true"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="h-4 w-4 shrink-0 mt-0.5 accent-gold cursor-pointer"
          />
          <span className="text-xs text-gray-light leading-relaxed">
            {n.consent_prefix}
            <LocaleLink href="/privacy" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2 hover:opacity-80">
              {n.consent_link}
            </LocaleLink>
            {n.consent_suffix} <span className="text-red-400" aria-hidden="true">*</span>
          </span>
        </label>

        {status === "error" && (
          <p role="alert" className="text-xs text-red-400">{n.generic_error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || status === "loading"}
          className="btn-gold px-6 py-3 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {status === "loading" ? n.sending : n.submit}
        </button>
      </form>
    </div>
  );
}
