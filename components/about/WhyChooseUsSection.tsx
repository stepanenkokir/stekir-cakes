import { Cake, Leaf, Ruler, Truck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: Leaf,
    title: "Fresh Daily",
    description:
      "Every cake is baked to order — never pulled from a freezer or sitting on a shelf.",
  },
  {
    icon: Cake,
    title: "No Preservatives",
    description:
      "Simple, honest ingredients you can pronounce. Real butter, eggs, honey, and cream.",
  },
  {
    icon: Ruler,
    title: "Custom Sizes",
    description:
      "From intimate gatherings to large celebrations — choose the weight and tiers that fit your event.",
  },
  {
    icon: Truck,
    title: "Local Delivery",
    description:
      "We deliver across Sacramento and surrounding suburbs, fresh to your door on your chosen date.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-surface py-20" aria-labelledby="why-choose-us-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="why-choose-us-heading"
          title="Why Choose Us"
          subtitle="Small-batch baking with big-hearted service"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-bg p-8 shadow-soft transition-shadow duration-300 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-text">{title}</h3>
              <p className="mt-3 leading-relaxed text-text-muted">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
