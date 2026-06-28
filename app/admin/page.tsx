"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Plus, Home, FileText, Star } from "lucide-react";

const EMPTY = {
  title: "",
  price: "",
  type: "sale",
  bedrooms: "",
  bathrooms: "",
  size_sqm: "",
  floor: "",
  address: "",
  neighborhood: "",
  city: "רמת השרון",
  description: "",
  images: "",
  status: "available",
  featured: true,
};

export default function AdminPage() {
  const [form, setForm] = useState(EMPTY);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState("");
  const [showForm, setShowForm] = useState(false);

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function generate() {
    const images = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const obj = {
      id: Date.now().toString(),
      title: form.title,
      price: Number(form.price),
      type: form.type,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      size_sqm: Number(form.size_sqm),
      ...(form.floor !== "" && { floor: Number(form.floor) }),
      address: form.address,
      neighborhood: form.neighborhood,
      city: form.city,
      description: form.description,
      images: images.length ? images : [""],
      status: form.status,
      featured: form.featured,
      created_at: new Date().toISOString(),
    };

    setGenerated(JSON.stringify(obj, null, 2));
  }

  async function copy() {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const field =
    "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors";
  const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

  return (
    <div className="min-h-screen bg-black text-cream" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">ניהול</p>
          <h1 className="font-display text-4xl font-light text-white">דשבורד</h1>
          <p className="text-gray-light text-sm mt-2">עידן לנדל״ן — ניהול תוכן</p>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => { setShowForm(true); window.scrollTo({ top: 300, behavior: "smooth" }); }}
            className="bg-charcoal border border-gray-dark hover:border-gold rounded-xl p-6 transition-colors group text-right"
          >
            <Plus size={24} className="text-gold mb-3" />
            <p className="font-semibold text-white group-hover:text-gold transition-colors">נכס חדש</p>
            <p className="text-xs text-gray-light mt-1">הוסף נכס לאתר</p>
          </button>

          <Link
            href="/blog"
            className="bg-charcoal border border-gray-dark hover:border-gold rounded-xl p-6 transition-colors group"
          >
            <FileText size={24} className="text-gold mb-3" />
            <p className="font-semibold text-white group-hover:text-gold transition-colors">בלוג</p>
            <p className="text-xs text-gray-light mt-1">צפה במאמרים</p>
          </Link>

          <Link
            href="/nadlan"
            className="bg-charcoal border border-gray-dark hover:border-gold rounded-xl p-6 transition-colors group"
          >
            <Home size={24} className="text-gold mb-3" />
            <p className="font-semibold text-white group-hover:text-gold transition-colors">נכסים</p>
            <p className="text-xs text-gray-light mt-1">צפה בכל הנכסים</p>
          </Link>
        </div>

        {/* New property form */}
        {showForm && (
          <div className="flex flex-col gap-6 bg-charcoal border border-gray-dark rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">פרטי הנכס</h2>
              <button onClick={() => setShowForm(false)} className="text-xs text-gray-light hover:text-gold transition-colors">סגור ✕</button>
            </div>

            <div>
              <label className={label}>כותרת הנכס</label>
              <input className={field} placeholder="פנטהאוז יוקרה עם נוף פנורמי" value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>מחיר (₪)</label>
                <input className={field} type="number" placeholder="4500000" value={form.price} onChange={(e) => set("price", e.target.value)} />
              </div>
              <div>
                <label className={label}>סוג עסקה</label>
                <select className={field} value={form.type} onChange={(e) => set("type", e.target.value)}>
                  <option value="sale">למכירה</option>
                  <option value="rent">להשכרה</option>
                  <option value="project">פרויקט</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className={label}>חדרים</label>
                <input className={field} type="number" placeholder="4" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
              </div>
              <div>
                <label className={label}>מקלחות</label>
                <input className={field} type="number" placeholder="2" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
              </div>
              <div>
                <label className={label}>מ״ר</label>
                <input className={field} type="number" placeholder="120" value={form.size_sqm} onChange={(e) => set("size_sqm", e.target.value)} />
              </div>
              <div>
                <label className={label}>קומה</label>
                <input className={field} type="number" placeholder="5" value={form.floor} onChange={(e) => set("floor", e.target.value)} />
              </div>
            </div>

            <div>
              <label className={label}>כתובת</label>
              <input className={field} placeholder="רחוב הרצל 12" value={form.address} onChange={(e) => set("address", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>שכונה</label>
                <input className={field} placeholder="מרכז העיר" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
              </div>
              <div>
                <label className={label}>עיר</label>
                <input className={field} placeholder="רמת השרון" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
            </div>

            <div>
              <label className={label}>תיאור הנכס</label>
              <textarea
                className={`${field} h-28 resize-none`}
                placeholder="תיאור מפורט של הנכס — מה מיוחד בו, גימור, נוף, וכו׳"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div>
              <label className={label}>קישורי תמונות (שורה אחת לכל תמונה)</label>
              <textarea
                className={`${field} h-24 resize-none`}
                placeholder={"https://...\nhttps://..."}
                value={form.images}
                onChange={(e) => set("images", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>סטטוס</label>
                <select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option value="available">זמין</option>
                  <option value="sold">נמכר</option>
                  <option value="rented">הושכר</option>
                </select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-sm text-cream">הצג בעמוד הבית</span>
                </label>
              </div>
            </div>

            <button
              onClick={generate}
              className="btn-gold w-full py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Plus size={16} />
              צור JSON לנכס
            </button>
          </div>
        )}

        {/* Generated output */}
        {generated && (
          <div className="bg-charcoal border border-gold/30 rounded-2xl p-6 mb-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-white font-semibold">נכס מוכן להוספה</p>
                <p className="text-xs text-gray-light mt-0.5">העתק ושלח לקלוד כדי שיוסיף לאתר</p>
              </div>
              <button
                onClick={copy}
                className="flex items-center gap-2 text-xs text-gray-light hover:text-gold transition-colors border border-gray-dark rounded-lg px-3 py-1.5"
              >
                {copied ? <Check size={13} className="text-gold" /> : <Copy size={13} />}
                {copied ? "הועתק!" : "העתק"}
              </button>
            </div>
            <pre className="text-xs text-cream bg-black rounded-lg p-4 overflow-x-auto leading-relaxed">
              {generated}
            </pre>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-xs text-gray-light hover:text-gold transition-colors">
            ← חזור לאתר
          </Link>
        </div>
      </div>
    </div>
  );
}
