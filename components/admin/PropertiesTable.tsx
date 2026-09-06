"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Star, Eye, ArrowUp, ArrowDown, ArrowUpDown, Handshake } from "lucide-react";
import StatusSelect from "@/components/admin/StatusSelect";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";
import type { Property, PropertyStatus } from "@/lib/types";

const typeLabel: Record<string, string> = { sale: "מכירה", rent: "השכרה", project: "פרויקט" };
const typeBg: Record<string, string> = {
  sale: "bg-emerald-500/10 text-emerald-400",
  rent: "bg-blue-500/10 text-blue-400",
  project: "bg-purple-500/10 text-purple-400",
};

const statusOrder: Record<PropertyStatus, number> = { available: 0, sold: 1, rented: 2 };

type SortKey = "price" | "status";
type SortDir = "asc" | "desc";

interface Props {
  properties: Property[];
  /** property id → "collaboration with X" label. Present only for collab listings. */
  collabLabels?: Record<string, string>;
  deleteProperty: (formData: FormData) => Promise<void>;
  toggleFeatured: (formData: FormData) => Promise<void>;
  updateStatus: (formData: FormData) => Promise<void>;
}

export default function PropertiesTable({
  properties,
  collabLabels = {},
  deleteProperty,
  toggleFeatured,
  updateStatus,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "price" ? "desc" : "asc");
    }
  }

  const visible = useMemo(() => {
    let result = properties.filter((p) => statusFilter === "all" || p.status === statusFilter);

    if (sortKey === "price") {
      result = [...result].sort((a, b) => (sortDir === "asc" ? a.price - b.price : b.price - a.price));
    } else if (sortKey === "status") {
      result = [...result].sort((a, b) => {
        const diff = statusOrder[a.status] - statusOrder[b.status];
        return sortDir === "asc" ? diff : -diff;
      });
    }

    return result;
  }, [properties, statusFilter, sortKey, sortDir]);

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return <ArrowUpDown size={11} className="opacity-40" />;
    return sortDir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />;
  }

  const selectClass =
    "px-3 py-1.5 rounded text-xs bg-black border border-gray-dark text-gray-light hover:border-gold focus:border-gold focus:outline-none transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-light">
          מציג {visible.length} מתוך {properties.length} נכסים
        </p>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | "all")}
          className={selectClass}
          aria-label="סינון לפי סטטוס"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="available">זמין</option>
          <option value="sold">נמכר</option>
          <option value="rented">הושכר</option>
        </select>
      </div>

      <div className="bg-charcoal border border-gray-dark rounded-xl overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1fr_100px_80px_90px_80px_auto] gap-4 px-5 py-3 border-b border-gray-dark text-[10px] text-gray-light uppercase tracking-wider">
          <span>נכס</span>
          <button
            onClick={() => toggleSort("price")}
            className="flex items-center gap-1 hover:text-gold transition-colors"
          >
            מחיר <SortIcon column="price" />
          </button>
          <span>סוג</span>
          <button
            onClick={() => toggleSort("status")}
            className="flex items-center gap-1 hover:text-gold transition-colors"
          >
            סטטוס <SortIcon column="status" />
          </button>
          <span>מוצג</span>
          <span>פעולות</span>
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-16 text-gray-light text-sm">אין נכסים בסטטוס הזה</div>
        ) : (
          visible.map((p, i) => (
            <div
              key={p.id}
              className={`grid md:grid-cols-[1fr_100px_80px_90px_80px_auto] gap-4 px-5 py-4 items-center hover:bg-black/20 transition-colors ${
                i < visible.length - 1 ? "border-b border-gray-dark" : ""
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
                {collabLabels[p.id] && (
                  <p className="text-[11px] text-gold/80 mt-1 flex items-center gap-1 truncate">
                    <Handshake size={11} className="shrink-0" />
                    שת״פ · {collabLabels[p.id]}
                  </p>
                )}
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
          ))
        )}
      </div>
    </div>
  );
}
