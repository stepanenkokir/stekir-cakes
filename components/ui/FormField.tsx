import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-text-muted">{hint}</p> : null}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-text transition-colors placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function formInputClassName(className = ""): string {
  return `${inputClasses} ${className}`.trim();
}
