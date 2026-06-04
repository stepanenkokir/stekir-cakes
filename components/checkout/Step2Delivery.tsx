import { FormField, formInputClassName } from "@/components/ui/FormField";

export type DeliveryType = "delivery" | "pickup";
export type DeliveryWindow = "morning" | "afternoon" | "evening";

export type DeliveryFormValues = {
  deliveryType: DeliveryType;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryZip: string;
  deliveryDate: string;
  deliveryWindow: DeliveryWindow;
  deliveryInstructions: string;
};

type Step2DeliveryProps = {
  values: DeliveryFormValues;
  minDate: string;
  deliveryFeeNote?: string;
  errors?: Partial<Record<keyof DeliveryFormValues, string>>;
  onChange: (field: keyof DeliveryFormValues, value: string) => void;
};

export function Step2Delivery({
  values,
  minDate,
  deliveryFeeNote,
  errors,
  onChange,
}: Step2DeliveryProps) {
  const isDelivery = values.deliveryType === "delivery";

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-text">Delivery Details</h2>
      <p className="mt-2 text-sm text-text-muted">
        Choose delivery or pickup, then set your preferred date and time window.
      </p>

      <div className="mt-6">
        <fieldset>
          <legend className="text-sm font-medium text-text">Delivery method</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg p-4">
              <input
                type="radio"
                name="delivery-type"
                value="delivery"
                checked={values.deliveryType === "delivery"}
                onChange={() => onChange("deliveryType", "delivery")}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-text">Delivery</span>
                <span className="block text-sm text-text-muted">$10 within 15 miles, $20 up to 30 miles</span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg p-4">
              <input
                type="radio"
                name="delivery-type"
                value="pickup"
                checked={values.deliveryType === "pickup"}
                onChange={() => onChange("deliveryType", "pickup")}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-text">Pickup</span>
                <span className="block text-sm text-text-muted">Free pickup after confirmation</span>
              </span>
            </label>
          </div>
        </fieldset>
      </div>

      {isDelivery ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField
              label="Street address"
              htmlFor="checkout-delivery-address"
              hint={errors?.deliveryAddress}
              hintTone="danger"
            >
              <input
                id="checkout-delivery-address"
                autoComplete="street-address"
                value={values.deliveryAddress}
                onChange={(event) => onChange("deliveryAddress", event.target.value)}
                className={formInputClassName()}
              />
            </FormField>
          </div>

          <FormField label="City" htmlFor="checkout-delivery-city" hint={errors?.deliveryCity} hintTone="danger">
            <input
              id="checkout-delivery-city"
              autoComplete="address-level2"
              value={values.deliveryCity}
              onChange={(event) => onChange("deliveryCity", event.target.value)}
              className={formInputClassName()}
            />
          </FormField>

          <FormField label="ZIP code" htmlFor="checkout-delivery-zip" hint={errors?.deliveryZip} hintTone="danger">
            <input
              id="checkout-delivery-zip"
              autoComplete="postal-code"
              inputMode="numeric"
              value={values.deliveryZip}
              onChange={(event) => onChange("deliveryZip", event.target.value)}
              className={formInputClassName()}
              maxLength={5}
            />
          </FormField>

          {deliveryFeeNote ? (
            <p className="sm:col-span-2 text-sm text-text-muted">{deliveryFeeNote}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <FormField label={isDelivery ? "Delivery date" : "Pickup date"} htmlFor="checkout-delivery-date" hint={errors?.deliveryDate} hintTone="danger">
          <input
            id="checkout-delivery-date"
            type="date"
            min={minDate}
            value={values.deliveryDate}
            onChange={(event) => onChange("deliveryDate", event.target.value)}
            className={formInputClassName()}
          />
        </FormField>

        <fieldset>
          <legend className="block text-sm font-medium text-text">Time window</legend>
          <div className="mt-2 grid gap-2">
            {[
              { id: "morning", label: "Morning (9am-12pm)" },
              { id: "afternoon", label: "Afternoon (12pm-5pm)" },
              { id: "evening", label: "Evening (5pm-8pm)" },
            ].map((windowOption) => (
              <label key={windowOption.id} className="flex items-center gap-2 text-sm text-text">
                <input
                  type="radio"
                  name="delivery-window"
                  value={windowOption.id}
                  checked={values.deliveryWindow === windowOption.id}
                  onChange={() => onChange("deliveryWindow", windowOption.id)}
                />
                <span>{windowOption.label}</span>
              </label>
            ))}
          </div>
          {errors?.deliveryWindow ? (
            <p className="mt-2 text-xs text-red-600">{errors.deliveryWindow}</p>
          ) : null}
        </fieldset>
      </div>

      <div className="mt-6">
        <FormField
          label="Special instructions (optional)"
          htmlFor="checkout-delivery-instructions"
          hint={errors?.deliveryInstructions}
          hintTone="danger"
        >
          <textarea
            id="checkout-delivery-instructions"
            rows={4}
            value={values.deliveryInstructions}
            onChange={(event) => onChange("deliveryInstructions", event.target.value)}
            className={formInputClassName("resize-y")}
            placeholder="Gate code, parking details, landmark, or pickup note"
          />
        </FormField>
      </div>
    </section>
  );
}
