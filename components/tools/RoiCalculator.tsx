"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
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
  const [showExtra, setShowExtra] = useState(false);
  const [brokerFee, setBrokerFee] = useState("");
  const [legalFee, setLegalFee] = useState("");
  const [renovation, setRenovation] = useState("");
  const [otherCosts, setOtherCosts] = useState("");

  const priceNum = num(price);
  const rentNum = num(rent);
  const feeNum = num(fee);
  const taxNum = num(tax);
  const brokerFeeNum = num(brokerFee);
  const legalFeeNum = num(legalFee);
  const renovationNum = num(renovation);
  const otherCostsNum = num(otherCosts);

  const extraCosts = brokerFeeNum + legalFeeNum + renovationNum + otherCostsNum;
  const totalInvestment = priceNum + taxNum + extraCosts;
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

      <div>
        <button
          type="button"
          onClick={() => setShowExtra((v) => !v)}
          className="flex items-center justify-between w-full text-xs text-gold tracking-wider uppercase py-2 border-t border-gray-dark"
        >
          הוצאות נלוות לרכישה (אופציונלי)
          <ChevronDown
            size={14}
            className={`transition-transform ${showExtra ? "rotate-180" : ""}`}
          />
        </button>

        {showExtra && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={label}>דמי תיווך (₪)</label>
              <input className={field} inputMode="numeric" value={brokerFee} onChange={(e) => setBrokerFee(e.target.value)} placeholder="36,000" />
            </div>
            <div>
              <label className={label}>שכר טרחת עו״ד (₪)</label>
              <input className={field} inputMode="numeric" value={legalFee} onChange={(e) => setLegalFee(e.target.value)} placeholder="8,000" />
            </div>
            <div>
              <label className={label}>עלות שיפוץ (₪)</label>
              <input className={field} inputMode="numeric" value={renovation} onChange={(e) => setRenovation(e.target.value)} placeholder="50,000" />
            </div>
            <div>
              <label className={label}>הוצאות נוספות (₪)</label>
              <input className={field} inputMode="numeric" value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} placeholder="5,000" />
            </div>
          </div>
        )}
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
            <p className="text-xs text-gray-light mb-1">סך ההשקעה (כולל מס והוצאות נלוות)</p>
            <p className="text-white font-semibold">₪{totalInvestment.toLocaleString("he-IL")}</p>
          </div>
          <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
            <p className="text-xs text-gray-light mb-1">הכנסה שנתית נטו (שכ״ד פחות ניהול)</p>
            <p className="text-white font-semibold">₪{annualNet.toLocaleString("he-IL")}</p>
          </div>
          {extraCosts > 0 && (
            <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
              <p className="text-xs text-gray-light mb-1">מזה הוצאות נלוות לרכישה</p>
              <p className="text-white font-semibold">₪{extraCosts.toLocaleString("he-IL")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
