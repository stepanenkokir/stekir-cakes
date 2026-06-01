import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { CakeTags } from "@/components/catalog/CakeTags";
import { OrderConfigurator } from "@/components/catalog/OrderConfigurator";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { CakeCard } from "@/components/shared/CakeCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  cakes,
  getCakeBySlug,
  getRelatedCakes,
  getStartingPrice,
} from "@/lib/data/cakes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return cakes.map((cake) => ({ slug: cake.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cake = getCakeBySlug(slug);

  if (!cake) {
    return { title: "Cake Not Found" };
  }

  const description = cake.description.slice(0, 155);

  return {
    title: cake.name,
    description,
    openGraph: {
      title: `${cake.name} | SteKir Cakes`,
      description,
      images: [{ url: cake.images[0], alt: `${cake.name} cake` }],
    },
  };
}

export default async function CakeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cake = getCakeBySlug(slug);

  if (!cake) {
    notFound();
  }

  const relatedCakes = getRelatedCakes(slug);

  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Our Cakes", href: "/catalog" },
            { label: cake.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-6 lg:col-span-3">
            <ProductGallery images={cake.images} alt={`${cake.name} cake`} />

            <div className="space-y-4 lg:hidden">
              <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">
                {cake.name}
              </h1>
              <p className="text-lg text-primary-dark">{cake.tagline}</p>
              <CakeTags tags={cake.tags} />
            </div>

            <div className="space-y-4">
              <div className="hidden lg:block">
                <h1 className="font-display text-4xl font-semibold text-text">
                  {cake.name}
                </h1>
                <p className="mt-2 text-lg text-primary-dark">{cake.tagline}</p>
                <div className="mt-4">
                  <CakeTags tags={cake.tags} />
                </div>
              </div>

              <p className="text-base leading-relaxed text-text-muted">
                {cake.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <OrderConfigurator cake={cake} />
          </div>
        </div>

        <section className="mt-16 lg:mt-24" aria-labelledby="cake-details-heading">
          <h2 id="cake-details-heading" className="sr-only">
            Cake details
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <h3 className="font-display text-xl font-semibold text-text">
                Ingredients
              </h3>
              <p className="mt-3 leading-relaxed text-text-muted">{cake.ingredients}</p>
            </article>
            <article className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <h3 className="font-display text-xl font-semibold text-text">
                Storage
              </h3>
              <p className="mt-3 leading-relaxed text-text-muted">
                {cake.storageInstructions}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16 lg:mt-24" aria-labelledby="related-cakes-heading">
          <SectionHeading
            id="related-cakes-heading"
            title="You Might Also Love"
            subtitle="Explore more of our handcrafted favorites"
            align="left"
            className="mb-8"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {relatedCakes.map((related) => (
              <CakeCard
                key={related.slug}
                slug={related.slug}
                name={related.name}
                tagline={related.tagline}
                image={related.image}
                startingPrice={getStartingPrice(related)}
                ctaLabel="Customize & Order"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
