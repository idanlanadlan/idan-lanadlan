"use client";

import { useState } from "react";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

function num(v: string): number {
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function RoiCalculator() {
  const [price, setPrice] = useState("");
  const [rent, setRent] = useState("");
  const [fee, setFee] = useState("");
  const [tax, setTax] = useState("");

  const priceNum = num(price);
  const rentNum = num(rent);
  const feeNum = num(fee);
  const taxNum = num(tax);

  const totalInvestment = priceNum + taxNum;
  const annualNet = (rentNum - feeNum) * 12;
  const yieldPct = totalInvestment > 0 ? (annualNet / totalInvestment) * 100 : 0;
  const hasInput = priceNum > 0 && rentNum > 0;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>מחיר רכישת הנכס (₪)</label>
          <input className={field} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1,800,000" />
        </div>
        <div>
          <label className={label}>שכ״ד חודשי צפוי (₪)</label>
          <input className={field} inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="6,500" />
        </div>
        <div>
          <label className={label}>דמי ניהול/אחזקה חודשיים (₪)</label>
          <input className={field} inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="400" />
        </div>
        <div>
          <label className={label}>מס רכישה (₪)</label>
          <input className={field} inputMode="numeric" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="63,000" />
        </div>
      </div>

      <div className="border-t border-gray-dark pt-6 text-center">
        <p className="text-xs tracking-widest text-gold uppercase mb-2">תשואה שנתית נטו</p>
        <p className="font-display text-5xl font-light text-white">
          {hasInput ? yieldPct.toFixed(2) : "0.00"}%
        </p>
      </div>

      {hasInput && (
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
            <p className="text-xs text-gray-light mb-1">סך ההשקעה (מחיר + מס רכישה)</p>
            <p className="text-white font-semibold">₪{totalInvestment.toLocaleString("he-IL")}</p>
          </div>
          <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
            <p className="text-xs text-gray-light mb-1">הכנסה שנתית נטו (שכ״ד פחות ניהול)</p>
            <p className="text-white font-semibold">₪{annualNet.toLocaleString("he-IL")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
