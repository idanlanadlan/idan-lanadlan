import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { David_Libre, Cormorant_Garamond, Frank_Ruhl_Libre } from "next/font/google";
import "../globals.css";
import { Home, Plus, List, LogOut, BarChart2, FileText, Settings, Database } from "lucide-react";
import { logout } from "@/app/actions/logout";

const davidLibre = David_Libre({
  variable: "--font-david-libre",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frankruhl",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "ניהול — עידן לנדל\"ן",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${davidLibre.variable} ${cormorant.variable} ${frankRuhl.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-black text-cream antialiased">
        {/* Anti-flash: set theme before first paint (same behavior as the public site).
            Must live in <body>, not <head> — beforeInteractive scripts are always
            hoisted into <head> by Next.js regardless of placement. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
        <AdminChrome>{children}</AdminChrome>
      </body>
    </html>
  );
}

function AdminChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-cream" dir="rtl">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-charcoal border-b border-gray-dark h-14 flex items-center px-4 gap-4">
        <Link href="/admin" className="font-display text-gold text-lg font-light">
          עידן לנדל״ן
        </Link>
        <span className="text-[10px] tracking-[0.3em] text-gray uppercase">ניהול</span>

        <div className="flex items-center gap-1 mr-auto">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-gray-light hover:text-gold px-3 py-1.5 rounded transition-colors"
          >
            <BarChart2 size={14} />
            דשבורד
          </Link>
          <Link
            href="/admin/properties"
            className="flex items-center gap-1.5 text-xs text-gray-light hover:text-gold px-3 py-1.5 rounded transition-colors"
          >
            <Home size={14} />
            נכסים
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-1.5 text-xs text-gray-light hover:text-gold px-3 py-1.5 rounded transition-colors"
          >
            <FileText size={14} />
            בלוג
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-1.5 text-xs text-gray-light hover:text-gold px-3 py-1.5 rounded transition-colors"
          >
            <Settings size={14} />
            הגדרות
          </Link>
          <Link
            href="/admin/setup"
            className="flex items-center gap-1.5 text-xs text-gray-light hover:text-gold px-3 py-1.5 rounded transition-colors"
          >
            <Database size={14} />
            חיבור DB
          </Link>
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-1.5 text-xs bg-gold text-black px-3 py-1.5 rounded font-semibold hover:bg-gold/90 transition-colors"
          >
            <Plus size={14} />
            נכס חדש
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-light hover:text-gold px-3 py-1.5 rounded transition-colors"
          >
            <Home size={14} />
            אתר
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-gray-light hover:text-red-400 px-3 py-1.5 rounded transition-colors"
            >
              <LogOut size={14} />
              יציאה
            </button>
          </form>
        </div>
      </header>

      <main className="pt-14 min-h-screen">
        {children}
      </main>
    </div>
  );
}
