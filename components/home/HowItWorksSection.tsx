import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Choose & Customize",
    description:
      "Pick your cake, size, and add a personal message for the perfect celebration.",
  },
  {
    number: "02",
    title: "We Confirm & Bake",
    description:
      "We'll call or text to confirm details and bake fresh to order just for you.",
  },
  {
    number: "03",
    title: "Fresh Delivery",
    description:
      "Delivered to your door in Sacramento and surrounding areas on your chosen date.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-surface py-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="how-it-works-heading"
          title="How It Works" subtitle="Three simple steps to your perfect cake" />

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="relative rounded-2xl border border-border bg-bg p-8 shadow-soft"
            >
              {index < steps.length - 1 ? (
                <div
                  className="absolute right-0 top-1/2 hidden h-px w-8 translate-x-full bg-border md:block"
                  aria-hidden="true"
                />
              ) : null}

              <span className="font-display text-4xl font-semibold text-accent">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-text-muted">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
