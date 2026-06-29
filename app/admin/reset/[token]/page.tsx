"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSettings, upsertSettings } from "@/lib/db";

async function generateSessionToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("idan-admin-v1"));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export default async function ResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const settings = await getSettings();

  const storedToken = settings.reset_token;
  const expiryStr = settings.reset_token_expiry;

  const isValid =
    storedToken &&
    storedToken === token &&
    expiryStr &&
    new Date(expiryStr) > new Date();

  if (!isValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4" dir="rtl">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⛔</span>
          </div>
          <h1 className="font-display text-3xl font-light text-white mb-3">
            קישור לא תקף
          </h1>
          <p className="text-sm text-gray-light mb-8">
            הקישור פג תוקף או כבר נוצל. ניתן לבקש קישור חדש.
          </p>
          <a href="/admin/forgot-password" className="btn-gold px-8 py-3 rounded-lg text-sm font-semibold">
            בקש קישור חדש
          </a>
        </div>
      </div>
    );
  }

  // Token is valid — create session and clear token
  const password = process.env.ADMIN_PASSWORD ?? "";
  const sessionToken = await generateSessionToken(password);

  await upsertSettings({ reset_token: "", reset_token_expiry: "" });

  const jar = await cookies();
  jar.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/admin");
}
