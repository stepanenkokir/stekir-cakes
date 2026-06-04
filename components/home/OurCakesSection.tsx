import { CakeCard } from "@/components/shared/CakeCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCakes, getStartingPrice } from "@/lib/data/cakes";
import { getLocale, getTranslations } from "next-intl/server";

export async function OurCakesSection() {
  const locale = await getLocale();
  const t = await getTranslations("home.ourCakes");
  const cakes = getCakes(locale);

  return (
    <section className="bg-bg py-20" aria-labelledby="our-cakes-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="our-cakes-heading" title={t("title")} subtitle={t("subtitle")} />

        <div className="grid gap-8 md:grid-cols-2">
          {cakes.map((cake) => (
            <CakeCard
              key={cake.slug}
              slug={cake.slug}
              name={cake.name}
              tagline={cake.tagline}
              image={cake.image}
              startingPrice={getStartingPrice(cake)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
