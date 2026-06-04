"use client";

import { useTranslations } from "next-intl";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
  const t = useTranslations("checkout");
  const stepLabels = [t("steps.contact"), t("steps.delivery"), t("steps.review")] as const;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-6">
      <p className="text-sm font-medium text-text-muted">
        {t("stepOf", { step: currentStep })}
      </p>

      <ol className="mt-4 grid grid-cols-3 gap-3">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={[
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  isComplete
                    ? "border-primary bg-primary text-white"
                    : isActive
                      ? "border-primary bg-primary/10 text-primary-dark"
                      : "border-border bg-bg text-text-muted",
                ].join(" ")}
                aria-current={isActive ? "step" : undefined}
              >
                {stepNumber}
              </span>
              <span
                className={[
                  "text-sm font-medium",
                  isActive || isComplete ? "text-text" : "text-text-muted",
                ].join(" ")}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
