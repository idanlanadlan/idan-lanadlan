"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateAdminToken, timingSafeEqualStr, ADMIN_SESSION_MAX_AGE } from "@/lib/admin-auth";
import { getSettings, upsertSettings } from "@/lib/db";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function login(formData: FormData) {
  const entered = (formData.get("password") as string) ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";

  const settings = await getSettings();
  const lockedUntil = settings.login_locked_until ? new Date(settings.login_locked_until) : null;
  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    redirect("/admin/login?error=locked");
  }

  const valid = !!expected && timingSafeEqualStr(entered, expected);

  if (!valid) {
    const failCount = (Number(settings.login_fail_count) || 0) + 1;
    if (failCount >= MAX_ATTEMPTS) {
      await upsertSettings({
        login_fail_count: "0",
        login_locked_until: new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString(),
      });
    } else {
      await upsertSettings({ login_fail_count: String(failCount) });
    }
    redirect("/admin/login?error=1");
  }

  await upsertSettings({ login_fail_count: "0", login_locked_until: "" });

  const token = await generateAdminToken();
  if (!token) redirect("/admin/login?error=1");

  const jar = await cookies();
  jar.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });

  redirect("/admin");
}
