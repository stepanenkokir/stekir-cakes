"use client";

import { Star } from "lucide-react";

type StarRatingSize = "sm" | "md" | "lg";

type StarRatingDisplayProps = {
  mode?: "display";
  rating: number;
  max?: number;
  size?: StarRatingSize;
  showValue?: boolean;
  className?: string;
};

type StarRatingInputProps = {
  mode: "input";
  rating: number;
  max?: number;
  size?: StarRatingSize;
  className?: string;
  onChange: (rating: number) => void;
  "aria-label"?: string;
};

type StarRatingProps = StarRatingDisplayProps | StarRatingInputProps;

const sizeClasses: Record<StarRatingSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating(props: StarRatingProps) {
  const max = props.max ?? 5;
  const size = props.size ?? "md";
  const starClass = sizeClasses[size];
  const isInput = props.mode === "input";
  const rating = props.rating;
  const rounded = Math.round(rating * 10) / 10;

  if (isInput) {
    const label = props["aria-label"] ?? "Select star rating";

    return (
      <div
        className={`flex gap-1 ${props.className ?? ""}`}
        role="radiogroup"
        aria-label={label}
      >
        {Array.from({ length: max }).map((_, index) => {
          const value = index + 1;
          const filled = value <= rating;

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={filled}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              onClick={() => props.onChange(value)}
              className="rounded p-0.5 transition-colors hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Star
                className={`${starClass} ${
                  filled ? "fill-accent text-accent" : "fill-border text-border"
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${props.className ?? ""}`}>
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
      {props.showValue ? (
        <span className="text-sm font-medium text-text">{rounded.toFixed(1)}</span>
      ) : null}
    </div>
  );
}
