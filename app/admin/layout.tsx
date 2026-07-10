import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Heebo, Cormorant_Garamond, Frank_Ruhl_Libre } from "next/font/google";
import "../globals.css";
import { Home, Plus, List, LogOut, BarChart2, FileText, Settings } from "lucide-react";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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

async function logout() {
  "use server";
  const jar = await cookies();
  jar.delete("admin_session");
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${cormorant.variable} ${frankRuhl.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: set theme before first paint (same behavior as the public site) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-black text-cream antialiased">
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
