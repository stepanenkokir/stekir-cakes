import type { Metadata } from "next";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { ContactForm } from "@/components/contacts/ContactForm";
import { ContactInfo } from "@/components/contacts/ContactInfo";
import { DeliveryZoneMap } from "@/components/contacts/DeliveryZoneMap";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with SteKir Cakes in Sacramento. Call, text, email, or send a message — we deliver custom cakes across the metro area.",
  openGraph: {
    title: "Contact Us — SteKir Cakes",
    description:
      "Phone, email, Instagram, and our delivery zone map. Reach out about custom cakes, weddings, and delivery to Sacramento suburbs.",
  },
};

export default function ContactsPage() {
  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Contact" },
          ]}
        />

        <SectionHeading
          title="Get in Touch"
          subtitle="We are here to help with custom orders, delivery questions, and special celebrations"
          align="left"
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <ContactInfo />
          <ContactForm />
        </div>

        <DeliveryZoneMap />
      </div>
    </main>
  );
}
