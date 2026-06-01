import { Star } from "lucide-react";

type StarRatingSize = "sm" | "md" | "lg";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: StarRatingSize;
  showValue?: boolean;
  className?: string;
};

const sizeClasses: Record<StarRatingSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  className = "",
}: StarRatingProps) {
  const rounded = Math.round(rating * 10) / 10;
  const starClass = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex gap-0.5"
        role="img"
        aria-label={`${rounded} out of ${max} stars`}
      >
        {Array.from({ length: max }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = !filled && index < rating;

          return (
            <Star
              key={index}
              className={`${starClass} ${
                filled || partial
                  ? "fill-accent text-accent"
                  : "fill-border text-border"
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {showValue ? (
        <span className="text-sm font-medium text-text">{rounded.toFixed(1)}</span>
      ) : null}
    </div>
  );
}
