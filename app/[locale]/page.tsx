import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/home/CtaBanner";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { OurCakesSection } from "@/components/home/OurCakesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { TrustBar } from "@/components/home/TrustBar";
import { isLocale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "metadata" });

  return {
    title: t("defaultTitle"),
    description: t("defaultDescription"),
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
      <TrustBar />
      <OurCakesSection />
      <HowItWorksSection />
      <GalleryTeaser />
      <ReviewsSection />
      <CtaBanner />
    </main>
  );
}
