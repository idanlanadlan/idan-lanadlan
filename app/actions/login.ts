"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function generateToken(password: string): Promise<string> {
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

export async function login(formData: FormData) {
  const entered = formData.get("password") as string;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || entered !== expected) {
    redirect("/admin/login?error=1");
  }

  const token = await generateToken(expected);
  const jar = await cookies();
  jar.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/admin");
}
