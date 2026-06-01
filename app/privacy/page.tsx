import type { Metadata } from "next";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { privacySections } from "@/lib/data/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SteKir Cakes collects, uses, and protects your personal information when you order custom cakes in Sacramento, CA.",
  openGraph: {
    title: "Privacy Policy — SteKir Cakes",
    description:
      "Learn what data we collect, how we use it for orders and notifications, and how to request deletion of your information.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy" },
          ]}
        />

        <SectionHeading
          title="Privacy Policy"
          subtitle="How we handle your personal information when you browse, order, or create an account with SteKir Cakes"
          align="left"
        />

        <PrivacyContent sections={privacySections} />

        <section className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center shadow-card sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            Questions about your data?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">
            Email us to request access, correction, or deletion of your personal information.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="mailto:hello@stekircakes.com">Email Us</Button>
            <Button href="/catalog/terms" variant="ghost">
              Read Terms
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
