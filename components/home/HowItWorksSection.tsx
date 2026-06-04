import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTranslations } from "next-intl/server";

export async function HowItWorksSection() {
  const t = await getTranslations("home.howItWorks");
  const steps = t.raw("steps") as Array<{ title: string; text: string }>;

  return (
    <section
      id="how-it-works"
      className="bg-surface py-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="how-it-works-heading" title={t("title")} subtitle={t("subtitle")} />

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="relative rounded-2xl border border-border bg-bg p-8 shadow-soft"
            >
              {index < steps.length - 1 ? (
                <div
                  className="absolute right-0 top-1/2 hidden h-px w-8 translate-x-full bg-border md:block"
                  aria-hidden="true"
                />
              ) : null}

              <span className="font-display text-4xl font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-text">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-text-muted">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
