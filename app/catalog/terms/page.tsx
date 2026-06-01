import type { Metadata } from "next";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { TermsContent } from "@/components/terms/TermsContent";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { termsSections } from "@/lib/data/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Order, delivery, payment, allergen, and liability policies for custom cake orders from SteKir Cakes in Sacramento, CA.",
  openGraph: {
    title: "Terms & Conditions — SteKir Cakes",
    description:
      "Read our policies on ordering, delivery zones, deposits, allergens, and liability before you place your cake order.",
  },
};

export default function TermsPage() {
  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Our Cakes", href: "/catalog" },
            { label: "Terms & Conditions" },
          ]}
        />

        <SectionHeading
          title="Terms & Conditions"
          subtitle="Please read these policies before placing an order. They govern how we accept, prepare, deliver, and bill for custom cakes."
          align="left"
        />

        <TermsContent sections={termsSections} />

        <section className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center shadow-card sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            Ready to order?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">
            Browse our catalog, customize your cake, and agree to these terms at checkout.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/catalog">Browse Cakes</Button>
            <Button href="/catalog/faq" variant="ghost">
              Read FAQ
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
