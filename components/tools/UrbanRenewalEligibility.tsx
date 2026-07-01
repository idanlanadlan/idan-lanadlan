"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

function scoreFor(year: number): { level: string; color: string; note: string } {
  if (year > 0 && year < 1980) {
    return {
      level: "התאמה גבוהה",
      color: "text-emerald-400",
      note: "מבנים שנבנו לפני 1980 (לפני החמרת תקן הרעידות) הם לרוב המועמדים הטבעיים לתמ״א 38 — חיזוק, תוספת ממ״דים או הריסה-בנייה.",
    };
  }
  if (year >= 1980 && year <= 1990) {
    return {
      level: "התאמה בינונית",
      color: "text-gold",
      note: "מבנים מהתקופה הזו לעיתים עדיין רלוונטיים לתמ״א 38, תלוי במצב המבנה ובתכנית המתאר המקומית.",
    };
  }
  return {
    level: "התאמה נמוכה",
    color: "text-gray-light",
    note: "מבנים חדשים יחסית פחות סביר שיזכו לתמ״א 38 קלאסית, אך ייתכנו מסלולי התחדשות עירונית אחרים.",
  };
}

export default function UrbanRenewalEligibility() {
  const [address, setAddress] = useState("");
  const [year, setYear] = useState("");

  const yearNum = Number(year) || 0;
  const hasInput = address.trim().length > 2 && yearNum > 1800;
  const result = hasInput ? scoreFor(yearNum) : null;

  const waMessage = encodeURIComponent(
    `שלום עידן, אשמח לבדיקה מקצועית של זכאות להתחדשות עירונית עבור הכתובת: ${address} (שנת בנייה: ${year})`
  );

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-xs text-amber-300 leading-relaxed">
        בדיקה ראשונית אינדיקטיבית בלבד, המבוססת על שנת הבנייה בלבד — אינה תחליף לבדיקה תכנונית מקצועית מול הוועדה המקומית.
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>כתובת הבניין</label>
          <input className={field} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="הירקון 100, תל אביב" />
        </div>
        <div>
          <label className={label}>שנת בנייה</label>
          <input className={field} inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} placeholder="1975" />
        </div>
      </div>

      {result && (
        <div className="border-t border-gray-dark pt-6 space-y-4">
          <div className="text-center">
            <p className="text-xs tracking-widest text-gold uppercase mb-2">ציון זכאות ראשוני — תמ״א 38</p>
            <p className={`font-display text-3xl font-light ${result.color}`}>{result.level}</p>
            <p className="text-sm text-gray-light mt-3 max-w-md mx-auto">{result.note}</p>
          </div>

          <div className="bg-black/40 border border-gray-dark rounded-lg p-4 text-xs text-gray-light leading-relaxed">
            <p className="text-gold mb-1">לגבי פינוי-בינוי:</p>
            <p>זכאות תלויה בהיות המתחם חלק מתכנית פינוי-בינוי מאושרת — לא ניתן לקבוע זאת לפי שנת בנייה בלבד. עידן יכול לבדוק עבורכם מול המידע התכנוני הרשמי.</p>
          </div>

          <a
            href={`https://wa.me/972549791171?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            בקש בדיקה מקצועית מול עידן
          </a>
        </div>
      )}
    </div>
  );
}
