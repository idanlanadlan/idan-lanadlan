import "server-only";
import { cookies } from "next/headers";
import { verifyAdminToken } from "./admin-auth";

/**
 * Every mutating Server Action / Route Handler must call this first.
 * proxy.ts only gates *page navigation* under /admin — a direct POST to a
 * Server Action's endpoint (or to an API route outside /admin, like
 * /api/upload-images) never passes through it, so each one has to check
 * for itself. See Next.js's own guidance: "A page-level authentication
 * check does not extend to the Server Actions defined within it."
 */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get("admin_session")?.value);
}
