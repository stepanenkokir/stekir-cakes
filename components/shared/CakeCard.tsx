"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/cart/format";

type CakeCardProps = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  startingPrice: number;
  ctaLabel?: string;
};

export function CakeCard({
  slug,
  name,
  tagline,
  image,
  startingPrice,
  ctaLabel,
}: CakeCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tc = useTranslations("catalog");

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={tc("imageAlt", { name })}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="p-6">
        <h3 className="font-display text-2xl font-semibold text-text">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{tagline}</p>
        <p className="mt-4 font-medium text-primary-dark">
          {t("fromPrice", { price: formatCurrency(startingPrice, locale) })}
        </p>
        <div className="mt-5">
          <Button href={`/catalog/${slug}`} variant="ghost" size="sm">
            {ctaLabel ?? t("learnMore")}
          </Button>
        </div>
      </div>
    </article>
  );
}
