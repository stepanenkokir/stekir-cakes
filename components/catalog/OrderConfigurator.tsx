"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { useCart } from "@/lib/cart/CartProvider";
import { BAKERY_PHONE } from "@/lib/constants";
import type { Cake } from "@/lib/data/cakes";

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

  const noticeLabel = `${cake.noticeDays} ${cake.noticeDays === 1 ? "day" : "days"} notice required`;

  const deliveryDateError = !deliveryDate
    ? `Please select a delivery date (${noticeLabel}).`
    : minDeliveryDate && deliveryDate < minDeliveryDate
      ? `Please choose a date on or after ${minDeliveryDate} (${noticeLabel}).`
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
        <FormField label="Weight" htmlFor="weight-custom">
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
                {preset} lbs
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
              Custom
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
              aria-label="Custom weight in pounds"
            />
          ) : null}
        </FormField>

        <FormField label="Number of tiers" htmlFor="tiers-1">
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
          label="Inscription on cake"
          htmlFor="inscription"
          hint="Optional, max 40 characters"
        >
          <input
            id="inscription"
            type="text"
            maxLength={40}
            value={inscription}
            onChange={(event) => setInscription(event.target.value)}
            placeholder="Happy Birthday, Anna!"
            className={formInputClassName()}
          />
        </FormField>

        <FormField
          label="Preferred delivery date"
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

        <FormField
          label="Decoration notes"
          htmlFor="decoration-notes"
          hint="Any special wishes for decoration, flavors, or design?"
        >
          <textarea
            id="decoration-notes"
            rows={3}
            value={decorationNotes}
            onChange={(event) => setDecorationNotes(event.target.value)}
            className={formInputClassName("resize-y")}
          />
        </FormField>

        <div className="rounded-xl bg-bg px-4 py-5 text-center">
          <p className="text-sm text-text-muted">Estimated price</p>
          <p className="mt-1 font-display text-4xl font-semibold text-primary-dark">
            ${totalPrice.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {effectiveWeight} lbs × ${cake.pricePerPound}/lb
          </p>
        </div>

        <p className="text-center text-xs text-text-muted">
          Delivery: $10 within 15 miles | $20 up to 30 miles
        </p>

        <Button
          type="button"
          className="w-full"
          disabled={!isDeliveryDateValid || isAdded}
          onClick={handleAddToCart}
        >
          {isAdded ? "Added to Cart!" : "Add to Cart"}
        </Button>

        <p className="text-center text-sm">
          <a
            href={`sms:${BAKERY_PHONE}`}
            className="text-primary-dark underline-offset-2 transition-colors hover:text-primary hover:underline"
          >
            Questions? Text us
          </a>
        </p>
      </div>
    </aside>
  );
}
