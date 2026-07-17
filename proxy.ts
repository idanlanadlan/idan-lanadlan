import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyToken(token: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("idan-admin-v1"));
    const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
    return token === expected;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (
      !pathname.startsWith("/admin/login") &&
      !pathname.startsWith("/admin/forgot-password") &&
      !pathname.startsWith("/admin/reset")
    ) {
      const token = request.cookies.get("admin_session")?.value;
      if (!token || !(await verifyToken(token))) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return NextResponse.next();
  }

  // Locale routing: Hebrew is served prefix-free (rewritten internally to /he),
  // while /en, /fr and /es are real URL prefixes handled by the app/[locale] segment.
  if (pathname === "/he" || pathname.startsWith("/he/")) {
    // Explicit /he URLs would duplicate the canonical prefix-free Hebrew URLs.
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/he" ? "/" : pathname.slice(3);
    return NextResponse.redirect(url, 308);
  }

  const prefixedLocales = ["en", "fr", "es"];
  if (prefixedLocales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/he" : `/he${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Everything public except API routes, Next internals, and files with an
    // extension (public/ assets, favicon.ico, sitemap.xml, robots.txt...).
    "/((?!api|admin|_next/static|_next/image|.*\\..*).*)",
  ],
};
