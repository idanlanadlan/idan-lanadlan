import { getBrokers } from "@/lib/db";
import ImportClient from "./ImportClient";

// Saving from here runs Claude to auto-translate the listing, same as
// /admin/properties/new — give it the same headroom.
export const maxDuration = 30;

export default async function ImportPage() {
  const brokers = await getBrokers();
  return <ImportClient brokers={brokers} />;
}
