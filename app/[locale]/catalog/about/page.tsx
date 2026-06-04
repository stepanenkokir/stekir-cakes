import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AboutHero } from "@/components/about/AboutHero";
import { CertificationsSection } from "@/components/about/CertificationsSection";
import { MeetTheBakerSection } from "@/components/about/MeetTheBakerSection";
import { OurStorySection } from "@/components/about/OurStorySection";
import { WhyChooseUsSection } from "@/components/about/WhyChooseUsSection";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { isLocale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "about" });

  return {
    title: t("hero.title"),
    description: t("story.subtitle"),
    openGraph: {
      title: `${t("hero.title")} — SteKir Cakes`,
      description: t("story.subtitle"),
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <main className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: tc("home"), href: "/" },
            { label: tc("ourCakes"), href: "/catalog" },
            { label: tc("about") },
          ]}
        />
      </div>

      <AboutHero />
      <OurStorySection />
      <WhyChooseUsSection />
      <MeetTheBakerSection />
      <CertificationsSection />
    </main>
  );
}
