import Link from "next/link";
import { Pencil } from "lucide-react";
import { getBrokers } from "@/lib/db";
import { createBrokerAction, deleteBrokerAction } from "@/app/actions/brokers";
import BrokerForm from "@/components/admin/BrokerForm";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

export default async function BrokersAdmin() {
  const brokers = await getBrokers();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">ניהול</p>
        <h1 className="font-display text-3xl font-light text-white">מתווכי שיתוף-פעולה</h1>
        <p className="text-xs text-gray-light mt-1">
          פרטי המתווכים נשמרים לשימוש חוזר על נכסים בשת״פ. הם לא מוצגים באתר — רק כאן ובטופס הנכס.
        </p>
      </div>

      <div className="bg-charcoal border border-gray-dark rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-white mb-4">הוספת מתווך</h2>
        <BrokerForm action={createBrokerAction} />
      </div>

      {brokers.length === 0 ? (
        <p className="text-center py-12 text-gray-light text-sm">אין מתווכים שמורים עדיין</p>
      ) : (
        <div className="bg-charcoal border border-gray-dark rounded-xl overflow-hidden">
          {brokers.map((b, i) => (
            <div
              key={b.id}
              className={`flex items-center gap-4 px-5 py-4 ${
                i < brokers.length - 1 ? "border-b border-gray-dark" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">
                  {b.name}
                  {b.agency && <span className="text-gray-light"> — {b.agency}</span>}
                </p>
                <p className="text-xs text-gray-light mt-0.5 truncate">
                  {[b.phone, b.notes].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <Link
                href={`/admin/brokers/${b.id}/edit`}
                className="p-1.5 text-gray-light hover:text-gold transition-colors"
                title="עריכה"
              >
                <Pencil size={15} />
              </Link>
              <ConfirmDeleteForm
                id={b.id}
                confirmMessage={`למחוק את המתווך "${b.name}"? נכסים שמקושרים אליו יעברו ל״מתווך לא צוין״.`}
                action={deleteBrokerAction}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
