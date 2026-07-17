"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import LeadCaptureForm from "./LeadCaptureForm";
import { useLanguage } from "@/contexts/LanguageContext";

type Stage = { id: string; label: string; profile: string };
type Vibe = { id: string; label: string; note: string };
type Budget = { id: string; label: string; note: string };

export default function PropertyMatchQuiz() {
  const { t } = useLanguage();
  const c = t.tools_ui.property_match;
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState<Stage | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);

  const recommendation =
    stage && vibe && budget ? `${stage.profile} ${vibe.note}. ${budget.note}.` : "";

  const details = stage && vibe && budget
    ? `${c.details_stage_label} ${stage.label}\n${c.details_vibe_label} ${vibe.label}\n${c.details_budget_label} ${budget.label}\n\n${c.details_profile_label} ${recommendation}`
    : undefined;

  if (step === 4 && stage && vibe && budget) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xs tracking-widest text-gold uppercase mb-3">{c.result_label}</p>
          <p className="text-white leading-relaxed">{recommendation}</p>
        </div>
        <div className="border-t border-gray-dark pt-6">
          <LeadCaptureForm
            toolName={c.tool_name}
            details={details}
            ctaLabel={c.cta_label}
            submitLabel={c.submit_label}
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
          <p className="text-sm font-semibold text-white mb-4">{c.step1_question}</p>
          <div className="grid grid-cols-2 gap-3">
            {c.life_stages.map((s) => (
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
          <p className="text-sm font-semibold text-white mb-4">{c.step2_question}</p>
          <div className="grid grid-cols-2 gap-3">
            {c.vibes.map((v) => (
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
          <p className="text-sm font-semibold text-white mb-4">{c.step3_question}</p>
          <div className="grid grid-cols-2 gap-3">
            {c.budgets.map((b) => (
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
          {c.back_button}
        </button>
      )}
    </div>
  );
}
