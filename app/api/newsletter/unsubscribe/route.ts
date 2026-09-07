import { NextResponse } from "next/server";
import { unsubscribe } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

const BASE = "https://idanlanadlan.co.il";

function tokenFrom(request: Request): string {
  return new URL(request.url).searchParams.get("token") ?? "";
}

// RFC 8058 one-click unsubscribe (mail clients POST here).
export async function POST(request: Request) {
  await unsubscribe(tokenFrom(request));
  return new NextResponse(null, { status: 200 });
}

// Footer link / mail-client button — unsubscribe, then a friendly page.
export async function GET(request: Request) {
  const ok = await unsubscribe(tokenFrom(request));
  return NextResponse.redirect(`${BASE}/newsletter?unsub=${ok ? "1" : "0"}`);
}
