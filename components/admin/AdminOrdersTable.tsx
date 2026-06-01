"use client";

import { useMemo, useState } from "react";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";
import type { OrderItem, OrderStatus } from "@/lib/account/orders";

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "baking", label: "Baking" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export type AdminOrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  items: OrderItem[] | null;
  delivery_date: string;
  total: number;
  status: string;
  created_at: string;
};

type AdminOrdersTableProps = {
  initialOrders: AdminOrderRow[];
};

function getPrimaryItemName(items: OrderItem[] | null) {
  if (!items || items.length === 0) {
    return "Custom Cake";
  }
  return items[0]?.name ?? "Custom Cake";
}

export function AdminOrdersTable({ initialOrders }: AdminOrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return orders;
    }
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setError(null);
    setSavingId(orderId);

    const previous = orders;
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to update order status.");
      }
    } catch (updateError) {
      setOrders(previous);
      setError(updateError instanceof Error ? updateError.message : "Unable to update status.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <label htmlFor="admin-order-filter" className="text-sm text-text-muted">
          Filter by status
        </label>
        <select
          id="admin-order-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | OrderStatus)}
          className="rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border bg-bg/60 text-left text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Cake</th>
                <th className="px-4 py-3 font-medium">Delivery Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{order.order_number}</td>
                  <td className="px-4 py-3 text-text">{order.customer_name}</td>
                  <td className="px-4 py-3 text-text-muted">{getPrimaryItemName(order.items)}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {formatDeliveryDate(order.delivery_date)}
                  </td>
                  <td className="px-4 py-3 font-medium text-text">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
                      disabled={savingId === order.id}
                      className="rounded-lg border border-border bg-bg px-2 py-1.5 text-sm text-text disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
