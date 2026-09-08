"use client";

import { useId, useState } from "react";
import { BellRing } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import LocaleLink from "@/components/LocaleLink";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { isValidEmail } from "@/lib/validation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DealInterest } from "@/lib/types";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-widest uppercase mb-2";

function dealFrom(sale: boolean, rent: boolean): DealInterest {
  return sale && rent ? "both" : sale ? "sale" : "rent";
}

interface Props {
  /** "section" = heading + pitch card; "compact" = footer / empty-state;
   *  "page" = landing page; "band" = full-width strip, form beside the pitch;
   *  "modal" = inside the pop-up (no card chrome, calls onSubscribed). */
  variant?: "section" | "compact" | "page" | "band" | "modal";
  /** Called when the signup resolves — "pending" = confirmation email sent,
   *  "already" = address was already on the list. The modal uses this to
   *  swap to its own success panel. */
  onSubscribed?: (state: "pending" | "already") => void;
}

export default function NewsletterSignup({ variant = "section", onSubscribed }: Props) {
  const uid = useId();
  const { t } = useLanguage();
  const n = t.newsletter;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Two independent toggles — pick sale, rent, or both. Default: both on.
  const [wantsSale, setWantsSale] = useState(true);
  const [wantsRent, setWantsRent] = useState(true);
  const [hp, setHp] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "pending" | "already" | "error">("idle");

  const deal = dealFrom(wantsSale, wantsRent);
  const canSubmit = name.trim() && isValidEmail(email) && consent && (wantsSale || wantsRent);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    const res = await subscribeToNewsletter({ email: email.trim(), name: name.trim(), deal, consent, hp });
    if (res.ok && res.state === "pending") {
      setStatus("pending");
      try { sendGAEvent("event", "sign_up", { method: "newsletter" }); } catch {}
      onSubscribed?.("pending");
    } else if (res.state === "already") {
      setStatus("already");
      onSubscribed?.("already");
    } else {
      setStatus("error");
    }
  }

  const isCard = variant === "section" || variant === "page" || variant === "compact";
  const wrap =
    variant === "section"
      ? "bg-charcoal border border-gray-dark rounded-2xl p-6 sm:p-8"
      : variant === "page"
        ? "bg-charcoal border border-gray-dark rounded-2xl p-6 sm:p-10"
        : variant === "compact"
          ? "bg-charcoal/60 border border-gray-dark rounded-2xl p-6"
          : ""; // band / modal have no card chrome of their own

  if (status === "pending" || status === "already") {
    return (
      <div className={`${wrap} text-center`}>
        <div className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl text-gold" aria-hidden="true">✓</span>
        </div>
        <p className="text-gold font-semibold">{n.success_title}</p>
        <p className="text-sm text-gray-light mt-1 max-w-md mx-auto">
          {status === "already" ? n.already : n.success_note}
        </p>
      </div>
    );
  }

  const showPitch = variant === "section" || variant === "page";
  const twoUp = variant === "section" || variant === "page";

  const form = (
    <form onSubmit={handleSubmit} className={`space-y-4 ${variant === "band" ? "w-full" : "max-w-xl"}`}>
      <div className={twoUp ? "grid sm:grid-cols-2 gap-3.5" : "space-y-4"}>
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
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>
      </div>

      {/* Deal-type choice — two toggles, pick one or both */}
      <fieldset>
        <legend className={label}>{n.deal_label}</legend>
        <div className="grid grid-cols-2 gap-2">
          {([
            [n.deal_sale, wantsSale, setWantsSale],
            [n.deal_rent, wantsRent, setWantsRent],
          ] as const).map(([text, on, set]) => (
            <button
              key={text}
              type="button"
              aria-pressed={on}
              onClick={() => set((v) => !v)}
              className={`px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                on
                  ? "bg-gold text-black border-gold"
                  : "bg-black border-gray-dark text-gray-light hover:border-gold/50 hover:text-cream"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Honeypot — hidden from real users, bots fill it and get silently dropped */}
      <div hidden aria-hidden="true">
        <label>
          Company
          <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
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

      {status === "error" && <p role="alert" className="text-xs text-red-400">{n.generic_error}</p>}

      <button
        type="submit"
        disabled={!canSubmit || status === "loading"}
        className="btn-gold px-6 py-3 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity w-full sm:w-auto"
      >
        {status === "loading" ? n.sending : n.submit}
      </button>
    </form>
  );

  // Band: pitch on the start side, form on the end side (stacks on mobile).
  if (variant === "band") {
    return (
      <div className="grid lg:grid-cols-[1fr_minmax(320px,420px)] gap-8 lg:gap-14 items-center">
        <div>
          <div className="divider-gold mb-5" />
          <h2 className="font-display text-3xl sm:text-4xl font-extralight text-white leading-tight flex items-start gap-3">
            <BellRing size={22} className="text-gold shrink-0 mt-1.5" aria-hidden="true" />
            <span>{n.title}</span>
          </h2>
          <p className="text-sm text-gray-light mt-4 leading-[1.9] max-w-md">{n.subtitle}</p>
        </div>
        {form}
      </div>
    );
  }

  if (variant === "modal") return form;

  return (
    <div className={wrap}>
      {showPitch && (
        <>
          <p className="text-lg font-semibold text-white flex items-center gap-2">
            <BellRing size={18} className="text-gold" aria-hidden="true" />
            {n.title}
          </p>
          <p className="text-sm text-gray-light mt-2 mb-5 max-w-xl">{n.subtitle}</p>
        </>
      )}
      {variant === "compact" && (
        <p className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <BellRing size={16} className="text-gold" aria-hidden="true" />
          {n.title}
        </p>
      )}
      {isCard && form}
    </div>
  );
}
