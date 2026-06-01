"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviews } from "@/lib/data/reviews";

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-surface py-20" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="reviews-heading"
            title="What Our Customers Say"
            subtitle="Real reviews from Sacramento-area celebrations"
            align="left"
            className="mb-0"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="rounded-full border border-border bg-bg p-2 text-text transition-colors hover:border-primary hover:text-primary-dark"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="rounded-full border border-border bg-bg p-2 text-text transition-colors hover:border-primary hover:text-primary-dark"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-10 flex gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {reviews.map((review) => (
            <div key={review.id} style={{ scrollSnapAlign: "start" }}>
              <ReviewCard
                quote={review.quote}
                name={review.name}
                rating={review.rating}
                occasion={review.occasion}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:justify-start">
          <Button href="/catalog/reviews" variant="ghost">
            Read All Reviews
          </Button>
        </div>
      </div>
    </section>
  );
}
