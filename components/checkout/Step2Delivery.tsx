"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("checkout.step2");
  const isDelivery = values.deliveryType === "delivery";

  const windowOptions = [
    { id: "morning" as const, label: t("windows.morning") },
    { id: "afternoon" as const, label: t("windows.afternoon") },
    { id: "evening" as const, label: t("windows.evening") },
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-text">{t("title")}</h2>
      <p className="mt-2 text-sm text-text-muted">{t("intro")}</p>

      <div className="mt-6">
        <fieldset>
          <legend className="text-sm font-medium text-text">{t("method")}</legend>
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
                <span className="block font-medium text-text">{t("deliveryOption")}</span>
                <span className="block text-sm text-text-muted">{t("deliveryHint")}</span>
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
                <span className="block font-medium text-text">{t("pickupOption")}</span>
                <span className="block text-sm text-text-muted">{t("pickupHint")}</span>
              </span>
            </label>
          </div>
        </fieldset>
      </div>

      {isDelivery ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField
              label={t("street")}
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

          <FormField
            label={t("city")}
            htmlFor="checkout-delivery-city"
            hint={errors?.deliveryCity}
            hintTone="danger"
          >
            <input
              id="checkout-delivery-city"
              autoComplete="address-level2"
              value={values.deliveryCity}
              onChange={(event) => onChange("deliveryCity", event.target.value)}
              className={formInputClassName()}
            />
          </FormField>

          <FormField
            label={t("zip")}
            htmlFor="checkout-delivery-zip"
            hint={errors?.deliveryZip}
            hintTone="danger"
          >
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
        <FormField
          label={isDelivery ? t("dateDelivery") : t("datePickup")}
          htmlFor="checkout-delivery-date"
          hint={errors?.deliveryDate}
          hintTone="danger"
        >
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
          <legend className="block text-sm font-medium text-text">{t("timeWindow")}</legend>
          <div className="mt-2 grid gap-2">
            {windowOptions.map((windowOption) => (
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
          label={t("instructions")}
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
            placeholder={t("instructionsPlaceholder")}
          />
        </FormField>
      </div>
    </section>
  );
}
