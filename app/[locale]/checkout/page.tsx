import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { isLocale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "checkout" });

  return {
    title: t("pageTitle"),
    description: t("pageIntro"),
    openGraph: {
      title: `${t("pageTitle")} — SteKir Cakes`,
      description: t("pageIntro"),
    },
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <main className="bg-bg">
      <Suspense>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
