"use client";

import { useState } from "react";
import Link from "@/components/LocaleLink";

const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";
const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";

function num(v: string): number {
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

type BuyerStatus = "first" | "additional" | "foreign";

const BUYER_LABEL: Record<BuyerStatus, string> = {
  first: "דירה יחידה (תושב ישראל)",
  additional: "דירה נוספת / משקיע (תושב ישראל)",
  foreign: "תושב חוץ (גם אם דירה יחידה)",
};

// 2026 brackets — מוקפאות לפי רשות המסים עד ינואר 2028 עבור דירה יחידה. יש לאמת מול רשות המסים לפני כל החלטה.
const FIRST_APARTMENT_BRACKETS: [number, number][] = [
  [1_978_745, 0],
  [2_347_040, 0.035],
  [6_055_070, 0.05],
  [20_183_565, 0.08],
  [Infinity, 0.1],
];

const NON_FIRST_APARTMENT_BRACKETS: [number, number][] = [
  [6_055_070, 0.08],
  [Infinity, 0.1],
];

function calcPurchaseTax(price: number, brackets: [number, number][]) {
  let remaining = price;
  let prevLimit = 0;
  let totalTax = 0;
  const rows: { from: number; to: number; rate: number; taxable: number; tax: number }[] = [];

  for (const [limit, rate] of brackets) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, limit - prevLimit);
    const tax = taxable * rate;
    if (taxable > 0) rows.push({ from: prevLimit, to: Math.min(price, limit), rate, taxable, tax });
    totalTax += tax;
    remaining -= taxable;
    prevLimit = limit;
  }

  return { totalTax, rows };
}

