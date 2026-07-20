import Link from "next/link";
import { Plus, Pencil, Star, Eye, EyeOff, Download, Building2 } from "lucide-react";
import { getProperties } from "@/lib/db";
import { deleteProperty, toggleFeatured, updateStatus } from "@/app/actions/properties";
import StatusSelect from "@/components/admin/StatusSelect";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

const typeLabel: Record<string, string> = { sale: "מכירה", rent: "השכרה", project: "פרויקט" };
const typeBg: Record<string, string> = {
  sale: "bg-emerald-500/10 text-emerald-400",
  rent: "bg-blue-500/10 text-blue-400",
  project: "bg-purple-500/10 text-purple-400",
};

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
        <div className="bg-charcoal border border-gray-dark rounded-xl overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[1fr_100px_80px_90px_80px_auto] gap-4 px-5 py-3 border-b border-gray-dark text-[10px] text-gray-light uppercase tracking-wider">
            <span>נכס</span>
            <span>מחיר</span>
            <span>סוג</span>
            <span>סטטוס</span>
            <span>מוצג</span>
            <span>פעולות</span>
          </div>

          {properties.map((p, i) => (
            <div
              key={p.id}
              className={`grid md:grid-cols-[1fr_100px_80px_90px_80px_auto] gap-4 px-5 py-4 items-center hover:bg-black/20 transition-colors ${
                i < properties.length - 1 ? "border-b border-gray-dark" : ""
              }`}
            >
              {/* Title + location */}
              <div className="min-w-0">
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="text-sm text-white hover:text-gold transition-colors truncate block"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-gray-light mt-0.5 truncate">
                  {p.neighborhood}, {p.city} · {p.bedrooms} חד׳ · {p.size_sqm} מ״ר
                </p>
              </div>

              {/* Price */}
              <p className="text-sm text-gold font-medium">
                ₪{p.price.toLocaleString("he-IL")}
              </p>

              {/* Type */}
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${typeBg[p.type]}`}>
                {typeLabel[p.type]}
              </span>

              {/* Status */}
              <StatusSelect id={p.id} status={p.status} action={updateStatus} />

              {/* Featured toggle */}
              <form action={toggleFeatured}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="featured" value={String(!p.featured)} />
                <button
                  type="submit"
                  title={p.featured ? "הסר מהבית" : "הצג בבית"}
                  className={`transition-colors ${p.featured ? "text-gold" : "text-gray-dark hover:text-gray-light"}`}
                >
                  <Star size={16} fill={p.featured ? "currentColor" : "none"} />
                </button>
              </form>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/nadlan/${p.id}`}
                  target="_blank"
                  className="p-1.5 text-gray-light hover:text-gold transition-colors"
                  title="צפה בנכס"
                >
                  <Eye size={15} />
                </Link>
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="p-1.5 text-gray-light hover:text-gold transition-colors"
                  title="עריכה"
                >
                  <Pencil size={15} />
                </Link>
                <ConfirmDeleteForm
                  id={p.id}
                  confirmMessage={`למחוק את "${p.title}"?`}
                  action={deleteProperty}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
