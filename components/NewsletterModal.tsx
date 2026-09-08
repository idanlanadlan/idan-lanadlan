"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, BellRing } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsletterSignup from "@/components/NewsletterSignup";

/** localStorage record. `never` and `done` are permanent; `snoozed` lifts after SNOOZE_MS. */
const KEY = "nl-modal";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const DWELL_MS = 14_000; // show after this long on the page…
const SCROLL_TRIGGER = 0.45; // …or once this much of the page has scrolled past

type Stored = { state: "never" | "done" | "snoozed"; ts: number };

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function write(state: Stored["state"]) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ state, ts: Date.now() }));
  } catch {
    /* private mode — the modal just reappears next visit, which is acceptable */
  }
}

/** Still allowed to show? (no permanent opt-out, no live snooze) */
function isEligible(): boolean {
  const s = readStored();
  if (!s) return true;
  if (s.state === "never" || s.state === "done") return false;
  return Date.now() - s.ts > SNOOZE_MS;
}

// Pages where a pop-up would be noise: the signup's own page, and the legal /
// accessibility pages (short, and the wrong moment to sell).
const SUPPRESS_ON = ["/newsletter", "/privacy", "/terms", "/accessibility"];

export default function NewsletterModal() {
  const uid = useId();
  const { t } = useLanguage();
  const n = t.newsletter;

  const [open, setOpen] = useState(false);
  const [subscribed, setSubscribed] = useState<null | "pending" | "already">(null);
  const [dismissForever, setDismissForever] = useState(false);
  // Opened by a deliberate click (the /nadlan side tab) rather than the
  // auto-trigger — no "don't show again" prompt, and closing doesn't snooze.
  const [manual, setManual] = useState(false);
  const armed = useRef(false);
  const shownOnce = useRef(false); // the auto-popup fires at most once per visit
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const suppressed = SUPPRESS_ON.some((p) => pathname === p || pathname.endsWith(p));

  // Manual open — dispatched by NewsletterCtaTab. Bypasses eligibility; a
  // person asking for it always gets it.
  useEffect(() => {
    const openNow = () => {
      armed.current = true;
      shownOnce.current = true;
      setManual(true);
      setSubscribed(null);
      setDismissForever(false);
      setOpen(true);
    };
    window.addEventListener("newsletter:open", openNow);
    return () => window.removeEventListener("newsletter:open", openNow);
  }, []);

  // Open on whichever comes first — a dwell timer or a scroll-depth threshold —
  // but only once the cookie banner has been answered (so we never stack two
  // dialogs on a first visit).
  useEffect(() => {
    if (armed.current || suppressed || !isEligible()) return;

    let timer = 0;
    const onScroll = () => {
      const denom = document.body.scrollHeight - window.innerHeight || 1;
      if (window.scrollY / denom > SCROLL_TRIGGER) reveal();
    };
    const reveal = () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      if (shownOnce.current) return; // a manual open already happened
      shownOnce.current = true;
      setOpen(true);
    };
    const arm = () => {
      if (armed.current) return;
      armed.current = true;
      timer = window.setTimeout(reveal, DWELL_MS);
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    let cookieAnswered = false;
    try { cookieAnswered = !!localStorage.getItem("cookie-consent"); } catch {}

    if (cookieAnswered) {
      arm();
    } else {
      window.addEventListener("cookiebanner:dismissed", arm);
    }
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("cookiebanner:dismissed", arm);
    };
    // Re-checks when the visitor moves off a suppressed page mid-session.
  }, [suppressed]);

  const close = useCallback(() => {
    setOpen(false);
    if (subscribed) write("done");
    else if (!manual) write(dismissForever ? "never" : "snoozed");
    setManual(false);
  }, [subscribed, dismissForever, manual]);

  // Dialog behaviour: Esc closes, focus moves to the close button on open.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open, close]);

  // Once the confirmation email is sent, mark done and auto-close after a beat.
  useEffect(() => {
    if (!subscribed) return;
    write("done");
    const timer = window.setTimeout(() => setOpen(false), 4000);
    return () => window.clearTimeout(timer);
  }, [subscribed]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[180] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2 }}
            className="dark-panel relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "#111", border: "1px solid rgba(201,169,110,0.25)", maxHeight: "92vh" }}
          >
            <button
              ref={closeRef}
              onClick={close}
              aria-label={t.nav.close}
              className="absolute end-3 top-3 z-10 p-1.5 text-gray-light hover:text-cream rounded transition-colors"
            >
              <X size={18} />
            </button>

            {!subscribed ? (
              <div className="px-6 py-7 sm:px-8 overflow-y-auto" style={{ maxHeight: "92vh" }}>
                <div className="divider-gold mb-5" />
                <h2
                  id={`${uid}-title`}
                  className="font-display text-2xl sm:text-[1.7rem] font-light text-white leading-snug flex items-start gap-2.5"
                >
                  <BellRing size={20} className="text-gold shrink-0 mt-1.5" aria-hidden="true" />
                  <span>{n.title}</span>
                </h2>
                <p className="text-sm text-gray-light mt-3 mb-6 leading-relaxed">{n.subtitle}</p>

                <NewsletterSignup variant="modal" onSubscribed={setSubscribed} />

                {!manual && (
                  <label className="mt-6 pt-4 border-t border-gray-dark/60 flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dismissForever}
                      onChange={(e) => setDismissForever(e.target.checked)}
                      className="h-4 w-4 shrink-0 accent-gold cursor-pointer"
                    />
                    <span className="text-xs text-gray-light">{n.modal_dismiss}</span>
                  </label>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-10 sm:px-8 flex flex-col items-center gap-4 text-center"
              >
                <div className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gold" aria-hidden="true">✓</span>
                </div>
                <div>
                  <h2 id={`${uid}-title`} className="text-white font-semibold text-lg mb-2">{n.success_title}</h2>
                  <p className="text-sm text-gray-light leading-relaxed max-w-xs">
                    {subscribed === "already" ? n.already : n.success_note}
                  </p>
                </div>
                <button onClick={close} className="text-xs text-gray-light hover:text-cream transition-colors mt-1">
                  {t.nav.close}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
