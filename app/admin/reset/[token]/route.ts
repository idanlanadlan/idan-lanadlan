import { NextRequest, NextResponse } from "next/server";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
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
    return NextResponse.redirect(
      new URL("/admin/forgot-password?expired=1", request.url)
    );
  }

  const password = process.env.ADMIN_PASSWORD ?? "";
  const sessionToken = await generateSessionToken(password);

  await upsertSettings({ reset_token: "", reset_token_expiry: "" });

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
