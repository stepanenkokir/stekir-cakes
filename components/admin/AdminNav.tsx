"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/cakes", label: "Cakes" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Admin</p>
      <nav className="mt-3 flex flex-col gap-1" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-text hover:bg-bg hover:text-primary-dark"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
