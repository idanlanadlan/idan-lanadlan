"use client";

import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  id: string;
  confirmMessage: string;
  action: (formData: FormData) => Promise<void>;
  className?: string;
  children?: ReactNode;
}

export default function ConfirmDeleteForm({
  id,
  confirmMessage,
  action,
  className = "p-1.5 text-gray-light hover:text-red-400 transition-colors",
  children = <Trash2 size={15} />,
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className} title="מחיקה">
        {children}
      </button>
    </form>
  );
}
