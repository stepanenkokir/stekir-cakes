"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import {
  filterGalleryImages,
  getGalleryFilters,
  type GalleryFilter,
  type GalleryImage,
} from "@/lib/data/gallery";

const heightClasses: Record<GalleryImage["height"], string> = {
  short: "aspect-[4/3]",
  medium: "aspect-[3/4]",
  tall: "aspect-[2/3]",
};

export function GalleryGrid() {
  const locale = useLocale();
  const t = useTranslations("galleryFilters");
  const galleryFilters = useMemo(() => getGalleryFilters(locale), [locale]);
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = useMemo(
    () => filterGalleryImages(activeFilter, locale),
    [activeFilter, locale],
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const handleFilterChange = (filter: GalleryFilter) => {
    setActiveFilter(filter);
    setLightboxIndex(null);
  };

  return (
    <>
      <div
        className="mb-10 flex flex-wrap gap-2"
        role="tablist"
        aria-label={t("filterAria")}
      >
        {galleryFilters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleFilterChange(filter.id)}
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

      {filteredImages.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface px-6 py-12 text-center text-text-muted">
          {t("noPhotos")}
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-offset-4"
              aria-label={t("viewPhoto", { alt: image.alt })}
            >
              <div className={`relative w-full ${heightClasses[image.height]}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null ? (
        <GalleryLightbox
          images={filteredImages}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </>
  );
}
