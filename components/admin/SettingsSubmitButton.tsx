"use client";

import { useFormStatus } from "react-dom";

export default function SettingsSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-gold w-full py-3 rounded-lg text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending && <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />}
      {pending ? "שומר... (כולל תרגום אוטומטי לעמוד האודות, עד כדקה)" : "שמור הכל"}
    </button>
  );
}
