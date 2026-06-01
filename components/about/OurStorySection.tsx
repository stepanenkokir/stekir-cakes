import { SectionHeading } from "@/components/ui/SectionHeading";

export function OurStorySection() {
  return (
    <section className="py-20" aria-labelledby="our-story-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="our-story-heading"
          title="From Our Kitchen to Yours"
          subtitle="A home bakery rooted in family tradition and California warmth"
          align="left"
        />

        <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-text-muted">
          <p>
            SteKir Cakes began in a Sacramento home kitchen, where weekend baking
            for family gatherings turned into something much bigger. What started
            as sharing Napoleon and Medovik with neighbors grew into a passion for
            bringing Eastern European baking traditions to California celebrations
            — one custom cake at a time.
          </p>
          <p>
            Every recipe we bake comes from generations of family hands: paper-thin
            pastry layers, honey-kissed sponges, and sour cream frostings made the
            way they were taught back home. We don&apos;t rush the process or cut
            corners — each cake is mixed, layered, and decorated fresh to order,
            so your birthday, anniversary, or holiday table gets something truly
            special.
          </p>
        </div>
      </div>
    </section>
  );
}
