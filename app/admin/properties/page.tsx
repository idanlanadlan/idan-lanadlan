import Link from "next/link";
import { Plus, Download, Building2 } from "lucide-react";
import { getProperties } from "@/lib/db";
import { deleteProperty, toggleFeatured, updateStatus } from "@/app/actions/properties";
import PropertiesTable from "@/components/admin/PropertiesTable";

export const dynamic = "force-dynamic";

export default async function PropertiesAdmin() {
  const properties = await getProperties();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">ניהול</p>
          <h1 className="font-display text-3xl font-light text-white">נכסים</h1>
          <p className="text-xs text-gray-light mt-1">{properties.length} נכסים בסך הכל</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties/import"
            className="flex items-center gap-2 bg-charcoal border border-gold/30 text-gold px-4 py-2.5 rounded-lg text-sm font-semibold hover:border-gold transition-colors"
          >
            <Download size={15} />
            ייבוא מ-CRM
          </Link>
          <Link
            href="/admin/properties/new?type=project"
            className="flex items-center gap-2 bg-charcoal border border-gold/30 text-gold px-4 py-2.5 rounded-lg text-sm font-semibold hover:border-gold transition-colors"
          >
            <Building2 size={15} />
            פרויקט חדש
          </Link>
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 bg-gold text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors"
          >
            <Plus size={16} />
            נכס חדש
          </Link>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 text-gray-light">
          <p className="text-lg mb-2">אין נכסים עדיין</p>
          <Link href="/admin/properties/new" className="text-gold hover:underline text-sm">
            הוסף נכס ראשון
          </Link>
        </div>
      ) : (
        <PropertiesTable
          properties={properties}
          deleteProperty={deleteProperty}
          toggleFeatured={toggleFeatured}
          updateStatus={updateStatus}
        />
      )}
    </div>
  );
}
