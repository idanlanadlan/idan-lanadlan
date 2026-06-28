"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();
  const c = t.cookie;

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="הסכמה לעוגיות"
      className="fixed bottom-0 inset-x-0 z-[100] bg-charcoal border-t border-gray-dark/70 px-4 py-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-light text-center sm:text-start">
          {c.message}{" "}
          <Link href="/privacy" className="text-gold hover:underline">
            {c.privacy_link}
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-xs text-gray-light hover:text-cream transition-colors px-4 py-2 border border-gray-dark/60 rounded hover:border-gray-dark"
          >
            {c.decline}
          </button>
          <button
            onClick={accept}
            className="btn-gold px-5 py-2 text-xs rounded"
          >
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
