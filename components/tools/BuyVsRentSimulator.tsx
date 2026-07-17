"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { numberLocale } from "@/lib/locale-format";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

// Editable assumptions
const MORTGAGE_TERM_YEARS = 25;
const ANNUAL_APPRECIATION = 0.03;
const ANNUAL_INVESTMENT_RETURN = 0.06;
const YEARS_AHEAD = 10;

function num(v: string): number {
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function BuyVsRentSimulator() {
  const { t, locale } = useLanguage();
  const c = t.tools_ui.buy_vs_rent;
  const nl = numberLocale(locale);

  const [capital, setCapital] = useState("");
  const [rate, setRate] = useState("");
  const [rent, setRent] = useState("");

  const capitalNum = num(capital);
  const rateNum = num(rate);
  const rentNum = num(rent);
  const hasInput = capitalNum > 0 && rentNum > 0 && rateNum > 0;

  let buyingNetWorth = 0;
  let rentingNetWorth = 0;
  let propertyPrice = 0;
  let loanAmount = 0;

  if (hasInput) {
    const monthlyRate = rateNum / 100 / 12;
    const totalMonths = MORTGAGE_TERM_YEARS * 12;
    const paidMonths = YEARS_AHEAD * 12;

    // Solve loan amount so the monthly mortgage payment equals the given monthly rent
    loanAmount =
      monthlyRate === 0
        ? rentNum * totalMonths
        : (rentNum * (1 - Math.pow(1 + monthlyRate, -totalMonths))) / monthlyRate;

    propertyPrice = capitalNum + loanAmount;

    // Remaining loan balance after `paidMonths` payments of `rentNum` each
    const remainingBalance =
      monthlyRate === 0
        ? Math.max(loanAmount - rentNum * paidMonths, 0)
        : Math.max(
            loanAmount * Math.pow(1 + monthlyRate, paidMonths) -
              (rentNum * (Math.pow(1 + monthlyRate, paidMonths) - 1)) / monthlyRate,
            0
          );

    const propertyValueAfter = propertyPrice * Math.pow(1 + ANNUAL_APPRECIATION, YEARS_AHEAD);
    buyingNetWorth = propertyValueAfter - remainingBalance;
    rentingNetWorth = capitalNum * Math.pow(1 + ANNUAL_INVESTMENT_RETURN, YEARS_AHEAD);
  }

  const maxWorth = Math.max(buyingNetWorth, rentingNetWorth, 1);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="buyvsrentsimulator-f0" className={label}>{c.label_capital}</label>
          <input id="buyvsrentsimulator-f0" className={field} inputMode="numeric" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="500,000" />
        </div>
        <div>
          <label htmlFor="buyvsrentsimulator-f1" className={label}>{c.label_rate}</label>
          <input id="buyvsrentsimulator-f1" className={field} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="4.5" />
        </div>
        <div>
          <label htmlFor="buyvsrentsimulator-f2" className={label}>{c.label_rent}</label>
          <input id="buyvsrentsimulator-f2" className={field} inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="6,500" />
        </div>
      </div>

      {hasInput && (
        <div className="space-y-5 pt-4 border-t border-gray-dark">
          <p className="text-xs text-gray-light text-center">{c.comparison_intro}</p>

          {/* Buying bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-white font-medium">{c.buying_label}</span>
              <span className="text-gold font-semibold">₪{Math.round(buyingNetWorth).toLocaleString(nl)}</span>
            </div>
            <div className="h-3 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-gold to-gold-dark rounded-full transition-all"
                style={{ width: `${(buyingNetWorth / maxWorth) * 100}%` }}
              />
            </div>
          </div>

          {/* Renting bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-white font-medium">{c.renting_label}</span>
              <span className="text-gold font-semibold">₪{Math.round(rentingNetWorth).toLocaleString(nl)}</span>
            </div>
            <div className="h-3 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-gold to-gold-dark rounded-full transition-all"
                style={{ width: `${(rentingNetWorth / maxWorth) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-center text-sm text-white pt-2">
            {buyingNetWorth > rentingNetWorth ? c.result_buying_wins : c.result_renting_wins}
          </p>

          <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-xs text-gray-light leading-relaxed">
            <p className="text-gold mb-1">{c.assumptions_label}</p>
            <p>
              {c.assumptions_term} · {c.assumptions_price}: ₪{Math.round(propertyPrice).toLocaleString(nl)} ({c.assumptions_loan} ₪{Math.round(loanAmount).toLocaleString(nl)}) · {c.assumptions_appreciation}: {(ANNUAL_APPRECIATION * 100).toFixed(0)}% · {c.assumptions_return}: {(ANNUAL_INVESTMENT_RETURN * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
