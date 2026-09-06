import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrokerById } from "@/lib/db";
import { updateBrokerAction, deleteBrokerAction } from "@/app/actions/brokers";
import BrokerForm from "@/components/admin/BrokerForm";
import ConfirmDeleteForm from "@/components/admin/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

export default async function EditBrokerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const broker = await getBrokerById(id);
  if (!broker) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/admin/brokers" className="text-xs text-gray-light hover:text-gold transition-colors mb-4 block">
          ← חזור למתווכים
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">עריכת מתווך</p>
            <h1 className="font-display text-3xl font-light text-white">{broker.name}</h1>
          </div>
          <ConfirmDeleteForm
            id={broker.id}
            confirmMessage={`למחוק את המתווך "${broker.name}"? נכסים שמקושרים אליו יעברו ל״מתווך לא צוין״.`}
            action={deleteBrokerAction}
            className="text-xs text-red-400 hover:text-red-300 transition-colors border border-red-500/30 hover:border-red-400/50 rounded-lg px-3 py-1.5"
          >
            מחק מתווך
          </ConfirmDeleteForm>
        </div>
      </div>

      <div className="bg-charcoal border border-gray-dark rounded-xl p-6">
        <BrokerForm action={updateBrokerAction} broker={broker} />
      </div>
    </div>
  );
}
