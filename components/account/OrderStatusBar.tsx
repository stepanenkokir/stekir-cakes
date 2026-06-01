import { ORDER_STATUS_STEPS, getOrderStatusIndex, type OrderStatus } from "@/lib/account/orders";

type OrderStatusBarProps = {
  status: string;
};

const STEP_LABELS: Record<(typeof ORDER_STATUS_STEPS)[number], string> = {
  pending: "Order Received",
  confirmed: "Confirmed",
  baking: "Baking",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export function OrderStatusBar({ status }: OrderStatusBarProps) {
  const normalized = status.toLowerCase() as OrderStatus;

  if (normalized === "cancelled") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="font-medium text-red-700">This order has been cancelled.</p>
      </div>
    );
  }

  const activeIndex = getOrderStatusIndex(status);

  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {ORDER_STATUS_STEPS.map((step, index) => {
        const isCompleted = index <= activeIndex;

        return (
          <li key={step} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                isCompleted ? "bg-primary text-white" : "bg-bg text-text-muted"
              }`}
            >
              {index + 1}
            </span>
            <span className={isCompleted ? "text-sm font-medium text-text" : "text-sm text-text-muted"}>
              {STEP_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
