import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CartPageContent } from "@/components/cart/CartPageContent";
import { isLocale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "cart" });

  return {
    title: t("pageTitle"),
    description: t("emptyText"),
    openGraph: {
      title: `${t("pageTitle")} — SteKir Cakes`,
      description: t("emptyText"),
    },
  };
}

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <main className="bg-bg">
      <CartPageContent />
    </main>
  );
}
