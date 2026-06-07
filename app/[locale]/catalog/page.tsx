import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCakes } from "@/lib/data/cakes";
import { isLocale, type Locale } from "@/lib/i18n/locale";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return {
    title: t("catalogTitle"),
    description: t("catalogDescription"),
  };
}

export default async function CatalogPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "catalog" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const cakes = await getCakes(locale as Locale);

  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tc("home"), href: "/" },
            { label: tc("ourCakes") },
          ]}
        />

        <SectionHeading
          title={t("pageTitle")}
          subtitle={t("pageSubtitle")}
          align="left"
        />

        <CatalogGrid allCakes={cakes} />
      </div>
    </main>
  );
}
