"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { StarRating } from "@/components/shared/StarRating";
import { formatReviewDate } from "@/lib/data/reviews";

type ReviewCardProps = {
  quote: string;
  name: string;
  rating: number;
  occasion: string;
  variant?: "carousel" | "grid";
  cakeSlug?: string;
  cakeName?: string;
  date?: string;
  photoUrl?: string;
};

export function ReviewCard({
  quote,
  name,
  rating,
  occasion,
  variant = "carousel",
  cakeSlug,
  cakeName,
  date,
  photoUrl,
}: ReviewCardProps) {
  const locale = useLocale();
  const t = useTranslations("reviews");
  const isGrid = variant === "grid";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-[#fff5eb] shadow-soft ${
        isGrid
          ? "w-full transition-all hover:-translate-y-1 hover:shadow-card-hover"
          : "min-w-[280px] max-w-sm sm:min-w-[320px]"
      }`}
    >
      {photoUrl ? (
        <div className={`relative w-full ${isGrid ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          <Image
            src={photoUrl}
            alt={t("photoBy", { name })}
            fill
            className="object-cover"
            sizes={isGrid ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" : "320px"}
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <StarRating rating={rating} size="sm" />

        <blockquote className="mt-4 flex-1 text-base leading-relaxed text-text">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div className="mt-6 border-t border-border/60 pt-4">
          <p className="font-medium text-text">{name}</p>
          {date ? (
            <p className="mt-0.5 text-xs text-text-muted">{formatReviewDate(date, locale)}</p>
          ) : null}
          <p className="mt-1 text-sm text-text-muted">{occasion}</p>
          {cakeSlug && isGrid ? (
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-primary-dark">
              {cakeName ?? cakeSlug}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
