import "server-only";

import "server-only";

import { unstable_cache } from "next/cache";
import { CAKES_CACHE_TAG } from "@/lib/catalog/revalidate";
import type { Cake, CakePricing } from "@/lib/data/cake-types";
import {
  fetchActiveCakeRows,
  fetchActiveCakeSlugs,
  fetchAllCakeRows,
  fetchCakePricingMap,
  fetchCakeRowBySlug,
} from "@/lib/data/cakes-db";
import { seedCakeRows } from "@/lib/data/cakes-seed";
import { getStartingPrice, mapRowToCake } from "@/lib/data/cake-utils";

export type { Cake, CakeFormInput, CakePricing } from "@/lib/data/cake-types";
export { getStartingPrice } from "@/lib/data/cake-utils";

const getCachedActiveRows = unstable_cache(
  async () => {
    const rows = await fetchActiveCakeRows();
    return rows ?? seedCakeRows.filter((row) => row.is_active);
  },
  ["cakes-active-rows"],
  { tags: [CAKES_CACHE_TAG], revalidate: 3600 },
);

export async function getCakes(locale: string): Promise<Cake[]> {
  const rows = await getCachedActiveRows();
  return rows.map((row) => mapRowToCake(row, locale));
}

export async function getCakeBySlug(
  slug: string,
  locale: string,
  options?: { includeInactive?: boolean },
): Promise<Cake | undefined> {
  if (options?.includeInactive) {
    const row = await fetchCakeRowBySlug(slug, { includeInactive: true });
    if (!row) {
      const seed = seedCakeRows.find((item) => item.slug === slug);
      return seed ? mapRowToCake(seed, locale) : undefined;
    }
    return mapRowToCake(row, locale);
  }

  const cakes = await getCakes(locale);
  return cakes.find((cake) => cake.slug === slug);
}

export async function getRelatedCakes(slug: string, locale: string): Promise<Cake[]> {
  const cakes = await getCakes(locale);
  return cakes.filter((cake) => cake.slug !== slug);
}

export async function getCakeSlugs(options?: { activeOnly?: boolean }): Promise<string[]> {
  if (options?.activeOnly === false) {
    const rows = await fetchAllCakeRows();
    return (rows ?? seedCakeRows).map((row) => row.slug);
  }

  const slugs = await fetchActiveCakeSlugs();
  if (slugs) {
    return slugs;
  }

  return seedCakeRows
    .filter((row) => row.is_active)
    .map((row) => row.slug);
}

export async function getCakePricingBySlug(slug: string): Promise<CakePricing | null> {
  const pricingMap = await getCakePricingMap();
  return pricingMap?.get(slug) ?? getSeedPricing(slug);
}

async function getCakePricingMap(): Promise<Map<string, CakePricing> | null> {
  const map = await fetchCakePricingMap();
  if (map && map.size > 0) {
    return map;
  }

  return new Map(
    seedCakeRows
      .filter((row) => row.is_active)
      .map((row) => [
        row.slug,
        {
          slug: row.slug,
          pricePerPound: Number(row.price_per_pound),
          minWeight: Number(row.min_weight),
        },
      ]),
  );
}

function getSeedPricing(slug: string): CakePricing | null {
  const row = seedCakeRows.find((item) => item.slug === slug && item.is_active);
  if (!row) {
    return null;
  }

  return {
    slug: row.slug,
    pricePerPound: Number(row.price_per_pound),
    minWeight: Number(row.min_weight),
  };
}

export async function getCakeNameMap(locale: string): Promise<Record<string, string>> {
  const cakes = await getCakes(locale);
  return Object.fromEntries(cakes.map((cake) => [cake.slug, cake.name]));
}

export async function getAllCakesForAdmin(): Promise<Cake[]> {
  const rows = await fetchAllCakeRows();
  const source = rows ?? seedCakeRows;
  return source.map((row) => mapRowToCake(row, "en"));
}
