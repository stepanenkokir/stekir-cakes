import { AdminCakesTable, type AdminCakeRow } from "@/components/admin/AdminCakesTable";
import { fetchAllCakeRows } from "@/lib/data/cakes-db";
import { seedCakeRows } from "@/lib/data/cakes-seed";

export default async function AdminCakesPage() {
  const rows = (await fetchAllCakeRows()) ?? seedCakeRows;

  const cakes: AdminCakeRow[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.translations.en?.name ?? row.slug,
    pricePerPound: Number(row.price_per_pound),
    minWeight: Number(row.min_weight),
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-text">Cakes</h2>
      <AdminCakesTable initialCakes={cakes} />
    </div>
  );
}
