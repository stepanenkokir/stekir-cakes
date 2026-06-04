import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your SteKir Cakes order: contact details, delivery preferences, and payment method.",
  openGraph: {
    title: "Checkout — SteKir Cakes",
    description:
      "Finish your custom cake order in three steps and receive confirmation from our bakery team.",
  },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="bg-bg">
      <Suspense>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
