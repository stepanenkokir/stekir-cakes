import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccessContent } from "@/components/order-success/OrderSuccessContent";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description:
    "Your custom cake order has been received. We'll reach out shortly to confirm details and arrange your 50% deposit.",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
