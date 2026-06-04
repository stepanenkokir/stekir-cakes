import { reviewImagePath } from "@/lib/images";
import { getMessages } from "@/lib/i18n/messages";
import { intlLocale, isLocale, toLocale } from "@/lib/i18n/locale";

export type ReviewCakeSlug = "napoleon" | "medovik" | "smetannik" | "mannik";

export type ReviewFilter = "all" | ReviewCakeSlug;

export type Review = {
  id: string;
  quote: string;
  name: string;
  rating: number;
  occasion: string;
  cakeSlug: ReviewCakeSlug;
  date: string;
  photoUrl?: string;
};

const photoIds = new Set(["1", "5", "9"]);

const reviewMeta: Record<
  string,
  { rating: number; date: string }
> = {
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

export function getReviewFilters(locale: string) {
  const f = getMessages(toLocale(locale)).reviews.filters;
  return [
    { id: "all" as const, label: f.all },
    { id: "napoleon" as const, label: f.napoleon },
    { id: "medovik" as const, label: f.medovik },
    { id: "smetannik" as const, label: f.smetannik },
    { id: "mannik" as const, label: f.mannik },
  ];
}

export function getReviews(locale: string): Review[] {
  return getMessages(toLocale(locale)).reviews.items.map((item) => {
    const meta = reviewMeta[item.id] ?? { rating: 5, date: "2025-01-01" };
    return {
      ...item,
      ...meta,
      cakeSlug: item.cakeSlug as ReviewCakeSlug,
      photoUrl: photoIds.has(item.id) ? reviewImagePath(item.id) : undefined,
    };
  });
}

export function getReviewCakeName(slug: ReviewCakeSlug, locale: string): string {
  return getMessages(toLocale(locale)).cakes[slug].name;
}

export function filterReviews(filter: ReviewFilter, locale: string): Review[] {
  const reviews = getReviews(locale);
  if (filter === "all") return reviews;
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

/** @deprecated */
export const reviewFilters = getReviewFilters("en");
export const reviews = getReviews("en");
