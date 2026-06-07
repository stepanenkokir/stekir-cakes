import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";
import { getOrderStatusPresentation, type OrderItem } from "@/lib/account/orders";
import { isLocale } from "@/lib/i18n/locale";

type OrderRow = {
  id: string;
  order_number: string;
  items: OrderItem[] | null;
  delivery_date: string;
  total: number;
  status: string;
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

function getOrderPrimaryItem(items: OrderItem[] | null): OrderItem | null {
  if (!items || items.length === 0) {
    return null;
  }

  return items[0] ?? null;
}

function getStatusLabel(
  status: string,
  tStatus: Awaited<ReturnType<typeof getTranslations>>,
): string {
  const normalized = status.toLowerCase();
  const key =
    normalized === "out_for_delivery"
      ? "outForDelivery"
      : (normalized as "pending" | "confirmed" | "baking" | "delivered" | "cancelled");

  if (["pending", "confirmed", "baking", "outForDelivery", "delivered", "cancelled"].includes(key)) {
    return tStatus(key);
  }

  return tStatus("pending");
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "account.sidebar" });

  return {
    title: t("orders"),
  };
}

export default async function AccountOrdersPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "account.orders" });
  const ts = await getTranslations({ locale, namespace: "account.sidebar" });
  const tStatus = await getTranslations({ locale, namespace: "account.status" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const { data } = await supabase
    .from("orders")
    .select("id, order_number, items, delivery_date, total, status")
    .eq("user_id", user.id)
    .order("delivery_date", { ascending: false })
    .returns<OrderRow[]>();

  const orders = data ?? [];

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl text-text">{ts("orders")}</h1>
        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-soft">
          <h2 className="font-display text-2xl text-text">{t("emptyTitle")}</h2>
          <p className="mt-2 text-text-muted">{t("emptyText")}</p>
          <Link
            href="/catalog"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            {tc("browseCakes")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-text">{ts("orders")}</h1>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-bg/60 text-left text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{t("headers.number")}</th>
              <th className="px-4 py-3 font-medium">{t("headers.cake")}</th>
              <th className="px-4 py-3 font-medium">{t("headers.weight")}</th>
              <th className="px-4 py-3 font-medium">{t("headers.date")}</th>
              <th className="px-4 py-3 font-medium">{t("headers.total")}</th>
              <th className="px-4 py-3 font-medium">{t("headers.status")}</th>
              <th className="px-4 py-3 font-medium">{t("headers.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const firstItem = getOrderPrimaryItem(order.items);
              const status = getOrderStatusPresentation(order.status);
              const statusLabel = getStatusLabel(order.status, tStatus);

              return (
                <tr key={order.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{order.order_number}</td>
                  <td className="px-4 py-3 text-text">
                    {firstItem?.name ?? tc("customCake")}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {firstItem?.weight_lbs
                      ? tc("lbs", { weight: firstItem.weight_lbs })
                      : tc("na")}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {formatDeliveryDate(order.delivery_date)}
                  </td>
                  <td className="px-4 py-3 font-medium text-text">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-sm font-medium text-primary-dark underline-offset-2 hover:underline"
                    >
                      {t("viewDetails")}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
