"use client";

import { useState } from "react";

const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";
const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors";

// Approximate figures — verify current rates with the Israel Tax Authority / an accountant before relying on them
const FX_TO_ILS: Record<string, number> = { ILS: 1, USD: 3.7, EUR: 4.0 };
const CURRENCY_SYMBOL: Record<string, string> = { ILS: "₪", USD: "$", EUR: "€" };
const OLEH_BRACKET_THRESHOLD = 1988090; // ILS
const OLEH_RATE_LOW = 0.005;
const OLEH_RATE_HIGH = 0.05;

const ROADMAP = [
  "קבלת תעודת עולה מרשות האוכלוסין וההגירה",
  "פתיחת חשבון בנק בישראל",
  "אישור זכאות למדרגות מס רכישה לעולים ברשות המסים",
  "ליווי עורך דין מקרקעין לבדיקת הנכס והחוזה",
  "חתימה על חוזה רכישה",
  "תשלום מס הרכישה תוך 60 יום מהחתימה",
  "רישום הזכויות בטאבו על שם הרוכש",
];

export default function OlehTaxSimulator() {
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<"ILS" | "USD" | "EUR">("ILS");

  const priceNum = Number(price.replace(/,/g, "")) || 0;
  const priceInILS = priceNum * FX_TO_ILS[currency];
  const hasInput = priceInILS > 0;

  const lowPortion = Math.min(priceInILS, OLEH_BRACKET_THRESHOLD);
  const highPortion = Math.max(priceInILS - OLEH_BRACKET_THRESHOLD, 0);
  const taxLow = lowPortion * OLEH_RATE_LOW;
  const taxHigh = highPortion * OLEH_RATE_HIGH;
  const totalTax = taxLow + taxHigh;

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-xs text-amber-300 leading-relaxed">
        המדרגות והשערים המוצגים הם אומדן המבוסס על נתונים כלליים ומתעדכנים מדי שנה — יש לאמת מול רשות המסים או רו״ח לפני כל החלטה.
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>מחיר הנכס</label>
          <input className={field} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1,800,000" />
        </div>
        <div>
          <label className={label}>מטבע</label>
          <select
            className={field}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "ILS" | "USD" | "EUR")}
          >
            <option value="ILS">₪ שקל</option>
            <option value="USD">$ דולר</option>
            <option value="EUR">€ יורו</option>
          </select>
        </div>
      </div>

      {hasInput && (
        <div className="border-t border-gray-dark pt-6 space-y-4">
          {currency !== "ILS" && (
            <p className="text-sm text-gray-light text-center">
              מחיר בשקלים (שער משוער {CURRENCY_SYMBOL[currency]}1 = ₪{FX_TO_ILS[currency]}): ₪{Math.round(priceInILS).toLocaleString("he-IL")}
            </p>
          )}

          <div className="text-center">
            <p className="text-xs tracking-widest text-gold uppercase mb-2">סה״כ מס רכישה משוער לעולה חדש</p>
            <p className="font-display text-3xl sm:text-4xl font-light text-white">
              ₪{Math.round(totalTax).toLocaleString("he-IL")}
            </p>
          </div>

          <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-sm text-gray-light space-y-1.5">
            <div className="flex justify-between">
              <span>{OLEH_RATE_LOW * 100}% על ₪{Math.round(lowPortion).toLocaleString("he-IL")}</span>
              <span className="text-cream">₪{Math.round(taxLow).toLocaleString("he-IL")}</span>
            </div>
            {highPortion > 0 && (
              <div className="flex justify-between">
                <span>{OLEH_RATE_HIGH * 100}% על ₪{Math.round(highPortion).toLocaleString("he-IL")}</span>
                <span className="text-cream">₪{Math.round(taxHigh).toLocaleString("he-IL")}</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs tracking-widest text-gold uppercase mb-3">מפת דרכים לרכישה</p>
            <ol className="space-y-2">
              {ROADMAP.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-gray-light">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
