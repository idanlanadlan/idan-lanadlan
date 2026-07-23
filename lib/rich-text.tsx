import type { ReactNode } from "react";

/** Renders `**bold**` markdown spans as <strong>; everything else stays plain text. */
export function renderRich(text: string, boldClassName = "text-gold"): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className={boldClassName}>
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
}
