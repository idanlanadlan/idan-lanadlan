import { NextResponse } from "next/server";
import { confirmSubscription } from "@/lib/newsletter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BASE = "https://idanlanadlan.co.il";

// Double-opt-in confirmation link from the "אישור הרשמה" email.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const ok = await confirmSubscription(token);
  return NextResponse.redirect(`${BASE}/newsletter?confirmed=${ok ? "1" : "0"}`);
}
