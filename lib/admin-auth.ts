// Edge- and Node-compatible (Web Crypto only, no next/headers) — shared by
// proxy.ts (edge), app/actions/login.ts, app/admin/reset/[token]/route.ts,
// and lib/require-admin.ts. Do not import next/headers here.

const TOKEN_LABEL = "idan-admin-v1";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

async function sign(password: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

/** Constant-time string comparison — avoids leaking match position via early-exit timing. */
export function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Session token = `${expiryEpochSeconds}.${signature}`. Embedding a
 * server-verified expiry means a leaked/replayed cookie value is only good
 * until it expires server-side, not just until the browser drops it —
 * `maxAge` on the cookie alone is a client-side hint an attacker replaying
 * the raw value via curl can ignore.
 */
export async function generateAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const expiry = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const signature = await sign(password, `${TOKEN_LABEL}:${expiry}`);
  return `${expiry}.${signature}`;
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const expiryStr = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry * 1000 < Date.now()) return false;
  try {
    const expected = await sign(password, `${TOKEN_LABEL}:${expiryStr}`);
    return timingSafeEqualStr(signature, expected);
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
