import { StarRating } from "@/components/shared/StarRating";
import { getReviewStats } from "@/lib/data/reviews";
import { getLocale, getTranslations } from "next-intl/server";

export async function ReviewsSummary() {
  const locale = await getLocale();
  const t = await getTranslations("reviews");
  const { averageRating, totalReviews } = getReviewStats(locale);

  return (
    <div
      className="mb-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8"
      aria-label="Overall customer rating"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <StarRating rating={averageRating} size="lg" showValue />
        <div>
          <p className="font-display text-3xl font-semibold text-text sm:text-4xl">
            {averageRating.toFixed(1)}
            <span className="text-xl font-normal text-text-muted"> / 5</span>
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {totalReviews === 1
              ? t("basedOn", { count: totalReviews })
              : t("basedOnPlural", { count: totalReviews })}
          </p>
        </div>
      </div>
      <p className="max-w-md text-sm leading-relaxed text-text-muted">{t("trustNote")}</p>
    </div>
  );
}
