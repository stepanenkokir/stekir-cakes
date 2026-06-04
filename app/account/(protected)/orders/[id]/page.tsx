import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBar } from "@/components/account/OrderStatusBar";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";
import { BAKERY_EMAIL } from "@/lib/data/contact";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrderStatusPresentation, type OrderItem } from "@/lib/account/orders";

type OrderRecord = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[] | null;
  delivery_type: "delivery" | "pickup";
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_zip: string | null;
  delivery_date: string;
  delivery_window: string | null;
  delivery_instructions: string | null;
  payment_method: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  deposit_amount: number | null;
  status: string;
};

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_email, customer_phone, items, delivery_type, delivery_address, delivery_city, delivery_zip, delivery_date, delivery_window, delivery_instructions, payment_method, subtotal, delivery_fee, total, deposit_amount, status",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<OrderRecord>();

  if (!order) {
    notFound();
  }

  const status = getOrderStatusPresentation(order.status);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <p className="text-sm text-text-muted">Order #{order.order_number}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl text-text">Order details</h2>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h3 className="font-display text-xl text-text">Status tracker</h3>
        <div className="mt-4">
          <OrderStatusBar status={order.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h3 className="font-display text-xl text-text">Cake items</h3>
          <ul className="mt-4 space-y-3">
            {(order.items ?? []).map((item, index) => (
              <li key={`${item.slug ?? "item"}-${index}`} className="rounded-xl border border-border bg-bg p-4">
                <p className="font-medium text-text">{item.name ?? "Custom Cake"}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {item.weight_lbs ? `${item.weight_lbs} lbs` : "Custom weight"}{" "}
                  {item.tiers ? `· ${item.tiers} tier(s)` : ""}
                </p>
                {item.inscription ? (
                  <p className="mt-1 text-sm text-text-muted">Inscription: {item.inscription}</p>
                ) : null}
                {item.decoration_notes ? (
                  <p className="mt-1 text-sm text-text-muted">Notes: {item.decoration_notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h3 className="font-display text-xl text-text">Delivery & payment</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Delivery type</dt>
              <dd className="font-medium text-text capitalize">{order.delivery_type}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Date</dt>
              <dd className="font-medium text-text">{formatDeliveryDate(order.delivery_date)}</dd>
            </div>
            {order.delivery_window ? (
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Time window</dt>
                <dd className="font-medium text-text capitalize">{order.delivery_window}</dd>
              </div>
            ) : null}
            {order.delivery_type === "delivery" ? (
              <div className="rounded-xl border border-border bg-bg p-3">
                <p className="text-xs uppercase tracking-wide text-text-muted">Delivery address</p>
                <p className="mt-1 text-sm text-text">
                  {[order.delivery_address, order.delivery_city, order.delivery_zip]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {order.delivery_instructions ? (
                  <p className="mt-1 text-xs text-text-muted">
                    Instructions: {order.delivery_instructions}
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Subtotal</dt>
                <dd className="font-medium text-text">{formatCurrency(order.subtotal)}</dd>
              </div>
              <div className="mt-2 flex justify-between gap-4">
                <dt className="text-text-muted">Delivery fee</dt>
                <dd className="font-medium text-text">{formatCurrency(order.delivery_fee)}</dd>
              </div>
              <div className="mt-2 flex justify-between gap-4">
                <dt className="font-medium text-text">Total</dt>
                <dd className="font-display text-xl text-primary-dark">
                  {formatCurrency(order.total)}
                </dd>
              </div>
              {order.deposit_amount ? (
                <div className="mt-2 flex justify-between gap-4">
                  <dt className="text-text-muted">Deposit</dt>
                  <dd className="font-semibold text-primary-dark">
                    {formatCurrency(order.deposit_amount)}
                  </dd>
                </div>
              ) : null}
            </div>
          </dl>
        </section>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h3 className="font-display text-xl text-text">Need help with this order?</h3>
        <p className="mt-2 text-sm text-text-muted">
          Contact us if you need to adjust delivery details or have design questions.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`sms:+19165550192?body=${encodeURIComponent(`Hi, I have a question about order ${order.order_number}.`)}`}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Text Us
          </a>
          <Link
            href={`mailto:${BAKERY_EMAIL}?subject=${encodeURIComponent(`Question about order ${order.order_number}`)}`}
            className="rounded-full border border-border bg-bg px-5 py-2.5 text-sm font-medium text-text hover:border-primary hover:text-primary-dark"
          >
            Email Us
          </Link>
        </div>
      </div>
    </div>
  );
}
