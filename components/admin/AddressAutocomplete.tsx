"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MapPin, Check, X } from "lucide-react";
import { govmapAutocomplete, type AddressSuggestion } from "@/lib/govmap/autocomplete";
import { neighborhoodByPoint } from "@/lib/govmap/neighborhood";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";

interface Props {
  defaultValue?: string;
  defaultLat?: number | null;
  defaultLng?: number | null;
  /** Called with the auto-detected neighborhood name when picking a suggestion resolves one via GovMap. */
  onNeighborhoodDetected?: (neighborhood: string) => void;
}

/**
 * Address input with official GovMap suggestions. Picking a suggestion pins
 * the property on the map (fills hidden lat/lng inputs) and tries to
 * auto-detect the neighborhood at that point. Free typing still works — the
 * property just saves without coordinates/auto-detected neighborhood.
 */
export default function AddressAutocomplete({ defaultValue, defaultLat, defaultLng, onNeighborhoodDetected }: Props) {
  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const [value, setValue] = useState(defaultValue ?? "");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    defaultLat && defaultLng ? { lat: defaultLat, lng: defaultLng } : null
  );
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

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
    if (value.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = await govmapAutocomplete(value);
      setSuggestions(results);
      setOpen(results.length > 0);
      setHighlighted(-1);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const pick = (s: AddressSuggestion) => {
    skipNextFetch.current = true;
    setValue(s.text);
    setCoords({ lat: s.lat, lng: s.lng });
    setSuggestions([]);
    setOpen(false);

    if (onNeighborhoodDetected) {
      neighborhoodByPoint(s.lat, s.lng).then((name) => {
        if (name) onNeighborhoodDetected(name);
      });
    }
  };

  const onChange = (v: string) => {
    setValue(v);
    // Manual edits invalidate the picked location — stale pins are worse than none.
    if (coords) setCoords(null);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      pick(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input
        className={field}
        name="address"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder="התחל להקליד כתובת — הצעות מ-GovMap"
        autoComplete="off"
        aria-label="כתובת הנכס"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && highlighted >= 0 ? `${listboxId}-opt-${highlighted}` : undefined}
      />
      <input type="hidden" name="lat" value={coords?.lat ?? ""} />
      <input type="hidden" name="lng" value={coords?.lng ?? ""} />

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
              onClick={() => pick(s)}
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

      <p className="mt-1.5 text-[11px] flex items-center gap-1">
        {coords ? (
          <>
            <Check size={12} className="text-gold" />
            <span className="text-gold">ממוקם במפה ({coords.lat.toFixed(5)}, {coords.lng.toFixed(5)})</span>
          </>
        ) : (
          <>
            <X size={12} className="text-gray" />
            <span className="text-gray-light">
              ללא מיקום במפה — בחר כתובת מההצעות כדי שהנכס יופיע במפת הנכסים
            </span>
          </>
        )}
      </p>
    </div>
  );
}
