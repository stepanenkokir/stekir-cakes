"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function AccountSidebar() {
  const pathname = usePathname();
  const t = useTranslations("account.sidebar");

  const navItems = [
    { href: "/account" as const, label: t("dashboard") },
    { href: "/account/orders" as const, label: t("orders") },
    { href: "/account/profile" as const, label: t("profile") },
  ];

  return (
    <aside className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
        {t("account")}
      </p>
      <nav className="mt-3 flex flex-col gap-1" aria-label={t("account")}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/account" && pathname.startsWith(`${item.href}/`));

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
