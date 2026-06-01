"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import type { GalleryImage } from "@/lib/data/gallery";

type GalleryLightboxProps = {
  images: GalleryImage[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const activeImage = images[activeIndex];
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < images.length - 1;

  const goPrevious = useCallback(() => {
    if (hasPrevious) {
      onNavigate(activeIndex - 1);
    }
  }, [activeIndex, hasPrevious, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) {
      onNavigate(activeIndex + 1);
    }
  }, [activeIndex, hasNext, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        goPrevious();
      } else if (event.key === "ArrowRight") {
        goNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [goNext, goPrevious, onClose]);

  if (!activeImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-text/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close gallery viewer"
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-white/80">
            {activeIndex + 1} of {images.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/20 shadow-card-hover sm:aspect-[16/10]">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 80vw"
            priority
          />

          {hasPrevious ? (
            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}

          {hasNext ? (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : null}
        </div>

        <p className="mt-4 text-center text-sm leading-relaxed text-white/90 sm:text-base">
          {activeImage.alt}
        </p>
      </div>
    </div>
  );
}
