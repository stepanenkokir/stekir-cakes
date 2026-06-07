"use client";

import { Menu, LogOut, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useCart } from "@/lib/cart/CartProvider";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const { itemCount } = useCart();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navLinks = [
    { href: "/catalog" as const, label: t("ourCakes") },
    { href: "/catalog/gallery" as const, label: t("gallery") },
    { href: "/catalog/about" as const, label: t("about") },
    { href: "/contacts" as const, label: t("contact") },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      return;
    }

    const syncAuthState = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(session));
    };

    void syncAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push("/account/login");
    router.refresh();
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          isScrolled
            ? "border-border bg-bg/95 shadow-soft backdrop-blur-md"
            : "border-transparent bg-bg/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-accent text-3xl text-primary transition-colors hover:text-primary-dark sm:text-4xl"
          >
            {tc("brand")}
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label={t("mainNav")}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-primary-dark"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle
              toggleLabel={tc("themeToggle")}
              lightLabel={tc("themeLight")}
              darkLabel={tc("themeDark")}
            />
            <LanguageSwitcher className="hidden sm:block" />

            <Link
              href="/cart"
              className="relative rounded-full p-2 text-text transition-colors hover:bg-surface hover:text-primary-dark"
              aria-label={t("cartAria", { count: itemCount })}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              ) : null}
            </Link>

            <Button href="/catalog" size="sm" className="hidden sm:inline-flex">
              {tc("orderNow")}
            </Button>

            <Link
              href={isAuthenticated ? "/account" : "/account/login"}
              className="rounded-full p-2 text-text transition-colors hover:bg-surface hover:text-primary-dark"
              aria-label={isAuthenticated ? t("accountAria") : t("signInAria")}
            >
              <UserRound className="h-5 w-5" />
            </Link>

            <button
              type="button"
              className="rounded-full p-2 text-text transition-colors hover:bg-surface md:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label={t("openMenu")}
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-text/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-label={t("closeOverlay")}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-bg shadow-card-hover">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-accent text-2xl text-primary">{tc("brand")}</span>
              <button
                type="button"
                className="rounded-full p-2 text-text hover:bg-surface"
                onClick={() => setIsMenuOpen(false)}
                aria-label={t("closeMenu")}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-5 py-6" aria-label={t("mobileNav")}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-lg font-medium text-text transition-colors hover:bg-surface hover:text-primary-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={isAuthenticated ? "/account" : "/account/login"}
                className="rounded-xl px-3 py-3 text-lg font-medium text-text transition-colors hover:bg-surface hover:text-primary-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                {isAuthenticated ? tc("myAccount") : tc("signIn")}
              </Link>
            </nav>

            <div className="border-t border-border px-5 py-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <LanguageSwitcher />
                <ThemeToggle
                  toggleLabel={tc("themeToggle")}
                  lightLabel={tc("themeLight")}
                  darkLabel={tc("themeDark")}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button href="/catalog" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  {tc("orderNow")}
                </Button>
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-bg px-6 py-2.5 text-base font-medium text-text transition-colors hover:border-primary hover:text-primary-dark"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {tc("signOut")}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
