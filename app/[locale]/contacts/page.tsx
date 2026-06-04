import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { ContactForm } from "@/components/contacts/ContactForm";
import { ContactInfo } from "@/components/contacts/ContactInfo";
import { DeliveryZoneMap } from "@/components/contacts/DeliveryZoneMap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isLocale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "contact" });

  return {
    title: t("pageTitle"),
    description: t("pageIntro"),
    openGraph: {
      title: `${t("pageTitle")} — SteKir Cakes`,
      description: t("pageIntro"),
    },
  };
}

export default async function ContactsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tc("home"), href: "/" },
            { label: tc("contact") },
          ]}
        />

        <SectionHeading title={t("pageTitle")} subtitle={t("pageIntro")} align="left" />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <ContactInfo />
          <ContactForm />
        </div>

        <DeliveryZoneMap />
      </div>
    </main>
  );
}
