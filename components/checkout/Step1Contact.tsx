import { FormField, formInputClassName } from "@/components/ui/FormField";

export type ContactFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type Step1ContactProps = {
  values: ContactFormValues;
  errors?: Partial<Record<keyof ContactFormValues, string>>;
  onChange: (field: keyof ContactFormValues, value: string) => void;
};

export function Step1Contact({ values, errors, onChange }: Step1ContactProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-text">Contact Information</h2>
      <p className="mt-2 text-sm text-text-muted">
        We&rsquo;ll use your phone to confirm order details and delivery timing.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <FormField label="First name" htmlFor="checkout-first-name" hint={errors?.firstName} hintTone="danger">
          <input
            id="checkout-first-name"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
            className={formInputClassName()}
            required
          />
        </FormField>

        <FormField label="Last name" htmlFor="checkout-last-name" hint={errors?.lastName} hintTone="danger">
          <input
            id="checkout-last-name"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(event) => onChange("lastName", event.target.value)}
            className={formInputClassName()}
            required
          />
        </FormField>

        <FormField
          label="Phone number"
          htmlFor="checkout-phone"
          hint={errors?.phone ?? "Required for order confirmation call or text"}
          hintTone={errors?.phone ? "danger" : "muted"}
        >
          <input
            id="checkout-phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            className={formInputClassName()}
            placeholder="(916) 555-0192"
            required
          />
        </FormField>

        <FormField label="Email address" htmlFor="checkout-email" hint={errors?.email} hintTone="danger">
          <input
            id="checkout-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => onChange("email", event.target.value)}
            className={formInputClassName()}
            required
          />
        </FormField>
      </div>
    </section>
  );
}
