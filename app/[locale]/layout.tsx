import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { SetHtmlLang } from "@/components/i18n/SetHtmlLang";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/lib/cart/CartProvider";
import { routing } from "@/i18n/routing";
import { htmlLang, openGraphLocale } from "@/lib/i18n/locale";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `/${loc}`]),
  );

  return {
    title: {
      default: t("defaultTitle"),
      template: t("template"),
    },
    description: t("defaultDescription"),
    openGraph: {
      title: t("defaultTitle"),
      description: t("ogDescription"),
      type: "website",
      locale: openGraphLocale[locale as keyof typeof openGraphLocale] ?? "en_US",
    },
    alternates: {
      languages,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const lang = htmlLang[locale as keyof typeof htmlLang] ?? locale;

  return (
    <>
      <SetHtmlLang lang={lang} />
      <NextIntlClientProvider messages={messages}>
        <CartProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </NextIntlClientProvider>
    </>
  );
}
