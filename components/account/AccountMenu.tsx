"use client";

import { LayoutDashboard, LogOut, Package, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

type AccountMenuProps = {
  className?: string;
};

export function AccountMenu({ className }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("account.sidebar");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");
  const router = useRouter();

  const navItems = [
    { href: "/account" as const, label: t("dashboard"), icon: LayoutDashboard },
    { href: "/account/orders" as const, label: t("orders"), icon: Package },
    { href: "/account/profile" as const, label: t("profile"), icon: UserRound },
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setIsOpen(false);
    router.push("/account/login");
    router.refresh();
  }

  return (
    <div ref={menuRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        className="rounded-full p-2 text-text transition-colors hover:bg-surface hover:text-primary-dark"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={tn("accountMenuAria")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <UserRound className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-surface py-1.5 shadow-card-hover"
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-bg hover:text-primary-dark"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4 w-4 shrink-0 text-text-muted" aria-hidden />
                {item.label}
              </Link>
            );
          })}

          <div className="my-1.5 border-t border-border" role="separator" />

          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-bg hover:text-primary-dark"
            onClick={() => void handleSignOut()}
          >
            <LogOut className="h-4 w-4 shrink-0 text-text-muted" aria-hidden />
            {tc("signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
