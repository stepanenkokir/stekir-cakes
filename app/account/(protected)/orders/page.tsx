import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";
import { getOrderStatusPresentation, type OrderItem } from "@/lib/account/orders";

type OrderRow = {
  id: string;
  order_number: string;
  items: OrderItem[] | null;
  delivery_date: string;
  total: number;
  status: string;
};

function getOrderPrimaryItem(items: OrderItem[] | null): OrderItem | null {
  if (!items || items.length === 0) {
    return null;
  }

  return items[0] ?? null;
}

export default async function AccountOrdersPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: orders = [] } = await supabase
    .from("orders")
    .select("id, order_number, items, delivery_date, total, status")
    .eq("user_id", user.id)
    .order("delivery_date", { ascending: false })
    .returns<OrderRow[]>();

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-soft">
        <h2 className="font-display text-2xl text-text">No orders yet</h2>
        <p className="mt-2 text-text-muted">
          Once you place your first cake order, your history will appear here.
        </p>
        <Link
          href="/catalog"
          className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Browse Cakes
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-bg/60 text-left text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Cake</th>
              <th className="px-4 py-3 font-medium">Weight</th>
              <th className="px-4 py-3 font-medium">Delivery Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const firstItem = getOrderPrimaryItem(order.items);
              const status = getOrderStatusPresentation(order.status);

              return (
                <tr key={order.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{order.order_number}</td>
                  <td className="px-4 py-3 text-text">{firstItem?.name ?? "Custom Cake"}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {firstItem?.weight_lbs ? `${firstItem.weight_lbs} lbs` : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {formatDeliveryDate(order.delivery_date)}
                  </td>
                  <td className="px-4 py-3 font-medium text-text">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-sm font-medium text-primary-dark underline-offset-2 hover:underline"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
