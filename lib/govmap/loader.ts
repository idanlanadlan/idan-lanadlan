"use client";

import type { GovMapAPI } from "./types";

const GOVMAP_SRC = "https://www.govmap.gov.il/govmap/api/govmap.api.js";
const JQUERY_SRC = "https://code.jquery.com/jquery-3.7.1.min.js";
const LOAD_TIMEOUT_MS = 10_000;

let loadPromise: Promise<GovMapAPI> | null = null;
let authPromise: Promise<void> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      // Already injected (possibly still loading) — poll until loaded flag set.
      if (existing.getAttribute("data-loaded") === "true") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`failed loading ${src}`)));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.addEventListener("load", () => {
      s.setAttribute("data-loaded", "true");
      resolve();
    });
    s.addEventListener("error", () => reject(new Error(`failed loading ${src}`)));
    document.head.appendChild(s);
  });
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ]);
}

/**
 * Loads the GovMap browser library once (singleton). The library is legacy and
 * expects global jQuery — injected first if absent. Rejects after 10s so no UI
 * ever hangs on a government outage; callers must treat failure as "feature off".
 */
export function loadGovMap(): Promise<GovMapAPI> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("govmap is browser-only"));
  }
  if (window.govmap?.geocode) return Promise.resolve(window.govmap);
  if (!loadPromise) {
    loadPromise = withTimeout(
      (async () => {
        if (!window.jQuery) await injectScript(JQUERY_SRC);
        await injectScript(GOVMAP_SRC);
        if (!window.govmap) throw new Error("govmap global missing after script load");
        return window.govmap;
      })(),
      LOAD_TIMEOUT_MS,
      "govmap load"
    );
    // Allow retry on a later call if this attempt failed.
    loadPromise.catch(() => {
      loadPromise = null;
    });
  }
  return loadPromise;
}

/**
 * Some GovMap functions (searchAndLocate, layer queries) may require createMap
 * to have run with the API token. Initializes an invisible 1px map once.
 * Safe to call multiple times.
 */
export function ensureGovMapAuth(): Promise<void> {
  if (!authPromise) {
    authPromise = (async () => {
      const govmap = await loadGovMap();
      const token = process.env.NEXT_PUBLIC_GOVMAP_API_TOKEN;
      if (!token) throw new Error("NEXT_PUBLIC_GOVMAP_API_TOKEN is not set");
      const id = "govmap-hidden-auth";
      if (!document.getElementById(id)) {
        const div = document.createElement("div");
        div.id = id;
        div.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;";
        document.body.appendChild(div);
        govmap.createMap(id, {
          token,
          showXY: false,
          identifyOnClick: false,
          isEmbeddedToggle: false,
          background: 0,
        });
        // createMap has no reliable ready promise across versions — give it a beat.
        await new Promise((r) => setTimeout(r, 1500));
      }
    })();
    authPromise.catch(() => {
      authPromise = null;
    });
  }
  return authPromise;
}
