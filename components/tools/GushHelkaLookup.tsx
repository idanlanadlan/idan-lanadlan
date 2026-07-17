"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MapPin, Search, Copy, Check, ExternalLink, LoaderCircle } from "lucide-react";
import { govmapAutocomplete, type AddressSuggestion } from "@/lib/govmap/autocomplete";
import { parcelByPoint, findParcel, govmapSiteLink, type ParcelInfo } from "@/lib/govmap/parcel";
import LeadCaptureForm from "./LeadCaptureForm";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-widest uppercase mb-2";

type Mode = "address" | "parcel";
type Status = "idle" | "loading" | "done" | "notfound";

export default function GushHelkaLookup() {
  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const [mode, setMode] = useState<Mode>("address");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ParcelInfo | null>(null);
  const [sourceAddress, setSourceAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // address mode
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

  // parcel mode
  const [gush, setGush] = useState("");
  const [helka, setHelka] = useState("");

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (address.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = await govmapAutocomplete(address);
      setSuggestions(results);
      setOpen(results.length > 0);
      setHighlighted(-1);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [address]);

  function switchMode(next: Mode) {
    setMode(next);
    setStatus("idle");
    setResult(null);
    setSourceAddress(null);
    setCopied(false);
    setOpen(false);
  }

  async function lookupByAddress(s: AddressSuggestion) {
    skipNextFetch.current = true;
    setAddress(s.text);
    setSuggestions([]);
    setOpen(false);
    setStatus("loading");
    setCopied(false);
    const parcel = await parcelByPoint(s.lat, s.lng);
    setSourceAddress(s.text);
    setResult(parcel);
    setStatus(parcel ? "done" : "notfound");
  }

  async function lookupByNumbers(e: React.FormEvent) {
    e.preventDefault();
    const g = parseInt(gush, 10);
    const h = parseInt(helka, 10);
    if (!Number.isFinite(g) || !Number.isFinite(h) || g <= 0 || h <= 0) return;
    setStatus("loading");
    setCopied(false);
    setSourceAddress(null);
    const parcel = await findParcel(g, h);
    setResult(parcel);
    setStatus(parcel ? "done" : "notfound");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      lookupByAddress(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const parcelLabel = result
    ? `גוש ${result.gush}${result.gushSuffix ? `/${result.gushSuffix}` : ""} חלקה ${result.helka}`
    : "";

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(parcelLabel);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no fallback needed */
    }
  }

  const leadDetails = result
    ? `כלי גוש/חלקה — ${sourceAddress ? `כתובת שחופשה: ${sourceAddress}` : `חיפוש לפי מספרים`}\nתוצאה: ${parcelLabel}${result.legalAreaSqm ? `, שטח רשום ${result.legalAreaSqm.toLocaleString("he-IL")} מ"ר` : ""}`
    : undefined;

  return (
    <div className="space-y-8">
      {/* mode switch */}
      <div className="grid grid-cols-2 gap-2 bg-black/40 border border-gray-dark rounded-lg p-1">
        {(
          [
            ["address", "כתובת ← גוש/חלקה"],
            ["parcel", "גוש/חלקה ← מיקום"],
          ] as [Mode, string][]
        ).map(([m, text]) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            aria-pressed={mode === m}
            className={`py-2.5 rounded-md text-sm transition-colors ${
              mode === m ? "bg-gold/15 text-gold font-semibold" : "text-gray-light hover:text-cream"
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {mode === "address" ? (
        <div ref={rootRef} className="relative">
          <label htmlFor={`${uid}-address`} className={label}>כתובת הנכס</label>
          <input
            id={`${uid}-address`}
            className={field}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="התחילו להקליד כתובת ובחרו מההצעות…"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={open && highlighted >= 0 ? `${listboxId}-opt-${highlighted}` : undefined}
          />
          {open && (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="הצעות כתובת"
              className="absolute z-30 mt-1 w-full bg-charcoal border border-gray-dark rounded-lg shadow-xl overflow-hidden"
            >
              {suggestions.map((s, i) => (
                <li
                  key={`${s.text}-${i}`}
                  id={`${listboxId}-opt-${i}`}
                  role="option"
                  aria-selected={i === highlighted}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => lookupByAddress(s)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`cursor-pointer text-right px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                    i === highlighted ? "bg-gold/15 text-gold" : "text-cream hover:bg-gold/10"
                  }`}
                >
                  <MapPin size={13} className="text-gold/70 shrink-0" aria-hidden="true" />
                  {s.text}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-gray-light">
            בחירת כתובת מההצעות מאתרת את החלקה הרשומה שהכתובת יושבת עליה.
          </p>
        </div>
      ) : (
        <form onSubmit={lookupByNumbers} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${uid}-gush`} className={label}>מספר גוש</label>
              <input
                id={`${uid}-gush`}
                className={field}
                inputMode="numeric"
                value={gush}
                onChange={(e) => setGush(e.target.value.replace(/\D/g, ""))}
                placeholder="6638"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor={`${uid}-helka`} className={label}>מספר חלקה</label>
              <input
                id={`${uid}-helka`}
                className={field}
                inputMode="numeric"
                value={helka}
                onChange={(e) => setHelka(e.target.value.replace(/\D/g, ""))}
                placeholder="96"
                required
                aria-required="true"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!gush || !helka || status === "loading"}
            className="btn-gold w-full py-3.5 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            <Search size={15} />
            אתרו את החלקה
          </button>
        </form>
      )}

      {/* Always mounted so state changes are announced to screen readers */}
      <div role="status" aria-live="polite">
        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-light">
            <LoaderCircle size={16} className="animate-spin text-gold" aria-hidden="true" />
            מאתר מול נתוני המרכז למיפוי ישראל…
          </div>
        )}

        {status === "notfound" && (
          <div className="bg-black/40 border border-gray-dark rounded-lg p-5 text-sm text-gray-light text-center">
            לא נמצאה חלקה רשומה עבור החיפוש הזה. בדקו את הפרטים ונסו שוב, או השאירו פרטים ונבדוק עבורכם.
          </div>
        )}

        {status === "done" && result && (
          <p className="sr-only">נמצאה תוצאה: {parcelLabel}</p>
        )}
      </div>

      {status === "done" && result && (
        <div className="space-y-4 pt-2">
          <div className="text-center">
            <p className="text-xs tracking-widest text-gold uppercase mb-2">
              {sourceAddress ? sourceAddress : "מיקום החלקה אותר"}
            </p>
            <p className="font-display text-3xl sm:text-4xl font-light text-white">{parcelLabel}</p>
          </div>

          <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-sm space-y-1.5">
            {result.legalAreaSqm !== null && (
              <div className="flex justify-between">
                <span className="text-gray-light">שטח רשום</span>
                <span className="text-cream">{result.legalAreaSqm.toLocaleString("he-IL")} מ"ר</span>
              </div>
            )}
            {result.status && (
              <div className="flex justify-between">
                <span className="text-gray-light">סטטוס רישום</span>
                <span className="text-cream">{result.status}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-light">נ"צ מרכז החלקה</span>
              <span className="text-cream" dir="ltr">
                {result.lat.toFixed(5)}, {result.lng.toFixed(5)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={copyResult}
              className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm border border-gray-dark text-cream hover:border-gold hover:text-gold transition-colors"
            >
              {copied ? <Check size={15} className="text-gold" /> : <Copy size={15} />}
              {copied ? "הועתק" : "העתקת גוש/חלקה"}
            </button>
            <a
              href={govmapSiteLink(result.lat, result.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm border border-gray-dark text-cream hover:border-gold hover:text-gold transition-colors"
            >
              <ExternalLink size={15} />
              צפייה במפה הרשמית
            </a>
          </div>
        </div>
      )}

      {(status === "done" || status === "notfound") && (
        <div className="pt-6 border-t border-gray-dark">
          <LeadCaptureForm
            toolName="איתור גוש וחלקה"
            details={leadDetails}
            ctaLabel="רוצים לדעת מה שווה הנכס או מה ניתן לבנות בחלקה? השאירו פרטים"
          />
        </div>
      )}
    </div>
  );
}
