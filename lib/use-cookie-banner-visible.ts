"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the cookie consent banner is currently showing. The banner
 * spans the full width at the bottom of the screen (z-[100]) and can cover
 * the accessibility/advisor trigger buttons that also live in that corner
 * until the visitor answers it — this lets those triggers step aside while
 * it's up instead of being unclickable behind it.
 */
export function useCookieBannerVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem("cookie-consent"));
    const onDismissed = () => setVisible(false);
    window.addEventListener("cookiebanner:dismissed", onDismissed);
    return () => window.removeEventListener("cookiebanner:dismissed", onDismissed);
  }, []);

  return visible;
}
