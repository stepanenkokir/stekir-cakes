import type { Metadata } from "next";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqCategories } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about ordering custom cakes, delivery zones around Sacramento, payment, allergens, and storage for SteKir Cakes.",
  openGraph: {
    title: "Frequently Asked Questions — SteKir Cakes",
    description:
      "How far in advance to order, delivery fees, payment options, and everything else you need to know.",
  },
};

export default function FaqPage() {
  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Our Cakes", href: "/catalog" },
            { label: "FAQ" },
          ]}
        />

        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about ordering, delivery, payment, and caring for your cake"
          align="left"
        />

        <FAQAccordion categories={faqCategories} />

        <section className="mt-16 rounded-2xl border border-border bg-surface p-8 text-center shadow-card sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            Still have questions?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">
            We are happy to help with custom requests, wedding inquiries, or anything not covered
            here.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contacts">Contact Us</Button>
            <Button href="/catalog" variant="ghost">
              Browse Cakes
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
