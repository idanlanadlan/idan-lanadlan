"use client";

const statusBg: Record<string, string> = {
  available: "bg-emerald-500/10 text-emerald-400",
  sold: "bg-red-500/10 text-red-400",
  rented: "bg-blue-500/10 text-blue-400",
};

interface Props {
  id: string;
  status: string;
  action: (formData: FormData) => Promise<void>;
}

export default function StatusSelect({ id, status, action }: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className={`text-[10px] px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer bg-transparent ${statusBg[status]}`}
      >
        <option value="available">זמין</option>
        <option value="sold">נמכר</option>
        <option value="rented">הושכר</option>
      </select>
    </form>
  );
}
