import { NextRequest, NextResponse } from "next/server";
import { getSettings, upsertSettings } from "@/lib/db";
import { generateAdminToken, ADMIN_SESSION_MAX_AGE } from "@/lib/admin-auth";

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

  const sessionToken = await generateAdminToken();
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });

  // Clear token only after session is ready
  await upsertSettings({ reset_token: "", reset_token_expiry: "" });

  return response;
}
