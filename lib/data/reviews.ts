import { reviewImagePath } from "@/lib/images";
import { getMessages } from "@/lib/i18n/messages";
import { intlLocale, isLocale, toLocale } from "@/lib/i18n/locale";

export type ReviewFilter = "all" | string;

export type Review = {
  id: string;
  quote: string;
  name: string;
  rating: number;
  occasion: string;
  cakeSlug: string;
  date: string;
  photoUrl?: string;
};

const photoIds = new Set(["1", "5", "9"]);

const reviewMeta: Record<string, { rating: number; date: string }> = {
  "1": { rating: 5, date: "2025-04-12" },
  "2": { rating: 5, date: "2025-03-28" },
  "3": { rating: 5, date: "2025-03-15" },
  "4": { rating: 5, date: "2025-02-20" },
  "5": { rating: 5, date: "2025-01-08" },
  "6": { rating: 5, date: "2024-12-14" },
  "7": { rating: 5, date: "2024-11-22" },
  "8": { rating: 5, date: "2024-10-05" },
  "9": { rating: 5, date: "2024-09-18" },
  "10": { rating: 5, date: "2024-08-30" },
  "11": { rating: 5, date: "2024-07-12" },
  "12": { rating: 4, date: "2024-06-03" },
};

export function buildReviewFilters(
  cakes: Array<{ slug: string; name: string }>,
  locale: string,
) {
  const f = getMessages(toLocale(locale)).reviews.filters;
  return [
    { id: "all" as const, label: f.all },
    ...cakes.map((cake) => ({ id: cake.slug, label: cake.name })),
  ];
}

export function getReviews(locale: string): Review[] {
  return getMessages(toLocale(locale)).reviews.items.map((item) => {
    const meta = reviewMeta[item.id] ?? { rating: 5, date: "2025-01-01" };
    return {
      ...item,
      ...meta,
      cakeSlug: item.cakeSlug,
      photoUrl: photoIds.has(item.id) ? reviewImagePath(item.id) : undefined,
    };
  });
}

export function filterReviews(
  filter: ReviewFilter,
  locale: string,
  reviews = getReviews(locale),
): Review[] {
  if (filter === "all") {
    return reviews;
  }
  return reviews.filter((review) => review.cakeSlug === filter);
}

export function getReviewStats(locale: string) {
  const reviews = getReviews(locale);
  const total = reviews.length;
  const average =
    total === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / total;

  return {
    averageRating: Math.round(average * 10) / 10,
    totalReviews: total,
  };
}

export function formatReviewDate(isoDate: string, locale?: string): string {
  const loc = locale && isLocale(locale) ? locale : "en";
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString(intlLocale[loc], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** @deprecated Use buildReviewFilters(cakes, locale) */
export const reviewFilters = [{ id: "all" as const, label: "All" }];
export const reviews = getReviews("en");
