import { reviewImagePath } from "@/lib/images";

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

export const reviewFilters: { id: ReviewFilter; label: string }[] = [
  { id: "all", label: "All Cakes" },
  { id: "napoleon", label: "Napoleon" },
  { id: "medovik", label: "Medovik" },
  { id: "smetannik", label: "Smetannik" },
  { id: "mannik", label: "Mannik" },
];

const cakeNames: Record<ReviewCakeSlug, string> = {
  napoleon: "Napoleon",
  medovik: "Medovik",
  smetannik: "Smetannik",
  mannik: "Mannik",
};

export function getReviewCakeName(slug: ReviewCakeSlug): string {
  return cakeNames[slug];
}

export const reviews: Review[] = [
  {
    id: "1",
    quote:
      "The Napoleon was absolutely stunning — flaky layers and the cream was divine. Our anniversary guests couldn't stop raving about it!",
    name: "Maria K.",
    rating: 5,
    occasion: "Anniversary cake",
    cakeSlug: "napoleon",
    date: "2025-04-12",
    photoUrl: reviewImagePath("1"),
  },
  {
    id: "2",
    quote:
      "Ordered a Medovik for my daughter's birthday and it was the hit of the party. So moist and not too sweet — exactly what we wanted.",
    name: "James T.",
    rating: 5,
    occasion: "Birthday cake",
    cakeSlug: "medovik",
    date: "2025-03-28",
  },
  {
    id: "3",
    quote:
      "Fresh, beautiful, and delivered right on time to Folsom. The Smetannik tasted like something from my grandmother's kitchen.",
    name: "Elena P.",
    rating: 5,
    occasion: "Family celebration",
    cakeSlug: "smetannik",
    date: "2025-03-15",
  },
  {
    id: "4",
    quote:
      "We get a Mannik every few months — it's our go-to for weekend gatherings. Light, tender, and always perfect.",
    name: "David R.",
    rating: 5,
    occasion: "Everyday treat",
    cakeSlug: "mannik",
    date: "2025-02-20",
  },
  {
    id: "5",
    quote:
      "Professional service from start to finish. They confirmed every detail by text and the cake looked even better in person.",
    name: "Sarah M.",
    rating: 5,
    occasion: "Holiday party",
    cakeSlug: "medovik",
    date: "2025-01-08",
    photoUrl: reviewImagePath("5"),
  },
  {
    id: "6",
    quote:
      "Best Napoleon I've had outside of Europe. The layers were impossibly thin and crisp. Worth every penny for our wedding anniversary.",
    name: "Olga V.",
    rating: 5,
    occasion: "Wedding anniversary",
    cakeSlug: "napoleon",
    date: "2024-12-14",
  },
  {
    id: "7",
    quote:
      "The Medovik was a showstopper at our office party. Several coworkers asked for the bakery's contact info the same day.",
    name: "Michael B.",
    rating: 5,
    occasion: "Office celebration",
    cakeSlug: "medovik",
    date: "2024-11-22",
  },
  {
    id: "8",
    quote:
      "Light, tangy, and not overly sweet — the Smetannik was perfect for our brunch gathering in Roseville.",
    name: "Jennifer L.",
    rating: 5,
    occasion: "Brunch gathering",
    cakeSlug: "smetannik",
    date: "2024-10-05",
  },
  {
    id: "9",
    quote:
      "My kids loved the Mannik! Great texture and just the right amount of sweetness. We'll definitely order again.",
    name: "Chris H.",
    rating: 5,
    occasion: "Kids' birthday",
    cakeSlug: "mannik",
    date: "2024-09-18",
    photoUrl: reviewImagePath("9"),
  },
  {
    id: "10",
    quote:
      "Delivered to Elk Grove on time and still perfectly chilled. The Napoleon held up beautifully for our family dinner.",
    name: "Nina S.",
    rating: 5,
    occasion: "Family dinner",
    cakeSlug: "napoleon",
    date: "2024-08-30",
  },
  {
    id: "11",
    quote:
      "Honey layers melted in your mouth. This Medovik reminded me of cakes from my childhood in Ukraine.",
    name: "Andrei M.",
    rating: 5,
    occasion: "Heritage celebration",
    cakeSlug: "medovik",
    date: "2024-07-12",
  },
  {
    id: "12",
    quote:
      "Ordered a 3 lb Smetannik for a baby shower — elegant, delicious, and beautifully presented. Highly recommend!",
    name: "Rachel W.",
    rating: 4,
    occasion: "Baby shower",
    cakeSlug: "smetannik",
    date: "2024-06-03",
  },
];

export function filterReviews(filter: ReviewFilter): Review[] {
  if (filter === "all") return reviews;
  return reviews.filter((review) => review.cakeSlug === filter);
}

export function getReviewStats() {
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

export function formatReviewDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
