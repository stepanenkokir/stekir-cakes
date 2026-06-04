"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { CartItem } from "@/components/cart/CartItem";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCart } from "@/lib/cart/CartProvider";
import { formatCurrency } from "@/lib/cart/format";
import { ESTIMATED_DELIVERY_FEE } from "@/lib/constants";

export function CartPageContent() {
  const locale = useLocale();
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 h-5 w-48 animate-pulse rounded bg-border/60" />
        <div className="mb-12 h-10 w-64 animate-pulse rounded bg-border/60" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-40 animate-pulse rounded-2xl bg-border/40" />
            <div className="h-40 animate-pulse rounded-2xl bg-border/40" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-border/40" />
        </div>
      </div>
    );
  }

  const estimatedTotal = subtotal + ESTIMATED_DELIVERY_FEE;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <Breadcrumb
        items={[
          { label: tc("home"), href: "/" },
          { label: tc("cart") },
        ]}
      />

      <SectionHeading
        title={t("pageTitle")}
        subtitle={
          items.length > 0
            ? items.length === 1
              ? t("readySingle", { count: items.length })
              : t("readyPlural", { count: items.length })
            : undefined
        }
        align="left"
      />

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-semibold text-text">{t("summaryTitle")}</h2>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-text-muted">{tc("subtotal")}</dt>
                  <dd className="font-medium tabular-nums text-text">
                    {formatCurrency(subtotal, locale)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-muted">{tc("estDelivery")}</dt>
                  <dd className="font-medium tabular-nums text-text">
                    {formatCurrency(ESTIMATED_DELIVERY_FEE, locale)}
                  </dd>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-text">{tc("estimatedTotal")}</dt>
                    <dd className="font-display text-xl font-semibold tabular-nums text-primary-dark">
                      {formatCurrency(estimatedTotal, locale)}
                    </dd>
                  </div>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-text-muted">{t("deliveryNote")}</p>

              <div className="mt-6 space-y-3">
                <Button href="/checkout" className="w-full">
                  {tc("proceedCheckout")}
                </Button>
                <Button href="/catalog" variant="ghost" className="w-full">
                  {tc("continueShopping")}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
