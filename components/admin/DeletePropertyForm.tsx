"use client";

import { Trash2 } from "lucide-react";

interface Props {
  id: string;
  title: string;
  action: (formData: FormData) => Promise<void>;
}

export default function DeletePropertyForm({ id, title, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`למחוק את "${title}"?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="p-1.5 text-gray-light hover:text-red-400 transition-colors"
        title="מחיקה"
      >
        <Trash2 size={15} />
      </button>
    </form>
  );
}
