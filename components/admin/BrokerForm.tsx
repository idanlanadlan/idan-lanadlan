"use client";

import { useFormStatus } from "react-dom";
import type { Broker } from "@/lib/types";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-[11px] text-gray-light mb-1";

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-gold px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "שומר…" : isEdit ? "שמור שינויים" : "הוסף מתווך"}
    </button>
  );
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  broker?: Broker;
}

export default function BrokerForm({ action, broker }: Props) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {broker?.id && <input type="hidden" name="id" value={broker.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>שם המתווך *</label>
          <input className={field} name="name" required defaultValue={broker?.name} placeholder="ישראל ישראלי" />
        </div>
        <div>
          <label className={label}>טלפון</label>
          <input className={field} name="phone" dir="ltr" defaultValue={broker?.phone} placeholder="054-000-0000" />
        </div>
        <div>
          <label className={label}>משרד / סוכנות</label>
          <input className={field} name="agency" defaultValue={broker?.agency} placeholder="רי/מקס, אנגלו סכסון…" />
        </div>
        <div>
          <label className={label}>הערות</label>
          <input className={field} name="notes" defaultValue={broker?.notes} placeholder="אחוז עמלה, איש קשר…" />
        </div>
      </div>
      <div>
        <SubmitButton isEdit={!!broker?.id} />
      </div>
    </form>
  );
}
