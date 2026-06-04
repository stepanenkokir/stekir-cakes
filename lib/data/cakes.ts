import { catalogImagePath } from "@/lib/images";
import { getMessages } from "@/lib/i18n/messages";
import { toLocale } from "@/lib/i18n/locale";

export type Cake = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string;
  pricePerPound: number;
  minWeight: number;
  servings: string;
  prepTime: string;
  noticeDays: number;
  image: string;
  images: string[];
  storageInstructions: string;
  tags: string[];
};

const cakeMeta = [
  { slug: "napoleon", pricePerPound: 14, minWeight: 2, noticeDays: 3 },
  { slug: "medovik", pricePerPound: 13, minWeight: 2, noticeDays: 3 },
  { slug: "smetannik", pricePerPound: 12, minWeight: 2, noticeDays: 2 },
  { slug: "mannik", pricePerPound: 11, minWeight: 1.5, noticeDays: 2 },
] as const;

function buildCake(
  slug: (typeof cakeMeta)[number]["slug"],
  meta: (typeof cakeMeta)[number],
  locale: string,
): Cake {
  const messages = getMessages(toLocale(locale));
  const content = messages.cakes[slug as keyof typeof messages.cakes];

  return {
    slug,
    name: content.name,
    tagline: content.tagline,
    description: content.description,
    ingredients: content.ingredients,
    servings: content.servings,
    prepTime: content.prepTime,
    storageInstructions: content.storageInstructions,
    tags: content.tags,
    pricePerPound: meta.pricePerPound,
    minWeight: meta.minWeight,
    noticeDays: meta.noticeDays,
    image: catalogImagePath(slug, 1),
    images: [catalogImagePath(slug, 1), catalogImagePath(slug, 2)],
  };
}

export function getCakes(locale: string): Cake[] {
  return cakeMeta.map((meta) => buildCake(meta.slug, meta, locale));
}

export function getStartingPrice(cake: Cake): number {
  return cake.minWeight * cake.pricePerPound;
}

export function getCakeBySlug(slug: string, locale: string): Cake | undefined {
  return getCakes(locale).find((cake) => cake.slug === slug);
}

export function getRelatedCakes(slug: string, locale: string): Cake[] {
  return getCakes(locale).filter((cake) => cake.slug !== slug);
}

/** @deprecated Use getCakes(locale) */
export const cakes = getCakes("en");
