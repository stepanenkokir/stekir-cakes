"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";

const STEPS = [
  {
    number: 1,
    icon: "📞",
    title: "We'll reach out soon",
    description:
      "You'll receive a text or call within a few hours to confirm your order details.",
  },
  {
    number: 2,
    icon: "💳",
    title: "Send your deposit",
    description:
      "A 50% deposit is required to confirm your order. We'll text you payment instructions.",
  },
  {
    number: 3,
    icon: "🎂",
    title: "Fresh delivery on your date",
    description:
      "Your cake will be baked fresh and delivered right to your door on the chosen date.",
  },
];

function CheckmarkAnimation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div
        className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-700 ease-out ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        style={{ background: "linear-gradient(135deg, #b5813a 0%, #d4a96a 100%)" }}
      >
        {/* Ripple rings */}
        <span
          className={`absolute inset-0 rounded-full transition-all duration-1000 ease-out ${
            visible ? "scale-150 opacity-0" : "scale-100 opacity-0"
          }`}
          style={{ background: "rgba(181,129,58,0.25)", animationDelay: "200ms" }}
        />
        <svg
          className={`h-12 w-12 text-white transition-all delay-300 duration-500 ${
            visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

export function OrderSuccessContent() {
  const params = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const firstName = params.get("name") ?? "Friend";
  const orderNumber = params.get("orderNumber") ?? "SAC-00001";
  const cakeName = params.get("cake") ?? "Custom Cake";
  const weightLbs = parseFloat(params.get("weight") ?? "0") || null;
  const deliveryDate = params.get("date") ?? null;
  const total = parseFloat(params.get("total") ?? "0") || null;
  const deposit = parseFloat(params.get("deposit") ?? "0") || null;
  const paymentMethod = params.get("paymentMethod") ?? null;
  const deliveryType = params.get("deliveryType") ?? "delivery";

  const paymentLabel: Record<string, string> = {
    zelle: "Zelle",
    venmo: "Venmo",
    cash: "Cash on Delivery",
  };

  return (
    <main className="min-h-screen bg-bg px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Animated checkmark */}
        <div className="mb-8 text-center">
          <CheckmarkAnimation />
        </div>

        {/* Heading */}
        <div
          className={`mb-10 text-center transition-all duration-700 delay-200 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
            Thank you, {firstName}!{" "}
            <span role="img" aria-label="cake">
              🎂
            </span>
          </h1>
          <p className="mt-3 text-lg text-text-muted">
            Your order has been received. We&rsquo;ll be in touch shortly.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium text-primary-dark shadow-soft">
            <span className="text-text-muted">Order number</span>
            <span className="font-bold tracking-wide">#{orderNumber}</span>
          </div>
        </div>

        {/* Order summary card */}
        <div
          className={`mb-8 rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-700 delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-text">
            Order Summary
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-text-muted">Cake</dt>
              <dd className="text-right font-medium text-text">{cakeName}</dd>
            </div>
            {weightLbs && (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">Weight</dt>
                <dd className="text-right font-medium text-text">{weightLbs} lbs</dd>
              </div>
            )}
            {deliveryDate && (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">
                  {deliveryType === "pickup" ? "Pickup date" : "Delivery date"}
                </dt>
                <dd className="text-right font-medium text-text">
                  {formatDeliveryDate(deliveryDate)}
                </dd>
              </div>
            )}
            {paymentMethod && (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">Payment method</dt>
                <dd className="text-right font-medium text-text">
                  {paymentLabel[paymentMethod] ?? paymentMethod}
                </dd>
              </div>
            )}

            {total !== null && (
              <>
                <div className="border-t border-border pt-3">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-text">Order total</dt>
                    <dd className="font-display text-xl font-bold tabular-nums text-primary-dark">
                      {formatCurrency(total)}
                    </dd>
                  </div>
                </div>
                {deposit !== null && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-text-muted">
                      Deposit due{" "}
                      <span className="text-xs">(50% to confirm)</span>
                    </dt>
                    <dd className="font-semibold tabular-nums text-primary">
                      {formatCurrency(deposit)}
                    </dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </div>

        {/* What happens next */}
        <div
          className={`mb-10 transition-all duration-700 delay-[400ms] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className="mb-5 font-display text-xl font-semibold text-text">
            What happens next?
          </h2>
          <ol className="space-y-4">
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="flex gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
                  {step.icon}
                </div>
                <div>
                  <p className="font-semibold text-text">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA buttons */}
        <div
          className={`flex flex-col items-center gap-3 sm:flex-row sm:justify-center transition-all duration-700 delay-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Button href="/account/orders" size="lg">
            View Order Status
          </Button>
          <Button href="/" variant="ghost" size="lg">
            Back to Home
          </Button>
        </div>

        {/* Warm note */}
        <p
          className={`mt-10 text-center text-sm italic text-text-muted transition-all duration-700 delay-[600ms] ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          Questions? Text or call us at{" "}
          <a
            href="tel:+19165550192"
            className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            (916) 555-0192
          </a>{" "}
          — we&rsquo;re happy to help.
        </p>
      </div>
    </main>
  );
}
