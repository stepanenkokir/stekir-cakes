"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/CartProvider";

const navLinks = [
  { href: "/catalog", label: "Our Cakes" },
  { href: "/catalog/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contacts", label: "Contact" },
];

export function Header() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
            SteKir Cakes
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Main navigation"
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

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/cart"
              className="relative rounded-full p-2 text-text transition-colors hover:bg-surface hover:text-primary-dark"
              aria-label={`Shopping cart, ${itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              ) : null}
            </Link>

            <Button href="/catalog" size="sm" className="hidden sm:inline-flex">
              Order Now
            </Button>

            <button
              type="button"
              className="rounded-full p-2 text-text transition-colors hover:bg-surface md:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
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
            aria-label="Close menu overlay"
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-bg shadow-card-hover">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-accent text-2xl text-primary">SteKir Cakes</span>
              <button
                type="button"
                className="rounded-full p-2 text-text hover:bg-surface"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-5 py-6" aria-label="Mobile navigation">
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
            </nav>

            <div className="border-t border-border px-5 py-6">
              <Button href="/catalog" className="w-full" onClick={() => setIsMenuOpen(false)}>
                Order Now
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
