import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AccountDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { count: totalOrders = 0 } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: activeOrders = 0 } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .in("status", ["pending", "confirmed", "baking", "out_for_delivery"]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">Total Orders</p>
          <p className="mt-2 font-display text-3xl text-text">{totalOrders}</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">Active Orders</p>
          <p className="mt-2 font-display text-3xl text-text">{activeOrders}</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">Loyalty Points</p>
          <p className="mt-2 font-display text-3xl text-text">Soon</p>
        </article>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-text">Quick links</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/account/orders"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            View Orders
          </Link>
          <Link
            href="/account/profile"
            className="rounded-full border border-border bg-bg px-5 py-2.5 text-sm font-medium text-text hover:border-primary hover:text-primary-dark"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
