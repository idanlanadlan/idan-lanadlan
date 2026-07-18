"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PersonStanding, X, ALargeSmall, Contrast, PauseCircle, Link2, RotateCcw } from "lucide-react";
import LocaleLink from "@/components/LocaleLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCookieBannerVisible } from "@/lib/use-cookie-banner-visible";

interface A11yPrefs {
  font: 0 | 1 | 2;
  contrast: boolean;
  motion: boolean;
  links: boolean;
}

const DEFAULTS: A11yPrefs = { font: 0, contrast: false, motion: false, links: false };
const STORAGE_KEY = "a11y-prefs";

function readPrefs(): A11yPrefs {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      font: raw.font === 1 || raw.font === 2 ? raw.font : 0,
      contrast: !!raw.contrast,
      motion: !!raw.motion,
      links: !!raw.links,
    };
  } catch {
    return DEFAULTS;
  }
}

/** Reflect prefs onto <html> — the same attributes the pre-paint inline
 *  script in the layout sets, so there is never a flash or a mismatch. */
function applyPrefs(p: A11yPrefs) {
  const d = document.documentElement;
  if (p.font === 1 || p.font === 2) d.setAttribute("data-a11y-font", String(p.font));
  else d.removeAttribute("data-a11y-font");
  if (p.contrast) d.setAttribute("data-a11y-contrast", "high");
  else d.removeAttribute("data-a11y-contrast");
  if (p.motion) d.setAttribute("data-a11y-motion", "stop");
  else d.removeAttribute("data-a11y-motion");
  if (p.links) d.setAttribute("data-a11y-links", "on");
  else d.removeAttribute("data-a11y-links");
}

export default function AccessibilityWidget() {
  const uid = useId();
  const { t } = useLanguage();
  const w = t.a11y_widget;
  const cookieBannerVisible = useCookieBannerVisible();
  const [open, setOpen] = useState(false);
  // Initial render must not depend on localStorage (hydration); the real
  // values load in the effect below. The <html> attributes themselves are
  // already correct thanks to the inline script.
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULTS);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefs(readPrefs());
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  function update(next: A11yPrefs) {
    setPrefs(next);
    applyPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const fontSteps = w.font_step.split("|");

  const itemBase =
    "w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-sm text-right transition-colors border";
  const itemOff = "border-transparent text-cream hover:bg-gold/10";
  const itemOn = "border-gold/40 bg-gold/15 text-gold font-semibold";

  return (
    <>
      {/* Trigger — bottom corner opposite the Advisor/WhatsApp buttons */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={w.open_aria}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`fixed bottom-6 right-3 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${cookieBannerVisible ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{
          background: "linear-gradient(135deg, rgba(201,169,110,0.55), rgba(160,120,64,0.55))",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow: "0 4px 28px rgba(201, 169, 110, 0.45)",
        }}
      >
        <PersonStanding
          size={24}
          className="text-black"
          style={{ filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.35))" }}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby={`${uid}-title`}
          className="dark-panel fixed bottom-20 sm:bottom-22 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] max-w-[300px] rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "#111", border: "1px solid rgba(201,169,110,0.3)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(201,169,110,0.15)" }}
          >
            <h2 id={`${uid}-title`} className="text-sm font-semibold text-cream">
              {w.title}
            </h2>
            <button
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label={w.close_aria}
              className="p-1.5 text-gray-light hover:text-cream rounded transition-colors"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="p-2.5 flex flex-col gap-1">
            <button
              onClick={() => update({ ...prefs, font: ((prefs.font + 1) % 3) as A11yPrefs["font"] })}
              aria-pressed={prefs.font > 0}
              className={`${itemBase} ${prefs.font > 0 ? itemOn : itemOff}`}
            >
              <span className="flex items-center gap-2.5">
                <ALargeSmall size={17} aria-hidden="true" />
                {w.font_size}
              </span>
              <span className="text-xs opacity-80">{fontSteps[prefs.font] ?? fontSteps[0]}</span>
            </button>

            <button
              onClick={() => update({ ...prefs, contrast: !prefs.contrast })}
              aria-pressed={prefs.contrast}
              className={`${itemBase} ${prefs.contrast ? itemOn : itemOff}`}
            >
              <span className="flex items-center gap-2.5">
                <Contrast size={17} aria-hidden="true" />
                {w.contrast}
              </span>
            </button>

            <button
              onClick={() => update({ ...prefs, motion: !prefs.motion })}
              aria-pressed={prefs.motion}
              className={`${itemBase} ${prefs.motion ? itemOn : itemOff}`}
            >
              <span className="flex items-center gap-2.5">
                <PauseCircle size={17} aria-hidden="true" />
                {w.motion}
              </span>
            </button>

            <button
              onClick={() => update({ ...prefs, links: !prefs.links })}
              aria-pressed={prefs.links}
              className={`${itemBase} ${prefs.links ? itemOn : itemOff}`}
            >
              <span className="flex items-center gap-2.5">
                <Link2 size={17} aria-hidden="true" />
                {w.links}
              </span>
            </button>

            <button
              onClick={() => update(DEFAULTS)}
              className={`${itemBase} ${itemOff} text-gray-light`}
            >
              <span className="flex items-center gap-2.5">
                <RotateCcw size={15} aria-hidden="true" />
                {w.reset}
              </span>
            </button>
          </div>

          <div
            className="px-4 py-2.5 text-center"
            style={{ borderTop: "1px solid rgba(201,169,110,0.15)" }}
          >
            <LocaleLink
              href="/accessibility"
              className="text-[11px] text-gold hover:underline"
              onClick={() => setOpen(false)}
            >
              {w.statement_link}
            </LocaleLink>
          </div>
        </div>
      )}
    </>
  );
}
