"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CakeCard } from "@/components/shared/CakeCard";
import {
  cakeMatchesOccasion,
  getOccasionFilters,
  type OccasionFilter,
} from "@/lib/data/catalog-filters";
import { getStartingPrice } from "@/lib/data/cake-utils";
import type { Cake } from "@/lib/data/cake-types";

type CatalogGridProps = {
  allCakes: Cake[];
};

export function CatalogGrid({ allCakes }: CatalogGridProps) {
  const locale = useLocale();
  const t = useTranslations("catalogFilters");
  const tc = useTranslations("common");
  const occasionFilters = useMemo(() => getOccasionFilters(locale), [locale]);
  const [activeFilter, setActiveFilter] = useState<OccasionFilter>("all");

  const filteredCakes = useMemo(
    () => allCakes.filter((cake) => cakeMatchesOccasion(cake.tags, activeFilter)),
    [allCakes, activeFilter],
  );

  return (
    <>
      <div
        className="mb-10 flex flex-wrap gap-2"
        role="tablist"
        aria-label={t("filterAria")}
      >
        {occasionFilters.map((filter) => {
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

      {filteredCakes.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface px-6 py-12 text-center text-text-muted">
          {t("noMatch")}
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filteredCakes.map((cake) => (
            <CakeCard
              key={cake.slug}
              slug={cake.slug}
              name={cake.name}
              tagline={cake.tagline}
              image={cake.image}
              startingPrice={getStartingPrice(cake)}
              ctaLabel={tc("customizeOrder")}
            />
          ))}
        </div>
      )}
    </>
  );
}
