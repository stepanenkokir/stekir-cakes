import { Award, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";

export async function CertificationsSection() {
  const t = await getTranslations("about.certs");
  const tc = await getTranslations("common");

  return (
    <section
      className="border-t border-border bg-surface py-20"
      aria-labelledby="certifications-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="certifications-heading"
            className="font-display text-3xl font-semibold text-text sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">{t("intro")}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-bg px-6 py-10 text-center shadow-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Award className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mt-5 font-display text-lg font-semibold text-text">{t("cottageTitle")}</p>
            <p className="mt-1 text-sm font-medium text-primary">{t("cottageSubtitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{t("cottageText")}</p>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-border bg-bg px-6 py-10 text-center shadow-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="mt-5 font-display text-lg font-semibold text-text">{t("insuredTitle")}</p>
            <p className="mt-1 text-sm font-medium text-primary">{t("insuredSubtitle")}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{t("insuredText")}</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button href="/catalog">{tc("browseOurCakes")}</Button>
        </div>
      </div>
    </section>
  );
}
