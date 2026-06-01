import { Star } from "lucide-react";

type ReviewCardProps = {
  quote: string;
  name: string;
  rating: number;
  occasion: string;
};

export function ReviewCard({ quote, name, rating, occasion }: ReviewCardProps) {
  return (
    <article className="flex h-full min-w-[280px] max-w-sm flex-col rounded-2xl border border-border bg-[#fff5eb] p-6 shadow-soft sm:min-w-[320px]">
      <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating
                ? "fill-accent text-accent"
                : "fill-border text-border"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-text">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="mt-6 border-t border-border/60 pt-4">
        <p className="font-medium text-text">{name}</p>
        <p className="mt-1 text-sm text-text-muted">{occasion}</p>
      </div>
    </article>
  );
}
