import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCakes } from "@/lib/data/cakes";
import { buildGalleryFilters } from "@/lib/data/gallery";
import { isLocale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "catalog" });

  return {
    title: t("galleryPage.title"),
    description: t("galleryPage.subtitle"),
  };
}

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "catalog" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const cakes = await getCakes(locale);
  const galleryFilters = buildGalleryFilters(cakes, locale);

  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tc("home"), href: "/" },
            { label: tc("ourCakes"), href: "/catalog" },
            { label: tc("gallery") },
          ]}
        />

        <SectionHeading
          title={t("galleryPage.title")}
          subtitle={t("galleryPage.subtitle")}
          align="left"
        />

        <GalleryGrid galleryFilters={galleryFilters} />
      </div>
    </main>
  );
}
