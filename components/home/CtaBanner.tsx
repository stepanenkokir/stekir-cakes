import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";

export async function CtaBanner() {
  const t = await getTranslations("home.cta");
  const tc = await getTranslations("common");

  return (
    <section className="bg-primary py-20" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="cta-heading"
          className="font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl"
        >
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
          {t("subtitle")}
        </p>
        <div className="mt-8">
          <Button href="/catalog" variant="inverse" size="lg">
            {tc("orderNow")}
          </Button>
        </div>
      </div>
    </section>
  );
}
