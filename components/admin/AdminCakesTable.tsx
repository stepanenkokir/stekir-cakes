"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/cart/format";

export type AdminCakeRow = {
  id: string;
  slug: string;
  name: string;
  pricePerPound: number;
  minWeight: number;
  sortOrder: number;
  isActive: boolean;
};

type AdminCakesTableProps = {
  initialCakes: AdminCakeRow[];
};

export function AdminCakesTable({ initialCakes }: AdminCakesTableProps) {
  const router = useRouter();
  const [cakes, setCakes] = useState(initialCakes);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function deactivateCake(id: string) {
    if (!window.confirm("Deactivate this cake? It will disappear from the catalog.")) {
      return;
    }

    setPendingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/cakes/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Failed to deactivate cake.");
        return;
      }

      setCakes((current) =>
        current.map((cake) => (cake.id === id ? { ...cake, isActive: false } : cake)),
      );
      router.refresh();
    } catch {
      setError("Failed to deactivate cake.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted">{cakes.length} cakes in catalog</p>
        <Link href="/admin/cakes/new">
          <Button>Add cake</Button>
        </Link>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-bg/60 text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Price/lb</th>
              <th className="px-4 py-3">Min weight</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cakes.map((cake) => (
              <tr key={cake.id} className="border-b border-border/70 last:border-b-0">
                <td className="px-4 py-3 font-medium text-text">{cake.name}</td>
                <td className="px-4 py-3 text-text-muted">{cake.slug}</td>
                <td className="px-4 py-3">{formatCurrency(cake.pricePerPound)}</td>
                <td className="px-4 py-3">{cake.minWeight} lb</td>
                <td className="px-4 py-3">{cake.sortOrder}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      cake.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cake.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/cakes/${cake.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    {cake.isActive ? (
                      <button
                        type="button"
                        disabled={pendingId === cake.id}
                        onClick={() => void deactivateCake(cake.id)}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
