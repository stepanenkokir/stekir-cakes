import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { CakeTags } from "@/components/catalog/CakeTags";
import { OrderConfigurator } from "@/components/catalog/OrderConfigurator";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { CakeCard } from "@/components/shared/CakeCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routing } from "@/i18n/routing";
import {
  getCakeBySlug,
  getCakeSlugs,
  getRelatedCakes,
  getStartingPrice,
} from "@/lib/data/cakes";
import { isLocale, type Locale } from "@/lib/i18n/locale";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getCakeSlugs({ activeOnly: true });
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const cake = await getCakeBySlug(slug, loc);
  const t = await getTranslations({ locale: loc, namespace: "metadata" });

  if (!cake) {
    return { title: t("notFound") };
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
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const cake = await getCakeBySlug(slug, locale as Locale);
  const t = await getTranslations({ locale, namespace: "catalog" });
  const tc = await getTranslations({ locale, namespace: "common" });

  if (!cake) {
    notFound();
  }

  const relatedCakes = await getRelatedCakes(slug, locale as Locale);

  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tc("home"), href: "/" },
            { label: tc("ourCakes"), href: "/catalog" },
            { label: cake.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-6 lg:col-span-3">
            <ProductGallery
              images={cake.images}
              alt={t("imageAlt", { name: cake.name })}
            />

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
            {t("detailsSr")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <h3 className="font-display text-xl font-semibold text-text">
                {tc("ingredients")}
              </h3>
              <p className="mt-3 leading-relaxed text-text-muted">{cake.ingredients}</p>
            </article>
            <article className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <h3 className="font-display text-xl font-semibold text-text">
                {tc("storage")}
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
            title={t("youMightLove")}
            subtitle={t("relatedSubtitle")}
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
                ctaLabel={tc("customizeOrder")}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
