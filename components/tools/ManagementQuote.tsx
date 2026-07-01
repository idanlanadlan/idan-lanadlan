"use client";

import { useState } from "react";

const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";
const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";

const PROPERTY_TYPES = [
  { id: "standard", label: "דירת יוקרה סטנדרטית", multiplier: 1, note: "מותאם לניהול שוטף של דירה יחידה בבניין יוקרה." },
  { id: "bauhaus", label: "באוהאוס לשימור", multiplier: 1.25, note: "כולל תשומת לב מיוחדת לדרישות השימור ותחזוקת החזית ההיסטורית." },
  { id: "penthouse", label: "פנטהאוז", multiplier: 1.3, note: "כולל תיאום מרפסות גג, בריכות פרטיות ומערכות טכניות מורכבות." },
  { id: "villa", label: "וילה", multiplier: 1.15, note: "כולל תחזוקת גינון, בריכה ומערכות אבטחה היקפיות." },
] as const;

const SERVICE_LEVELS = [
  { id: "basic", label: "בסיסי", low: 8, high: 12, note: "ניקיון שטחים משותפים, תחזוקה שוטפת ופיקוח בסיסי." },
  { id: "premium", label: "פרימיום", low: 15, high: 22, note: "ניהול מלא כולל תיאום ספקים, בקרת תחזוקה יזומה וזמינות טלפונית מורחבת." },
  { id: "concierge", label: "קונסיירז׳ מלא", low: 25, high: 35, note: "שירות אישי 24/7, תיאום אירוח ואורחים, ניהול צוות עוזרי בית ובקרת נכס מרחוק." },
] as const;

export default function ManagementQuote() {
  const [propertyType, setPropertyType] = useState<(typeof PROPERTY_TYPES)[number]>(PROPERTY_TYPES[0]);
  const [sqm, setSqm] = useState("");
  const [level, setLevel] = useState<(typeof SERVICE_LEVELS)[number]>(SERVICE_LEVELS[1]);

  const sqmNum = Number(sqm) || 0;
  const feeLow = sqmNum * level.low * propertyType.multiplier;
  const feeHigh = sqmNum * level.high * propertyType.multiplier;

  return (
    <div className="space-y-6">
      <div>
        <label className={label}>סוג הנכס</label>
        <select
          className={field}
          value={propertyType.id}
          onChange={(e) => setPropertyType(PROPERTY_TYPES.find((p) => p.id === e.target.value)!)}
        >
          {PROPERTY_TYPES.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={label}>שטח הנכס (מ״ר)</label>
        <input className={field} inputMode="numeric" value={sqm} onChange={(e) => setSqm(e.target.value)} placeholder="150" />
      </div>

      <div>
        <label className={label}>רמת שירות</label>
        <div className="grid grid-cols-3 gap-3">
          {SERVICE_LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l)}
              className={`py-2.5 rounded-lg text-sm border transition-colors ${
                level.id === l.id
                  ? "bg-gold text-black border-gold font-semibold"
                  : "bg-black/40 border-gray-dark text-gray-light hover:border-gold/40"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {sqmNum > 0 && (
        <div className="border-t border-gray-dark pt-6 space-y-4">
          <div className="text-center">
            <p className="text-xs tracking-widest text-gold uppercase mb-2">דמי ניהול חודשיים משוערים</p>
            <p className="font-display text-3xl sm:text-4xl font-light text-white">
              ₪{Math.round(feeLow).toLocaleString("he-IL")} – ₪{Math.round(feeHigh).toLocaleString("he-IL")}
            </p>
          </div>
          <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-sm text-gray-light leading-relaxed">
            <p className="text-gold mb-1.5">הצעת הערך שלכם:</p>
            <p>{level.note} {propertyType.note}</p>
          </div>
          <a
            href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%94%D7%A6%D7%A2%D7%94%20%D7%9E%D7%A1%D7%95%D7%93%D7%A8%D7%AA%20%D7%9C%D7%A0%D7%99%D7%94%D7%95%D7%9C%20%D7%A4%D7%A8%D7%99%D7%9E%D7%99%D7%95%D7%9D"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center"
          >
            לקבלת הצעה מסודרת
          </a>
        </div>
      )}
    </div>
  );
}
