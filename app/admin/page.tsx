import Link from "next/link";
import { Plus, Home, Eye, Star, TrendingUp, FileText, Settings } from "lucide-react";
import { getProperties, getAllBlogPosts } from "@/lib/db";
import { isConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [properties, posts] = await Promise.all([getProperties(), getAllBlogPosts()]);

  const stats = {
    total: properties.length,
    available: properties.filter((p) => p.status === "available").length,
    featured: properties.filter((p) => p.featured).length,
    sold: properties.filter((p) => p.status === "sold").length,
    rented: properties.filter((p) => p.status === "rented").length,
  };

  const recent = properties.slice(0, 5);

  const typeLabel: Record<string, string> = {
    sale: "מכירה",
    rent: "השכרה",
    project: "פרויקט",
  };
  const statusColor: Record<string, string> = {
    available: "text-emerald-400",
    sold: "text-red-400",
    rented: "text-blue-400",
  };
  const statusLabel: Record<string, string> = {
    available: "זמין",
    sold: "נמכר",
    rented: "הושכר",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {!isConfigured && (
        <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
          <p className="text-amber-400 text-sm font-semibold mb-1">⚠️ Supabase לא מחובר — מוצגים נתוני Demo</p>
          <p className="text-amber-300/70 text-xs">
            כדי לנהל נכסים אמיתיים:{" "}
            <Link href="/admin/setup" className="underline hover:text-amber-300">
              ראה הוראות הגדרה
            </Link>
          </p>
        </div>
      )}

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.4em] text-gold/80 uppercase mb-1">ניהול</p>
        <h1 className="font-display text-3xl font-light text-white">דשבורד</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Home, label: "סה״כ נכסים", value: stats.total, color: "text-gold" },
          { icon: Eye, label: "זמינים", value: stats.available, color: "text-emerald-400" },
          { icon: Star, label: "מוצגים בבית", value: stats.featured, color: "text-blue-400" },
          { icon: TrendingUp, label: "נמכרו/הושכרו", value: stats.sold + stats.rented, color: "text-gray-light" },
          { icon: FileText, label: "מאמרים", value: posts.length, color: "text-purple-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-charcoal border border-gray-dark rounded-xl p-5">
            <Icon size={20} className={`${color} mb-3`} />
            <p className="text-2xl font-semibold text-white">{value}</p>
            <p className="text-xs text-gray-light mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <Link
          href="/admin/properties/new"
          className="bg-gold text-black rounded-xl p-6 flex items-center gap-4 hover:bg-gold/90 transition-colors group"
        >
          <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <p className="font-semibold">הוסף נכס חדש</p>
            <p className="text-xs text-black/60 mt-0.5">פרסם נכס לאתר מיד</p>
          </div>
        </Link>

        <Link
          href="/admin/properties"
          className="bg-charcoal border border-gray-dark rounded-xl p-6 flex items-center gap-4 hover:border-gold/50 transition-colors"
        >
          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <Home size={20} className="text-gold" />
          </div>
          <div>
            <p className="font-semibold text-white">נהל נכסים</p>
            <p className="text-xs text-gray-light mt-0.5">עריכה, מחיקה, עדכון סטטוס</p>
          </div>
        </Link>

        <Link
          href="/admin/blog"
          className="bg-charcoal border border-gray-dark rounded-xl p-6 flex items-center gap-4 hover:border-gold/50 transition-colors"
        >
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-purple-400" />
          </div>
          <div>
            <p className="font-semibold text-white">נהל בלוג</p>
            <p className="text-xs text-gray-light mt-0.5">כתוב, ערוך ופרסם מאמרים</p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-charcoal border border-gray-dark rounded-xl p-6 flex items-center gap-4 hover:border-gold/50 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Settings size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-white">הגדרות אתר</p>
            <p className="text-xs text-gray-light mt-0.5">טלפון, מייל, רשתות, תוכן</p>
          </div>
        </Link>
      </div>

      {/* Recent properties */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">נכסים אחרונים</h2>
            <Link href="/admin/properties" className="text-xs text-gold hover:underline">
              הצג הכל
            </Link>
          </div>
          <div className="bg-charcoal border border-gray-dark rounded-xl overflow-hidden">
            {recent.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-black/20 transition-colors ${
                  i < recent.length - 1 ? "border-b border-gray-dark" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{p.title}</p>
                  <p className="text-xs text-gray-light mt-0.5">
                    {p.neighborhood}, {p.city} · {typeLabel[p.type]}
                  </p>
                </div>
                <p className="text-sm text-gold font-medium hidden sm:block">
                  ₪{p.price.toLocaleString("he-IL")}
                </p>
                <span className={`text-xs font-medium ${statusColor[p.status]} hidden sm:block`}>
                  {statusLabel[p.status]}
                </span>
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="text-xs text-gray-light hover:text-gold transition-colors"
                >
                  עריכה
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
