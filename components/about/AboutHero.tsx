import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { siteImages } from "@/lib/images";

export async function AboutHero() {
  const t = await getTranslations("about.hero");

  return (
    <section className="relative flex min-h-[55vh] items-end overflow-hidden sm:min-h-[60vh]">
      <Image
        src={siteImages.aboutHero}
        alt={t("imageAlt")}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/35 to-text/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="font-accent mb-3 text-2xl text-accent sm:text-3xl">{t("title")}</p>
        <h1 className="font-display max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          {t("subtitle")}
        </h1>
      </div>
    </section>
  );
}
