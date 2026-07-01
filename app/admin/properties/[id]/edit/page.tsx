import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/db";
import { updatePropertyAction, deleteProperty } from "@/app/actions/properties";
import PropertyForm from "@/components/admin/PropertyForm";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let property;
  try {
    property = await getPropertyById(id);
  } catch (err) {
    console.error("[EditPropertyPage] getPropertyById threw:", err);
    throw err;
  }
  if (!property) notFound();

  const updateWithId = updatePropertyAction.bind(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/admin/properties" className="text-xs text-gray-light hover:text-gold transition-colors mb-4 block">
          ← חזור לנכסים
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">עריכת נכס</p>
            <h1 className="font-display text-3xl font-light text-white">עדכן נכס</h1>
            <p className="text-xs text-gray-light mt-1 truncate max-w-md">{property.title}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/nadlan/${property.id}`}
              target="_blank"
              className="text-xs text-gray-light hover:text-gold transition-colors border border-gray-dark rounded-lg px-3 py-1.5"
            >
              צפה באתר ↗
            </Link>
            <ConfirmDeleteForm
              id={property.id}
              confirmMessage={`למחוק את "${property.title}"?`}
              action={deleteProperty}
              className="text-xs text-red-400 hover:text-red-300 transition-colors border border-red-500/30 hover:border-red-400/50 rounded-lg px-3 py-1.5"
            >
              מחק נכס
            </ConfirmDeleteForm>
          </div>
        </div>
      </div>

      <PropertyForm action={updatePropertyAction} property={property} />
    </div>
  );
}
