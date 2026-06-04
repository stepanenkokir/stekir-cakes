"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ReviewCard } from "@/components/shared/ReviewCard";
import {
  filterReviews,
  getReviewFilters,
  type ReviewFilter,
} from "@/lib/data/reviews";

export function ReviewsGrid() {
  const locale = useLocale();
  const t = useTranslations("reviews");
  const reviewFilters = useMemo(() => getReviewFilters(locale), [locale]);
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");

  const filteredReviews = useMemo(
    () => filterReviews(activeFilter, locale),
    [activeFilter, locale],
  );

  return (
    <>
      <div
        className="mb-10 flex flex-wrap gap-2"
        role="tablist"
        aria-label={t("pageTitle")}
      >
        {reviewFilters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "border border-border bg-surface text-text-muted hover:border-primary hover:text-primary-dark"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filteredReviews.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface px-6 py-12 text-center text-text-muted">
          {t("noReviews")}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              variant="grid"
              quote={review.quote}
              name={review.name}
              rating={review.rating}
              occasion={review.occasion}
              cakeSlug={review.cakeSlug}
              date={review.date}
              photoUrl={review.photoUrl}
            />
          ))}
        </div>
      )}
    </>
  );
}
