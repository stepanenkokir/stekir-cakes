import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteImages } from "@/lib/images";

export async function MeetTheBakerSection() {
  const t = await getTranslations("about.baker");

  return (
    <section className="py-20" aria-labelledby="meet-the-baker-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="meet-the-baker-heading"
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card">
            <Image
              src={siteImages.bakerPortrait}
              alt={t("imageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="font-accent text-3xl text-primary">{t("name")}</p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wider text-text-muted">
              {t("role")}
            </p>
            <div className="mt-6 space-y-4 leading-relaxed text-text-muted">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
