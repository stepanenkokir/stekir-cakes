import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPrivacyContent } from "@/lib/data/privacy";
import { isLocale, type Locale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "privacy" });

  return {
    title: t("pageTitle"),
    description: t("pageIntro"),
    openGraph: {
      title: `${t("pageTitle")} — SteKir Cakes`,
      description: t("pageIntro"),
    },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "privacy" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const { sections } = getPrivacyContent(locale as Locale);

  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tc("home"), href: "/" },
            { label: tc("privacyPolicy") },
          ]}
        />

        <SectionHeading title={t("pageTitle")} subtitle={t("pageIntro")} align="left" />

        <PrivacyContent sections={sections} />

        <section className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center shadow-card sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            {t("footerCtaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">{t("footerCtaText")}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="mailto:hello@stekircakes.com">{t("emailUs")}</Button>
            <Button href="/catalog/terms" variant="ghost">
              {tc("readTerms")}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
