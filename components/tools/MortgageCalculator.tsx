"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { numberLocale } from "@/lib/locale-format";

const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";
const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";

function num(v: string): number {
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

type BuyerStatus = "first" | "replacement" | "investment";

const MAX_LTV: Record<BuyerStatus, number> = {
  first: 0.75,
  replacement: 0.7,
  investment: 0.5,
};

export default function MortgageCalculator() {
  const { t, locale } = useLanguage();
  const c = t.tools_ui.mortgage_calculator;
  const nl = numberLocale(locale);

  const BUYER_LABEL: Record<BuyerStatus, string> = {
    first: c.buyer_first,
    replacement: c.buyer_replacement,
    investment: c.buyer_investment,
  };

  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [buyerStatus, setBuyerStatus] = useState<BuyerStatus>("first");

  const priceNum = num(price);
  const downPaymentNum = num(downPayment);
  const rateNum = num(rate);
  const yearsNum = num(years);

  const loanAmount = Math.max(priceNum - downPaymentNum, 0);
  const ltv = priceNum > 0 ? loanAmount / priceNum : 0;
  const maxLtv = MAX_LTV[buyerStatus];

  const hasInput = priceNum > 0 && downPaymentNum >= 0 && rateNum > 0 && yearsNum > 0;

  const monthlyRate = rateNum / 100 / 12;
  const totalMonths = yearsNum * 12;
  const monthlyPayment = hasInput
    ? monthlyRate === 0
      ? loanAmount / totalMonths
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths))
    : 0;
  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mortgagecalculator-f0" className={label}>{c.label_price}</label>
          <input id="mortgagecalculator-f0" className={field} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2,000,000" />
        </div>
        <div>
          <label htmlFor="mortgagecalculator-f1" className={label}>{c.label_down_payment}</label>
          <input id="mortgagecalculator-f1" className={field} inputMode="numeric" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="500,000" />
        </div>
        <div>
          <label htmlFor="mortgagecalculator-f2" className={label}>{c.label_rate}</label>
          <input id="mortgagecalculator-f2" className={field} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="4.5" />
        </div>
        <div>
          <label htmlFor="mortgagecalculator-f3" className={label}>{c.label_years}</label>
          <input id="mortgagecalculator-f3" className={field} inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value)} placeholder="25" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mortgagecalculator-f4" className={label}>{c.label_buyer_status}</label>
          <select id="mortgagecalculator-f4" className={field} value={buyerStatus} onChange={(e) => setBuyerStatus(e.target.value as BuyerStatus)}>
            {(Object.keys(BUYER_LABEL) as BuyerStatus[]).map((key) => (
              <option key={key} value={key}>{BUYER_LABEL[key]}</option>
            ))}
          </select>
        </div>
      </div>

      {hasInput && (
        <div className="space-y-4 pt-6 border-t border-gray-dark">
          <div className="text-center">
            <p className="text-xs tracking-widest text-gold uppercase mb-2">{c.result_monthly_label}</p>
            <p className="font-display text-5xl font-light text-white">₪{Math.round(monthlyPayment).toLocaleString(nl)}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
              <p className="text-xs text-gray-light mb-1">{c.result_loan_label}</p>
              <p className="text-white font-semibold">₪{Math.round(loanAmount).toLocaleString(nl)}</p>
            </div>
            <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
              <p className="text-xs text-gray-light mb-1">{c.result_interest_label}</p>
              <p className="text-white font-semibold">₪{Math.round(totalInterest).toLocaleString(nl)}</p>
            </div>
            <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
              <p className="text-xs text-gray-light mb-1">{c.result_total_label}</p>
              <p className="text-white font-semibold">₪{Math.round(totalPayment).toLocaleString(nl)}</p>
            </div>
          </div>

          <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-sm text-gray-light space-y-1.5">
            <div className="flex justify-between">
              <span>{c.ltv_label}</span>
              <span className={ltv > maxLtv ? "text-amber-400 font-semibold" : "text-cream"}>{(ltv * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>{c.ltv_limit_prefix} {BUYER_LABEL[buyerStatus]}</span>
              <span className="text-cream">{c.ltv_limit_up_to} {(maxLtv * 100).toFixed(0)}%</span>
            </div>
            {ltv > maxLtv && (
              <p className="text-amber-400 pt-1">{c.ltv_warning}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
