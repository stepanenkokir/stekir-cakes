"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

function CheckmarkAnimation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div
        className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-700 ease-out ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        style={{ background: "linear-gradient(135deg, #b5813a 0%, #d4a96a 100%)" }}
      >
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
  const locale = useLocale();
  const t = useTranslations("orderSuccess");
  const tc = useTranslations("common");
  const steps = useMemo(
    () => t.raw("steps") as Array<{ title: string; text: string }>,
    [t],
  );
  const stepIcons = ["📞", "💳", "🎂"];
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then((result) => {
      setIsAuthenticated(Boolean(result.data.session));
    });
  }, []);

  const firstName = params.get("name") ?? tc("friend");
  const orderNumber = params.get("orderNumber") ?? t("fallbackOrder");
  const cakeName = params.get("cake") ?? tc("customCake");
  const weightLbs = parseFloat(params.get("weight") ?? "0") || null;
  const deliveryDate = params.get("date") ?? null;
  const total = parseFloat(params.get("total") ?? "0") || null;
  const deposit = parseFloat(params.get("deposit") ?? "0") || null;
  const paymentMethod = params.get("paymentMethod") ?? null;
  const deliveryType = params.get("deliveryType") ?? "delivery";

  const paymentLabel: Record<string, string> = {
    zelle: tc("paymentZelle"),
    venmo: tc("paymentVenmo"),
    cash: tc("paymentCash"),
  };

  return (
    <main className="min-h-screen bg-bg px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <CheckmarkAnimation />
        </div>

        <div
          className={`mb-10 text-center transition-all duration-700 delay-200 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
            {t("thankYou", { name: firstName })}{" "}
            <span role="img" aria-label="cake">
              🎂
            </span>
          </h1>
          <p className="mt-3 text-lg text-text-muted">{t("received")}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium text-primary-dark shadow-soft">
            <span className="text-text-muted">{tc("orderNumber")}</span>
            <span className="font-bold tracking-wide">#{orderNumber}</span>
          </div>
        </div>

        <div
          className={`mb-8 rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-700 delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-text">
            {tc("orderSummary")}
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-text-muted">{tc("cake")}</dt>
              <dd className="text-right font-medium text-text">{cakeName}</dd>
            </div>
            {weightLbs ? (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">{tc("weight")}</dt>
                <dd className="text-right font-medium text-text">
                  {tc("lbs", { weight: weightLbs })}
                </dd>
              </div>
            ) : null}
            {deliveryDate ? (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">
                  {deliveryType === "pickup" ? t("pickupDate") : t("deliveryDate")}
                </dt>
                <dd className="text-right font-medium text-text">
                  {formatDeliveryDate(deliveryDate, locale)}
                </dd>
              </div>
            ) : null}
            {paymentMethod ? (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-text-muted">{tc("paymentMethod")}</dt>
                <dd className="text-right font-medium text-text">
                  {paymentLabel[paymentMethod] ?? paymentMethod}
                </dd>
              </div>
            ) : null}

            {total !== null ? (
              <>
                <div className="border-t border-border pt-3">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-text">{tc("total")}</dt>
                    <dd className="font-display text-xl font-bold tabular-nums text-primary-dark">
                      {formatCurrency(total, locale)}
                    </dd>
                  </div>
                </div>
                {deposit !== null ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-text-muted">{tc("depositConfirm")}</dt>
                    <dd className="font-semibold tabular-nums text-primary">
                      {formatCurrency(deposit, locale)}
                    </dd>
                  </div>
                ) : null}
              </>
            ) : null}
          </dl>
        </div>

        <div
          className={`mb-10 transition-all duration-700 delay-[400ms] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className="mb-5 font-display text-xl font-semibold text-text">{t("nextTitle")}</h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
                  {stepIcons[index] ?? "✓"}
                </div>
                <div>
                  <p className="font-semibold text-text">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div
          className={`flex flex-col items-center gap-3 transition-all duration-700 delay-500 sm:flex-row sm:justify-center ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {isAuthenticated ? (
            <Button href="/account/orders" size="lg">
              {tc("viewOrderStatus")}
            </Button>
          ) : (
            <Button href="/account/login?next=/account/orders" size="lg">
              {t("signInTrack")}
            </Button>
          )}
          <Button href="/" variant="ghost" size="lg">
            {tc("backToHome")}
          </Button>
        </div>

        <p
          className={`mt-10 text-center text-sm italic text-text-muted transition-all duration-700 delay-[600ms] ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          {t("questions")}
        </p>
      </div>
    </main>
  );
}
