import { NextResponse } from "next/server";
import { sendWeeklyDigest } from "@/lib/newsletter";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Weekly digest of all available properties. Scheduled by vercel.json
// (Thursday morning). Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sent = await sendWeeklyDigest();
  return NextResponse.json({ ok: true, sent });
}
