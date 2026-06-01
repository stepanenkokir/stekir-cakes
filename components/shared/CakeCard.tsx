import Image from "next/image";
import { Button } from "@/components/ui/Button";

type CakeCardProps = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  startingPrice: number;
  ctaLabel?: string;
};

export function CakeCard({
  slug,
  name,
  tagline,
  image,
  startingPrice,
  ctaLabel = "Learn More",
}: CakeCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={`${name} cake`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="p-6">
        <h3 className="font-display text-2xl font-semibold text-text">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{tagline}</p>
        <p className="mt-4 font-medium text-primary-dark">
          From ${startingPrice.toFixed(0)}
        </p>
        <div className="mt-5">
          <Button href={`/catalog/${slug}`} variant="ghost" size="sm">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}
