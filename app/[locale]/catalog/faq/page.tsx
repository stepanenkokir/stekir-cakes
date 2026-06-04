import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFaqCategories } from "@/lib/data/faq";
import { isLocale, type Locale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "faq" });

  return {
    title: t("pageTitle"),
    description: t("pageIntro"),
    openGraph: {
      title: `${t("pageTitle")} — SteKir Cakes`,
      description: t("pageIntro"),
    },
  };
}

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "faq" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const categories = getFaqCategories(locale as Locale);

  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tc("home"), href: "/" },
            { label: tc("ourCakes"), href: "/catalog" },
            { label: tc("faq") },
          ]}
        />

        <SectionHeading title={t("pageTitle")} subtitle={t("pageIntro")} align="left" />

        <FAQAccordion categories={categories} />

        <section className="mt-16 rounded-2xl border border-border bg-surface p-8 text-center shadow-card sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            {t("footerTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">{t("footerText")}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contacts">{tc("contactUs")}</Button>
            <Button href="/catalog" variant="ghost">
              {tc("browseCakes")}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
