import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AccountForgotPasswordForm } from "@/components/account/AccountForgotPasswordForm";
import { isLocale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "account.forgotPassword" });

  return {
    title: t("title"),
    description: t("intro"),
  };
}

export default async function AccountForgotPasswordPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <Suspense>
      <AccountForgotPasswordForm />
    </Suspense>
  );
}
