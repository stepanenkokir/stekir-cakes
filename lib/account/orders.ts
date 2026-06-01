export const ORDER_STATUS_STEPS = [
  "pending",
  "confirmed",
  "baking",
  "out_for_delivery",
  "delivered",
] as const;

export type OrderStatus = (typeof ORDER_STATUS_STEPS)[number] | "cancelled";

type StatusPresentation = {
  label: string;
  className: string;
};

export function getOrderStatusPresentation(status: string): StatusPresentation {
  const normalized = status.toLowerCase();

  const map: Record<OrderStatus, StatusPresentation> = {
    pending: {
      label: "Pending",
      className: "bg-amber-100 text-amber-800",
    },
    confirmed: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-800",
    },
    baking: {
      label: "Baking",
      className: "bg-orange-100 text-orange-800",
    },
    out_for_delivery: {
      label: "Out for Delivery",
      className: "bg-indigo-100 text-indigo-800",
    },
    delivered: {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-800",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800",
    },
  };

  return map[normalized as OrderStatus] ?? map.pending;
}

export function getOrderStatusIndex(status: string): number {
  const normalized = status.toLowerCase();
  const index = ORDER_STATUS_STEPS.findIndex((value) => value === normalized);
  return index >= 0 ? index : 0;
}

export type OrderItem = {
  slug?: string;
  name?: string;
  weight_lbs?: number;
  tiers?: number;
  inscription?: string;
  decoration_notes?: string;
  unit_price?: number;
  subtotal?: number;
};
