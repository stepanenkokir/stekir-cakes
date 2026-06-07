"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { useCart } from "@/lib/cart/CartProvider";
import { formatCurrency } from "@/lib/cart/format";
import { BAKERY_PHONE } from "@/lib/constants";
import type { Cake } from "@/lib/data/cake-types";

const WEIGHT_PRESETS = [2, 2.5, 3, 3.5, 4] as const;

type OrderConfiguratorProps = {
  cake: Cake;
};

function getMinDeliveryDate(noticeDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + noticeDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function OrderConfigurator({ cake }: OrderConfiguratorProps) {
  const locale = useLocale();
  const t = useTranslations("catalog.configurator");
  const tc = useTranslations("common");
  const { addItem } = useCart();
  const [weight, setWeight] = useState<number>(cake.minWeight);
  const [isCustomWeight, setIsCustomWeight] = useState(false);
  const [customWeight, setCustomWeight] = useState(String(cake.minWeight));
  const [tiers, setTiers] = useState(1);
  const [inscription, setInscription] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [decorationNotes, setDecorationNotes] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  const [minDeliveryDate, setMinDeliveryDate] = useState("");

  useEffect(() => {
    setMinDeliveryDate(getMinDeliveryDate(cake.noticeDays));
  }, [cake.noticeDays]);

  const effectiveWeight = isCustomWeight
    ? Math.max(cake.minWeight, Number.parseFloat(customWeight) || cake.minWeight)
    : weight;

  const totalPrice = effectiveWeight * cake.pricePerPound;

  const dayLabel = cake.noticeDays === 1 ? t("day") : t("days");

  const deliveryDateError = !deliveryDate
    ? t("selectDate", { days: cake.noticeDays, dayLabel })
    : minDeliveryDate && deliveryDate < minDeliveryDate
      ? t("dateAfter", { date: minDeliveryDate, days: cake.noticeDays, dayLabel })
      : "";

  const isDeliveryDateValid = !deliveryDateError;

  const handleWeightPreset = (preset: number) => {
    setIsCustomWeight(false);
    setWeight(preset);
  };

  const handleCustomWeightToggle = () => {
    setIsCustomWeight(true);
    setCustomWeight(String(weight));
  };

  const handleAddToCart = () => {
    if (!isDeliveryDateValid) {
      return;
    }

    addItem({
      slug: cake.slug,
      name: cake.name,
      weightLbs: effectiveWeight,
      tiers,
      inscription: inscription.trim(),
      decorationNotes: decorationNotes.trim(),
      deliveryDate,
      unitPrice: totalPrice,
    });

    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <aside className="rounded-2xl border border-border bg-surface p-6 shadow-card lg:sticky lg:top-24">
      <div className="mb-6 border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold text-text">{cake.name}</h1>
        <p className="mt-2 text-sm text-text-muted">{cake.servings}</p>
        <p className="mt-1 text-sm text-text-muted">{cake.prepTime}</p>
      </div>

      <div className="space-y-6">
        <FormField label={t("weight")} htmlFor="weight-custom">
          <div className="flex flex-wrap gap-2">
            {WEIGHT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleWeightPreset(preset)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  !isCustomWeight && weight === preset
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-bg text-text hover:border-primary"
                }`}
              >
                {t("weightPreset", { weight: preset })}
              </button>
            ))}
            <button
              type="button"
              onClick={handleCustomWeightToggle}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isCustomWeight
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-bg text-text hover:border-primary"
              }`}
            >
              {t("custom")}
            </button>
          </div>
          {isCustomWeight ? (
            <input
              id="weight-custom"
              type="number"
              min={cake.minWeight}
              step="0.5"
              value={customWeight}
              onChange={(event) => setCustomWeight(event.target.value)}
              className={formInputClassName("mt-2")}
              aria-label={t("customWeight")}
            />
          ) : null}
        </FormField>

        <FormField label={t("tiers")} htmlFor="tiers-1">
          <div className="flex gap-2">
            {[1, 2, 3].map((tier) => (
              <button
                key={tier}
                id={tier === 1 ? "tiers-1" : undefined}
                type="button"
                onClick={() => setTiers(tier)}
                className={`flex-1 rounded-full border py-2 text-sm font-medium transition-colors ${
                  tiers === tier
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-bg text-text hover:border-primary"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </FormField>

        <FormField
          label={t("inscription")}
          htmlFor="inscription"
          hint={t("inscriptionOptional")}
        >
          <input
            id="inscription"
            type="text"
            maxLength={40}
            value={inscription}
            onChange={(event) => setInscription(event.target.value)}
            placeholder={t("inscriptionPlaceholder")}
            className={formInputClassName()}
          />
        </FormField>

        <FormField
          label={t("deliveryDate")}
          htmlFor="delivery-date"
          hint={deliveryDateError || undefined}
          hintTone={deliveryDateError ? "danger" : "muted"}
        >
          <input
            id="delivery-date"
            type="date"
            min={minDeliveryDate}
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
            className={formInputClassName()}
            aria-invalid={deliveryDateError ? true : undefined}
          />
        </FormField>

        <FormField label={t("decorationNotes")} htmlFor="decoration-notes" hint={t("notesPlaceholder")}>
          <textarea
            id="decoration-notes"
            rows={3}
            value={decorationNotes}
            onChange={(event) => setDecorationNotes(event.target.value)}
            className={formInputClassName("resize-y")}
          />
        </FormField>

        <div className="rounded-xl bg-bg px-4 py-5 text-center">
          <p className="text-sm text-text-muted">{t("estimatedPrice")}</p>
          <p className="mt-1 font-display text-4xl font-semibold text-primary-dark">
            {formatCurrency(totalPrice, locale)}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {t("priceFormula", {
              weight: effectiveWeight,
              price: cake.pricePerPound,
            })}
          </p>
        </div>

        <p className="text-center text-xs text-text-muted">{t("deliveryFees")}</p>

        <Button
          type="button"
          className="w-full"
          disabled={!isDeliveryDateValid || isAdded}
          onClick={handleAddToCart}
        >
          {isAdded ? tc("addedToCart") : tc("addToCart")}
        </Button>

        <p className="text-center text-sm">
          <a
            href={`sms:${BAKERY_PHONE}`}
            className="text-primary-dark underline-offset-2 transition-colors hover:text-primary hover:underline"
          >
            {t("questionsText")}
          </a>
        </p>
      </div>
    </aside>
  );
}
