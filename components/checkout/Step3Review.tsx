"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";
import type { CartItem } from "@/lib/cart/types";
import type { DeliveryType } from "@/components/checkout/Step2Delivery";

export type PaymentMethod = "zelle" | "venmo" | "cash";

type Step3ReviewProps = {
  items: CartItem[];
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  agreeToTerms: boolean;
  subtotal: number;
  deliveryFee: number;
  total: number;
  depositAmount: number;
  termsError?: string;
  paymentError?: string;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onAgreeChange: (checked: boolean) => void;
};

export function Step3Review({
  items,
  deliveryType,
  paymentMethod,
  agreeToTerms,
  subtotal,
  deliveryFee,
  total,
  depositAmount,
  termsError,
  paymentError,
  onPaymentMethodChange,
  onAgreeChange,
}: Step3ReviewProps) {
  const locale = useLocale();
  const t = useTranslations("checkout.step3");
  const tc = useTranslations("common");

  const paymentOptions = [
    { id: "zelle" as const, label: tc("paymentZelle") },
    { id: "venmo" as const, label: tc("paymentVenmo") },
    { id: "cash" as const, label: tc("paymentCash") },
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-text">{t("title")}</h2>
      <p className="mt-2 text-sm text-text-muted">{t("intro")}</p>

      <div className="mt-6 rounded-xl border border-border bg-bg p-4">
        <h3 className="font-medium text-text">{tc("orderSummary")}</h3>
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-text">{item.name}</p>
                <p className="text-text-muted">
                  {t("lineItem", {
                    weight: item.weightLbs,
                    tiers: item.tiers,
                    tierLabel: item.tiers > 1 ? tc("tiers") : tc("tier"),
                    inscription: item.inscription || "—",
                  })}
                </p>
                <p className="text-text-muted">
                  {t("lineDate", {
                    type: deliveryType === "pickup" ? tc("pickup") : tc("delivery"),
                    date: formatDeliveryDate(item.deliveryDate, locale),
                  })}
                </p>
              </div>
              <span className="font-semibold tabular-nums text-text">
                {formatCurrency(item.unitPrice * item.quantity, locale)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-muted">{tc("subtotal")}</dt>
            <dd className="tabular-nums text-text">{formatCurrency(subtotal, locale)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-muted">{tc("deliveryFee")}</dt>
            <dd className="tabular-nums text-text">{formatCurrency(deliveryFee, locale)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
            <dt className="font-medium text-text">{tc("total")}</dt>
            <dd className="font-display text-xl font-semibold tabular-nums text-primary-dark">
              {formatCurrency(total, locale)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-muted">{tc("depositPercent")}</dt>
            <dd className="font-semibold tabular-nums text-primary">
              {formatCurrency(depositAmount, locale)}
            </dd>
          </div>
        </dl>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-text">{tc("paymentMethod")}</legend>
        <div className="mt-3 grid gap-2">
          {paymentOptions.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm text-text">
              <input
                type="radio"
                name="payment-method"
                value={option.id}
                checked={paymentMethod === option.id}
                onChange={() => onPaymentMethodChange(option.id)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {paymentError ? <p className="mt-2 text-xs text-red-600">{paymentError}</p> : null}
      </fieldset>

      <p className="mt-5 rounded-xl border border-border bg-bg p-3 text-sm text-text-muted">
        {t("depositNote", { amount: formatCurrency(depositAmount, locale) })}
      </p>

      <div className="mt-6">
        <label className="flex items-start gap-3 text-sm text-text">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(event) => onAgreeChange(event.target.checked)}
            className="mt-1"
          />
          <span>{t("agreeTerms")}</span>
        </label>
        {termsError ? <p className="mt-2 text-xs text-red-600">{termsError}</p> : null}
      </div>
    </section>
  );
}
