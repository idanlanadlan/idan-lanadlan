import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (
      !pathname.startsWith("/admin/login") &&
      !pathname.startsWith("/admin/forgot-password") &&
      !pathname.startsWith("/admin/reset")
    ) {
      const token = request.cookies.get("admin_session")?.value;
      if (!(await verifyAdminToken(token))) {
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
