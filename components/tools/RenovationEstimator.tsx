"use client";

import { useState } from "react";

const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

const LEVELS = [
  { id: "basic", label: "בסיסי", low: 2500, high: 4000 },
  { id: "mid", label: "בינוני", low: 4000, high: 6500 },
  { id: "luxury", label: "יוקרתי", low: 6500, high: 10000 },
] as const;

type LevelId = (typeof LEVELS)[number]["id"];

const UPGRADES = [
  { id: "ac", label: "מיני-מרכזי עם דמפרים אישיים", low: 25000, high: 40000, perSqm: false },
  { id: "spc", label: "תשתית פרקט SPC", low: 150, high: 250, perSqm: true },
  { id: "plumbing", label: "תכנון אינסטלציה מותאם אישית", low: 15000, high: 30000, perSqm: false },
  { id: "electric", label: "כפילות לוח חשמל", low: 8000, high: 15000, perSqm: false },
] as const;

export default function RenovationEstimator() {
  const [sqm, setSqm] = useState("");
  const [level, setLevel] = useState<LevelId>("mid");
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const sqmNum = Number(sqm) || 0;
  const levelData = LEVELS.find((l) => l.id === level)!;
  const baseLow = sqmNum * levelData.low;
  const baseHigh = sqmNum * levelData.high;

  const activeUpgrades = UPGRADES.filter((u) => toggles[u.id]);
  const upgradesLow = activeUpgrades.reduce((sum, u) => sum + (u.perSqm ? u.low * sqmNum : u.low), 0);
  const upgradesHigh = activeUpgrades.reduce((sum, u) => sum + (u.perSqm ? u.high * sqmNum : u.high), 0);

  const totalLow = baseLow + upgradesLow;
  const totalHigh = baseHigh + upgradesHigh;

  return (
    <div className="space-y-6">
      <div>
        <label className={label}>שטח הדירה (מ״ר)</label>
        <input
          className="w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors"
          inputMode="numeric"
          value={sqm}
          onChange={(e) => setSqm(e.target.value)}
          placeholder="100"
        />
      </div>

      <div>
        <label className={label}>רמת שיפוץ</label>
        <div className="grid grid-cols-3 gap-3">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l.id)}
              className={`py-2.5 rounded-lg text-sm border transition-colors ${
                level === l.id
                  ? "bg-gold text-black border-gold font-semibold"
                  : "bg-black/40 border-gray-dark text-gray-light hover:border-gold/40"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={label}>שדרוגים נוספים</label>
        <div className="space-y-2">
          {UPGRADES.map((u) => (
            <label
              key={u.id}
              className="flex items-center justify-between gap-3 bg-black/40 border border-gray-dark rounded-lg px-4 py-3 cursor-pointer"
            >
              <span className="text-sm text-cream">{u.label}</span>
              <input
                type="checkbox"
                checked={!!toggles[u.id]}
                onChange={(e) => setToggles((prev) => ({ ...prev, [u.id]: e.target.checked }))}
                className="w-4 h-4 accent-gold shrink-0"
              />
            </label>
          ))}
        </div>
      </div>

      {sqmNum > 0 && (
        <div className="border-t border-gray-dark pt-6 text-center">
          <p className="text-xs tracking-widest text-gold uppercase mb-2">טווח עלות משוער</p>
          <p className="font-display text-3xl sm:text-4xl font-light text-white">
            ₪{Math.round(totalLow).toLocaleString("he-IL")} – ₪{Math.round(totalHigh).toLocaleString("he-IL")}
          </p>
          <p className="text-xs text-gray-light mt-3">אומדן גס בלבד, לא הצעת מחיר</p>
        </div>
      )}
    </div>
  );
}
