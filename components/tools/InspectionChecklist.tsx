"use client";

import { useState } from "react";
import LeadCaptureForm from "./LeadCaptureForm";

const CATEGORIES = [
  {
    title: "סדקים מבניים",
    items: [
      "סדקים אלכסוניים ליד פתחי דלתות וחלונות",
      "סדקים אנכיים או אופקיים בקירות חיצוניים",
      "סימני שקיעה או שיפוע ברצפה",
      "פערים בין קיר לתקרה או בין קיר לרצפה",
    ],
  },
  {
    title: "רטיבות",
    items: [
      "כתמי רטיבות בתקרה או בקירות",
      "ריח עובש בחדרים סגורים",
      "התקלפות צבע או טיח נפוח",
      "רטיבות סביב חלונות, מקלחת או מטבח",
    ],
  },
  {
    title: "אינסטלציה",
    items: [
      "לחץ מים חלש בברזים",
      "כתמי חלודה על צנרת גלויה",
      "ניקוז איטי בכיורים ובאמבטיה",
      "רעשים חריגים במערכת המים",
    ],
  },
  {
    title: "חשמל",
    items: [
      "לוח חשמל ישן או ללא תקן נוכחי",
      "שקעים רופפים, חמים או שרופים",
      "היעדר הארקה בשקעים",
      "תאורה מהבהבת או נתיכים שקופצים",
    ],
  },
  {
    title: "כללי",
    items: [
      "מצב איטום חלונות ותריסים",
      "תפקוד תקין של דלתות ומנעולים",
      "מצב חדר מדרגות ותחזוקת הבניין",
      "גיל הבניין ותאריך שיפוץ אחרון של חזית/גג",
    ],
  },
];

export default function InspectionChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(item: string) {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  const checkedItems = Object.entries(checked)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const details = checkedItems.length
    ? `סימן ${checkedItems.length} ליקויים אפשריים:\n${checkedItems.join("\n")}`
    : "לא סימן ליקויים ספציפיים";

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-light">
        סמנו כל דבר שראיתם או חוששים ממנו בביקור בנכס. בסוף — נשלח לכם את המדריך המלא כ-PDF עם הסברים והמלצות לכל סעיף.
      </p>

      {CATEGORIES.map((cat) => (
        <div key={cat.title}>
          <p className="text-xs tracking-widest text-gold uppercase mb-3">{cat.title}</p>
          <div className="space-y-2">
            {cat.items.map((item) => (
              <label
                key={item}
                className="flex items-center justify-between gap-3 bg-black/40 border border-gray-dark rounded-lg px-4 py-3 cursor-pointer"
              >
                <span className="text-sm text-cream">{item}</span>
                <input
                  type="checkbox"
                  checked={!!checked[item]}
                  onChange={() => toggle(item)}
                  className="w-4 h-4 accent-gold shrink-0"
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="border-t border-gray-dark pt-6">
        <LeadCaptureForm
          toolName="צ'קליסט בדק בית"
          details={details}
          ctaLabel="שלח לי את המדריך המלא ב-PDF"
          submitLabel="שלח לי את המדריך →"
        />
      </div>
    </div>
  );
}
