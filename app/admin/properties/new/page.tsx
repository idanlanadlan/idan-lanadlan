import Link from "next/link";
import { createPropertyAction } from "@/app/actions/properties";
import PropertyForm from "@/components/admin/PropertyForm";

// Saving now also calls Claude to auto-translate the listing (EN/FR).
export const maxDuration = 30;

export default function NewPropertyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/admin/properties" className="text-xs text-gray-light hover:text-gold transition-colors mb-4 block">
          ← חזור לנכסים
        </Link>
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">נכס חדש</p>
        <h1 className="font-display text-3xl font-light text-white">הוסף נכס</h1>
      </div>

      <PropertyForm action={createPropertyAction} />
    </div>
  );
}
