import Link from "@/components/LocaleLink";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  disclaimer?: string;
  children: ReactNode;
}

export default function ToolShell({ title, description, disclaimer, children }: Props) {
  return (
    <main id="main-content" className="min-h-screen pt-28 pb-20" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/toolbox"
          className="flex items-center gap-1.5 text-xs text-gray-light hover:text-gold transition-colors mb-6"
        >
          <ArrowRight size={12} className="rtl-flip" />
          חזרה לארגז הכלים
        </Link>

        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">ארגז כלים</p>
        <div className="divider-gold mb-4" />
        <h1 className="font-display text-3xl sm:text-4xl font-light text-white mb-3">{title}</h1>
        <p className="text-gray-light max-w-xl mb-10">{description}</p>

        <div className="card-luxury rounded-2xl p-6 sm:p-8">{children}</div>

        {disclaimer && (
          <p className="text-xs text-gray-light mt-4 leading-relaxed">⚠ {disclaimer}</p>
        )}

        <p className="text-center text-[10px] tracking-widest text-gray-light/60 uppercase mt-10">
          Powered by Idan Nadlan
        </p>
      </div>
    </main>
  );
}