export default function TaxSimulator() {
  const [price, setPrice] = useState("");
  const [buyerStatus, setBuyerStatus] = useState<BuyerStatus>("first");

  const [singleHomeExempt, setSingleHomeExempt] = useState(false);
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [sellingExpenses, setSellingExpenses] = useState("");

  const priceNum = num(price);
  const hasPurchaseInput = priceNum > 0;
  const brackets = buyerStatus === "first" ? FIRST_APARTMENT_BRACKETS : NON_FIRST_APARTMENT_BRACKETS;
  const { totalTax, rows } = calcPurchaseTax(priceNum, brackets);
  const effectiveRate = priceNum > 0 ? (totalTax / priceNum) * 100 : 0;

  const originalPriceNum = num(originalPrice);
  const salePriceNum = num(salePrice);
  const sellingExpensesNum = num(sellingExpenses);
  const hasGainInput = !singleHomeExempt && originalPriceNum > 0 && salePriceNum > 0;
  const gain = Math.max(salePriceNum - originalPriceNum - sellingExpensesNum, 0);
  const capitalGainsTax = gain * 0.25;

  return (
    <div className="space-y-10">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-xs text-amber-300 leading-relaxed">
        המדרגות מעודכנות לשנת 2026 (מוקפאות לפי רשות המסים עד ינואר 2028 לגבי דירה יחידה). עולה חדש? יש לכם סימולטור ייעודי —{" "}
        <Link href="/toolbox/oleh-tax" className="underline hover:text-amber-200">מס לעולים חדשים</Link>. יש לאמת מדרגות עדכניות מול רשות המסים לפני כל החלטה.
      </div>

      {/* Section A — מס רכישה */}
      <div className="space-y-6">
        <h3 className="text-white font-semibold">מס רכישה — בעת הקנייה</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="taxsimulator-f0" className={label}>מחיר הנכס (₪)</label>
            <input id="taxsimulator-f0" className={field} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2,500,000" />
          </div>
          <div>
            <label htmlFor="taxsimulator-f1" className={label}>סטטוס הרוכש</label>
            <select id="taxsimulator-f1" className={field} value={buyerStatus} onChange={(e) => setBuyerStatus(e.target.value as BuyerStatus)}>
              {(Object.keys(BUYER_LABEL) as BuyerStatus[]).map((key) => (
                <option key={key} value={key}>{BUYER_LABEL[key]}</option>
              ))}
            </select>
          </div>
        </div>

        {buyerStatus === "foreign" && (
          <p className="text-xs text-gray-light leading-relaxed">
            תושב חוץ ממוסה לפי מדרגות "דירה נוספת" גם כשמדובר בדירתו היחידה בישראל. אם יהפוך לתושב ישראל תוך 27 חודשים מהרכישה, ייתכן שיהיה זכאי בדיעבד למדרגות דירה יחידה — בכפוף לתנאים.
          </p>
        )}

        {hasPurchaseInput && (
          <div className="space-y-4 pt-4 border-t border-gray-dark">
            <div className="text-center">
              <p className="text-xs tracking-widest text-gold uppercase mb-2">סה״כ מס רכישה</p>
              <p className="font-display text-4xl font-light text-white">₪{Math.round(totalTax).toLocaleString("he-IL")}</p>
              <p className="text-xs text-gray-light mt-1">שיעור אפקטיבי: {effectiveRate.toFixed(2)}%</p>
            </div>

            <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-sm text-gray-light space-y-1.5">
              {rows.map((row) => (
                <div key={row.from} className="flex justify-between">
                  <span>{(row.rate * 100).toFixed(1)}% על ₪{Math.round(row.taxable).toLocaleString("he-IL")}</span>
                  <span className="text-cream">₪{Math.round(row.tax).toLocaleString("he-IL")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section B — מס שבח */}
      <div className="space-y-6 pt-6 border-t border-gray-dark">
        <div>
          <h3 className="text-white font-semibold mb-1.5">מס שבח — בעת מכירה עתידית</h3>
          <p className="text-xs text-gray-light leading-relaxed">
            מס שבח משולם ע״י המוכר בעת המכירה, בשיעור 25% מהרווח הריאלי (לאחר ניכוי הוצאות מוכרות). דירת מגורים יחידה שהוחזקה לפחות 18 חודשים פטורה בדרך כלל באופן מלא.
          </p>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-gray-light cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 accent-gold"
            checked={singleHomeExempt}
            onChange={(e) => setSingleHomeExempt(e.target.checked)}
          />
          זו דירת המגורים היחידה שלי, ואני מחזיק/ה בה 18 חודשים ומעלה
        </label>

        {singleHomeExempt ? (
          <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-center text-white font-semibold">
            פטור מלא ממס שבח (בכפוף לעמידה בתנאי הפטור בחוק)
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="taxsimulator-f2" className={label}>מחיר רכישה מקורי (₪)</label>
                <input id="taxsimulator-f2" className={field} inputMode="numeric" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="2,000,000" />
              </div>
              <div>
                <label htmlFor="taxsimulator-f3" className={label}>מחיר מכירה משוער (₪)</label>
                <input id="taxsimulator-f3" className={field} inputMode="numeric" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="2,800,000" />
              </div>
              <div>
                <label htmlFor="taxsimulator-f4" className={label}>הוצאות מוכרות (₪, אופציונלי)</label>
                <input id="taxsimulator-f4" className={field} inputMode="numeric" value={sellingExpenses} onChange={(e) => setSellingExpenses(e.target.value)} placeholder="60,000" />
              </div>
            </div>

            {hasGainInput && (
              <div className="space-y-4 pt-4 border-t border-gray-dark">
                <div className="text-center">
                  <p className="text-xs tracking-widest text-gold uppercase mb-2">הערכת מס שבח (25% מהרווח)</p>
                  <p className="font-display text-4xl font-light text-white">₪{Math.round(capitalGainsTax).toLocaleString("he-IL")}</p>
                </div>
                <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-sm text-gray-light">
                  <div className="flex justify-between">
                    <span>רווח משוער (לפני הצמדה)</span>
                    <span className="text-cream">₪{Math.round(gain).toLocaleString("he-IL")}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-light leading-relaxed">
                  הערכה גסה בלבד — אינה כוללת הצמדה למדד, ניכויים מוכרים נוספים (השבחות, שכ״ט עו״ד ותיווך במכירה), או פטורים נוספים (ירושה, מתנה). יש להתייעץ עם רו״ח או עו״ד מקרקעין לחישוב מדויק.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
