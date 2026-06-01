import Link from "next/link";
import { formatCurrency } from "@/lib/cart/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RevenueOrder = {
  created_at: string;
  total: number;
  status: string;
};

function getWeekStart(date: Date) {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  const weekStart = new Date(date);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(date.getDate() - diff);
  return weekStart;
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: orders = [] }, { count: pendingOrders = 0 }, { count: pendingReviews = 0 }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("created_at, total, status")
        .returns<RevenueOrder[]>(),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
    ]);

  const now = new Date();
  const weekStart = getWeekStart(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let weeklyRevenue = 0;
  let monthlyRevenue = 0;

  for (const order of orders) {
    if (order.status === "cancelled") {
      continue;
    }

    const createdAt = new Date(order.created_at);
    if (createdAt >= weekStart) {
      weeklyRevenue += order.total;
    }
    if (createdAt >= monthStart) {
      monthlyRevenue += order.total;
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">Orders total</p>
          <p className="mt-2 font-display text-3xl text-text">{orders.length}</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">Pending orders</p>
          <p className="mt-2 font-display text-3xl text-text">{pendingOrders}</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">Revenue this week</p>
          <p className="mt-2 font-display text-3xl text-text">{formatCurrency(weeklyRevenue)}</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">Revenue this month</p>
          <p className="mt-2 font-display text-3xl text-text">{formatCurrency(monthlyRevenue)}</p>
        </article>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-text">Moderation</h2>
        <p className="mt-1 text-text-muted">
          {pendingReviews} review{pendingReviews === 1 ? "" : "s"} pending approval.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/orders"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Manage orders
          </Link>
          <Link
            href="/admin/reviews"
            className="rounded-full border border-border bg-bg px-5 py-2.5 text-sm font-medium text-text hover:border-primary hover:text-primary-dark"
          >
            Review moderation
          </Link>
        </div>
      </section>
    </div>
  );
}
