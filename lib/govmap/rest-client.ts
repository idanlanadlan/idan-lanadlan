// Shared helpers for GovMap's undocumented layers-catalog/search-service REST
// endpoints (no token, CORS-open, but the API rejects requests without the
// fingerprint headers the SPA sends — accepts any well-formed random hex).
// One fingerprint per page load, like the GovMap SPA itself, shared across
// every REST call in this module tree (parcel, neighborhood, ...).

function randomHex32(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

const fingerprint = randomHex32();

function govmapHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-fingerprint-id": fingerprint,
    "x-user-id": fingerprint,
    "x-trace-id": randomHex32(),
  };
}

export async function govmapPostJson(url: string, body: unknown, timeoutMs = 8000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: govmapHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export const ENTITIES_BY_POINT_URL = "https://www.govmap.gov.il/api/layers-catalog/entitiesByPoint";
export const AUTOCOMPLETE_URL = "https://www.govmap.gov.il/api/search-service/autocomplete";
