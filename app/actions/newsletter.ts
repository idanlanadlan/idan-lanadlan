"use server";

import { redirect } from "next/navigation";
import { isValidEmail } from "@/lib/validation";
import { isAdmin } from "@/lib/require-admin";
import { subscribe, sendWeeklyDigest, type SubscribeResult } from "@/lib/newsletter";
import type { DealInterest } from "@/lib/types";

const DEAL_VALUES: DealInterest[] = ["sale", "rent", "both"];

/**
 * Public — no admin check. Double opt-in: this only records intent and sends a
 * confirmation email; the subscriber isn't on any list until they click it.
 * `hp` is a honeypot field that real users never fill.
 */
export async function subscribeToNewsletter(data: {
  email: string;
  name: string;
  consent: boolean;
  deal?: string;
  hp?: string;
}): Promise<{ ok: boolean; state: SubscribeResult }> {
  if (data.hp) return { ok: true, state: "pending" }; // silently drop bots
  if (!data.name.trim() || data.consent !== true || !isValidEmail(data.email)) {
    return { ok: false, state: "error" };
  }
  const deal = DEAL_VALUES.includes(data.deal as DealInterest) ? (data.deal as DealInterest) : "both";
  const state = await subscribe(data.email, data.name, deal);
  return { ok: state !== "error", state };
}

/** Admin-only manual trigger for the weekly digest (same as the Thursday cron). */
export async function sendWeeklyDigestNow() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const sent = await sendWeeklyDigest();
  redirect(`/admin/subscribers?sent=${sent}`);
}
