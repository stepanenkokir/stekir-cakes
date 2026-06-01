import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review your custom cake order before checkout. Adjust quantities, see your total, and proceed to delivery details.",
  openGraph: {
    title: "Your Cart — SteKir Cakes",
    description:
      "Review customized cakes, estimated delivery, and total before placing your Sacramento area order.",
  },
};

export default function CartPage() {
  return (
    <main className="bg-bg">
      <CartPageContent />
    </main>
  );
}
