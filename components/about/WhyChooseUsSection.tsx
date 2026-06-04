import { Cake, Leaf, Ruler, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasonIcons = [Leaf, Cake, Ruler, Truck] as const;

export async function WhyChooseUsSection() {
  const t = await getTranslations("about.why");
  const items = t.raw("items") as Array<{ title: string; text: string }>;

  return (
    <section className="bg-surface py-20" aria-labelledby="why-choose-us-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="why-choose-us-heading"
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = reasonIcons[index] ?? Cake;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-bg p-8 shadow-soft transition-shadow duration-300 hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-text">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-text-muted">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
