"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { numberLocale } from "@/lib/locale-format";

const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";
const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";

// 2026 brackets under Regulation 12a (reformed track, in force since 15.8.2024, frozen at 2025
// levels until Jan 2028) — uses the same thresholds as the regular single-home table, at reduced
// rates. Olim who made aliyah before 15.8.2024 may still fall under an older, different track —
// verify with the Tax Authority / an accountant before relying on this.
const FX_TO_ILS: Record<string, number> = { ILS: 1, USD: 3.7, EUR: 4.0 };
const CURRENCY_SYMBOL: Record<string, string> = { ILS: "₪", USD: "$", EUR: "€" };
const OLEH_BRACKETS: [number, number][] = [
  [1_978_745, 0],
  [6_055_070, 0.005],
  [20_183_565, 0.08],
  [Infinity, 0.1],
];

function calcOlehTax(price: number) {
  let remaining = price;
  let prevLimit = 0;
  let totalTax = 0;
  const rows: { rate: number; taxable: number; tax: number }[] = [];

  for (const [limit, rate] of OLEH_BRACKETS) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, limit - prevLimit);
    const tax = taxable * rate;
    if (taxable > 0) rows.push({ rate, taxable, tax });
    totalTax += tax;
    remaining -= taxable;
    prevLimit = limit;
  }

  return { totalTax, rows };
}

export default function OlehTaxSimulator() {
  const { t, locale } = useLanguage();
  const c = t.tools_ui.oleh_tax;
  const nl = numberLocale(locale);

  const CURRENCY_LABEL: Record<string, string> = {
    ILS: c.currency_ils,
    USD: c.currency_usd,
    EUR: c.currency_eur,
  };

  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<"ILS" | "USD" | "EUR">("ILS");

  const priceNum = Number(price.replace(/,/g, "")) || 0;
  const priceInILS = priceNum * FX_TO_ILS[currency];
  const hasInput = priceInILS > 0;

  const { totalTax, rows } = calcOlehTax(priceInILS);

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-xs text-amber-300 leading-relaxed">
        {c.banner}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="olehtaxsimulator-f0" className={label}>{c.label_price}</label>
          <input id="olehtaxsimulator-f0" className={field} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1,800,000" />
        </div>
        <div>
          <label htmlFor="olehtax-currency" className={label}>{c.label_currency}</label>
          <select
            id="olehtax-currency"
            className={field}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "ILS" | "USD" | "EUR")}
          >
            <option value="ILS">{CURRENCY_LABEL.ILS}</option>
            <option value="USD">{CURRENCY_LABEL.USD}</option>
            <option value="EUR">{CURRENCY_LABEL.EUR}</option>
          </select>
        </div>
      </div>

      {hasInput && (
        <div className="border-t border-gray-dark pt-6 space-y-4">
          {currency !== "ILS" && (
            <p className="text-sm text-gray-light text-center">
              {c.price_in_ils_prefix} ({c.price_in_ils_rate_word} {CURRENCY_SYMBOL[currency]}1 = ₪{FX_TO_ILS[currency]}): ₪{Math.round(priceInILS).toLocaleString(nl)}
            </p>
          )}

          <div className="text-center">
            <p className="text-xs tracking-widest text-gold uppercase mb-2">{c.result_label}</p>
            <p className="font-display text-3xl sm:text-4xl font-light text-white">
              ₪{Math.round(totalTax).toLocaleString(nl)}
            </p>
          </div>

          <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-sm text-gray-light space-y-1.5">
            {rows.map((row) => (
              <div key={row.rate} className="flex justify-between">
                <span>{row.rate * 100}% {c.bracket_on} ₪{Math.round(row.taxable).toLocaleString(nl)}</span>
                <span className="text-cream">₪{Math.round(row.tax).toLocaleString(nl)}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-light leading-relaxed">{c.disclaimer2}</p>

          <div>
            <p className="text-xs tracking-widest text-gold uppercase mb-3">{c.roadmap_label}</p>
            <ol className="space-y-2">
              {c.roadmap.map((step, i) => (
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
