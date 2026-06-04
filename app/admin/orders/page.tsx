import { AdminOrdersTable, type AdminOrderRow } from "@/components/admin/AdminOrdersTable";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, items, delivery_date, total, status, created_at")
    .order("created_at", { ascending: false })
    .returns<AdminOrderRow[]>();

  const orders = data ?? [];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-text">Orders</h2>
      <AdminOrdersTable initialOrders={orders} />
    </div>
  );
}
