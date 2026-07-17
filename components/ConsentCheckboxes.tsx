"use client";

import { useId } from "react";
import LocaleLink from "@/components/LocaleLink";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ConsentValue {
  privacy: boolean;
  marketing: boolean;
}

interface Props {
  value: ConsentValue;
  onChange: (v: ConsentValue) => void;
}

/**
 * The two consent rows every lead form must show (privacy amendment 13 +
 * anti-spam amendment 40): a required privacy-policy acknowledgment and an
 * optional, unchecked-by-default marketing opt-in. Native checkboxes keep
 * full keyboard/screen-reader support for free.
 */
export default function ConsentCheckboxes({ value, onChange }: Props) {
  const uid = useId();
  const { t } = useLanguage();
  const c = t.consent;

  const row = "flex items-start gap-2.5 cursor-pointer";
  const box = "h-4 w-4 shrink-0 mt-0.5 accent-gold cursor-pointer";
  const text = "text-xs text-gray-light leading-relaxed";

  return (
    <div className="space-y-2.5">
      <div className={row}>
        <input
          id={`${uid}-privacy`}
          type="checkbox"
          required
          aria-required="true"
          checked={value.privacy}
          onChange={(e) => onChange({ ...value, privacy: e.target.checked })}
          className={box}
        />
        <label htmlFor={`${uid}-privacy`} className={`${text} cursor-pointer`}>
          {c.privacy_prefix}{" "}
          <LocaleLink
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline underline-offset-2 hover:opacity-80"
          >
            {c.privacy_link}
          </LocaleLink>
          {c.privacy_suffix} <span className="text-red-400" aria-hidden="true">*</span>
        </label>
      </div>

      <div className={row}>
        <input
          id={`${uid}-marketing`}
          type="checkbox"
          checked={value.marketing}
          onChange={(e) => onChange({ ...value, marketing: e.target.checked })}
          className={box}
        />
        <label htmlFor={`${uid}-marketing`} className={`${text} cursor-pointer`}>
          {c.marketing_label}
        </label>
      </div>
    </div>
  );
}
