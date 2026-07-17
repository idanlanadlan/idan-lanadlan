"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { numberLocale } from "@/lib/locale-format";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

function num(v: string): number {
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function RoiCalculator() {
  const { t, locale } = useLanguage();
  const c = t.tools_ui.roi_calculator;
  const nl = numberLocale(locale);

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
          <label htmlFor="roicalculator-f0" className={label}>{c.label_price}</label>
          <input id="roicalculator-f0" className={field} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1,800,000" />
        </div>
        <div>
          <label htmlFor="roicalculator-f1" className={label}>{c.label_rent}</label>
          <input id="roicalculator-f1" className={field} inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="6,500" />
        </div>
        <div>
          <label htmlFor="roicalculator-f2" className={label}>{c.label_fee}</label>
          <input id="roicalculator-f2" className={field} inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="400" />
        </div>
        <div>
          <label htmlFor="roicalculator-f3" className={label}>{c.label_tax}</label>
          <input id="roicalculator-f3" className={field} inputMode="numeric" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="63,000" />
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowExtra((v) => !v)}
          aria-expanded={showExtra}
          aria-controls="roi-extra-costs"
          className="flex items-center justify-between w-full text-xs text-gold tracking-wider uppercase py-2 border-t border-gray-dark"
        >
          {c.extra_costs_toggle}
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`transition-transform ${showExtra ? "rotate-180" : ""}`}
          />
        </button>

        {showExtra && (
          <div id="roi-extra-costs" className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="roicalculator-f4" className={label}>{c.label_broker_fee}</label>
              <input id="roicalculator-f4" className={field} inputMode="numeric" value={brokerFee} onChange={(e) => setBrokerFee(e.target.value)} placeholder="36,000" />
            </div>
            <div>
              <label htmlFor="roicalculator-f5" className={label}>{c.label_legal_fee}</label>
              <input id="roicalculator-f5" className={field} inputMode="numeric" value={legalFee} onChange={(e) => setLegalFee(e.target.value)} placeholder="8,000" />
            </div>
            <div>
              <label htmlFor="roicalculator-f6" className={label}>{c.label_renovation}</label>
              <input id="roicalculator-f6" className={field} inputMode="numeric" value={renovation} onChange={(e) => setRenovation(e.target.value)} placeholder="50,000" />
            </div>
            <div>
              <label htmlFor="roicalculator-f7" className={label}>{c.label_other_costs}</label>
              <input id="roicalculator-f7" className={field} inputMode="numeric" value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} placeholder="5,000" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-dark pt-6 text-center">
        <p className="text-xs tracking-widest text-gold uppercase mb-2">{c.result_yield_label}</p>
        <p className="font-display text-5xl font-light text-white">
          {hasInput ? yieldPct.toFixed(2) : "0.00"}%
        </p>
      </div>

      {hasInput && (
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
            <p className="text-xs text-gray-light mb-1">{c.result_investment_label}</p>
            <p className="text-white font-semibold">₪{totalInvestment.toLocaleString(nl)}</p>
          </div>
          <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
            <p className="text-xs text-gray-light mb-1">{c.result_income_label}</p>
            <p className="text-white font-semibold">₪{annualNet.toLocaleString(nl)}</p>
          </div>
          {extraCosts > 0 && (
            <div className="bg-black/40 border border-gray-dark rounded-lg p-4">
              <p className="text-xs text-gray-light mb-1">{c.result_extra_label}</p>
              <p className="text-white font-semibold">₪{extraCosts.toLocaleString(nl)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
