import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { CakeCard } from "@/components/shared/CakeCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cakes, getStartingPrice } from "@/lib/data/cakes";

export const metadata = {
  title: "Our Cakes",
  description:
    "Browse our handcrafted Eastern European cakes — Napoleon, Medovik, Smetannik, and Mannik. Custom sizes, made to order in Sacramento.",
};

export default function CatalogPage() {
  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Our Cakes" },
          ]}
        />

        <SectionHeading
          title="Our Cakes"
          subtitle="Classic Eastern European recipes, reimagined for every celebration"
          align="left"
        />

        <div className="grid gap-8 md:grid-cols-2">
          {cakes.map((cake) => (
            <CakeCard
              key={cake.slug}
              slug={cake.slug}
              name={cake.name}
              tagline={cake.tagline}
              image={cake.image}
              startingPrice={getStartingPrice(cake)}
              ctaLabel="Customize & Order"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
