import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTranslations } from "next-intl/server";

export async function OurStorySection() {
  const t = await getTranslations("about.story");

  return (
    <section className="py-20" aria-labelledby="our-story-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="our-story-heading"
          title={t("title")}
          subtitle={t("subtitle")}
          align="left"
        />

        <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-text-muted">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
        </div>
      </div>
    </section>
  );
}
