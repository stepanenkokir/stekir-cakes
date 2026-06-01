"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <Image
          src={activeImage}
          alt={alt}
          fill
          priority={activeIndex === 0}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>

      {images.length > 1 ? (
        <div className="flex gap-3" role="list" aria-label="Product image thumbnails">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              role="listitem"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                activeIndex === index
                  ? "border-primary shadow-soft"
                  : "border-border opacity-80 hover:border-primary/50 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
