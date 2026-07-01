"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import LeadCaptureForm from "./LeadCaptureForm";

const LIFE_STAGES = [
  {
    id: "investor",
    label: "משקיע",
    profile: "נכס להשקעה עם פוטנציאל השבחה — דירות 2–3 חדרים באזורים מתפתחים או נכסים במסלול תמ״א 38, עם דגש על תשואה ותזרים.",
  },
  {
    id: "family",
    label: "משפחה מתרחבת",
    profile: "דירת 4–5 חדרים עם חדרים נוספים, קרבה לבתי ספר וגנים, ועדיפות למרפסת או גינה.",
  },
  {
    id: "young",
    label: "זוג צעיר",
    profile: "דירת 2–3 חדרים ראשונה, במיקום נוח לתחבורה ולמרכזי עניין, עם פוטנציאל עליית ערך.",
  },
  {
    id: "downsize",
    label: "דאון-סייזינג / גיל הזהב",
    profile: "דירה קומפקטית ונוחה, בקומה נמוכה או עם מעלית, בקרבה לשירותים ולים.",
  },
] as const;

const VIBES = [
  { id: "modern", label: "מודרני / בוטיק", note: "בבניין בוטיק חדש עם עיצוב מודרני ומפרט טכני גבוה" },
  { id: "classic", label: "קלאסי / יוקרתי", note: "בבניין לשימור או ברחוב וותיק עם אופי ואדריכלות ייחודית" },
  { id: "quiet", label: "שקט / משפחתי", note: "ברחוב שקט, בשכונה משפחתית ורגועה" },
  { id: "lively", label: "תוסס / מרכז העיר", note: "במרכז האקשן, קרוב לבתי קפה, מסעדות וחיי לילה" },
] as const;

const BUDGETS = [
  { id: "b1", label: "עד 2 מיליון ₪", note: "בטווח הזה נתמקד בשכונות מתפתחות עם פוטנציאל עתידי" },
  { id: "b2", label: "2–4 מיליון ₪", note: "טווח שמאפשר מגוון רחב של אפשרויות באזורי ביקוש מרכזיים" },
  { id: "b3", label: "4–7 מיליון ₪", note: "טווח שפותח דלת לנכסי יוקרה ברחובות המבוקשים ביותר" },
  { id: "b4", label: "מעל 7 מיליון ₪", note: "טווח שמתאים לנכסי פרימיום, פנטהאוזים ובתים פרטיים" },
] as const;

export default function PropertyMatchQuiz() {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState<(typeof LIFE_STAGES)[number] | null>(null);
  const [vibe, setVibe] = useState<(typeof VIBES)[number] | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | null>(null);

  const recommendation =
    stage && vibe && budget ? `${stage.profile} ${vibe.note}. ${budget.note}.` : "";

  const details = stage && vibe && budget
    ? `שלב חיים: ${stage.label}\nוייב מבוקש: ${vibe.label}\nתקציב: ${budget.label}\n\nפרופיל מומלץ: ${recommendation}`
    : undefined;

  if (step === 4 && stage && vibe && budget) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xs tracking-widest text-gold uppercase mb-3">הפרופיל המומלץ עבורכם</p>
          <p className="text-white leading-relaxed">{recommendation}</p>
        </div>
        <div className="border-t border-gray-dark pt-6">
          <LeadCaptureForm
            toolName="שאלון התאמת נכס"
            details={details}
            ctaLabel="קבע פגישת ייעוץ עם עידן"
            submitLabel="קבע פגישה →"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-gold" : "bg-gray-dark"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="text-sm font-semibold text-white mb-4">באיזה שלב חיים אתם נמצאים?</p>
          <div className="grid grid-cols-2 gap-3">
            {LIFE_STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setStage(s);
                  setStep(2);
                }}
                className="p-4 rounded-xl border border-gray-dark bg-black/40 text-gray-light hover:border-gold hover:text-white transition-all text-sm text-right"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-sm font-semibold text-white mb-4">איזה וייב מדבר אליכם?</p>
          <div className="grid grid-cols-2 gap-3">
            {VIBES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setVibe(v);
                  setStep(3);
                }}
                className="p-4 rounded-xl border border-gray-dark bg-black/40 text-gray-light hover:border-gold hover:text-white transition-all text-sm text-right"
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="text-sm font-semibold text-white mb-4">מה טווח התקציב?</p>
          <div className="grid grid-cols-2 gap-3">
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setBudget(b);
                  setStep(4);
                }}
                className="p-4 rounded-xl border border-gray-dark bg-black/40 text-gray-light hover:border-gold hover:text-white transition-all text-sm text-right"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step > 1 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="flex items-center gap-1 text-xs text-gray-light hover:text-gold transition-colors"
        >
          <ArrowRight size={12} />
          חזרה
        </button>
      )}
    </div>
  );
}
