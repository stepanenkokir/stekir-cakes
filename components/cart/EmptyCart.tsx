"use client";

import { CakeSlice } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function EmptyCart() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface shadow-card"
        aria-hidden="true"
      >
        <CakeSlice className="h-12 w-12 text-accent" strokeWidth={1.25} />
      </div>
      <h2 className="font-display text-2xl font-semibold text-text">{t("emptyTitle")}</h2>
      <p className="mt-3 text-text-muted">{t("emptyText")}</p>
      <Button href="/catalog" className="mt-8">
        {tc("browseOurCakes")}
      </Button>
    </div>
  );
}
