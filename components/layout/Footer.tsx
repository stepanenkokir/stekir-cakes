import Link from "next/link";
import { AtSign, Mail, Phone } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/catalog/gallery", label: "Gallery" },
  { href: "/catalog/about", label: "About" },
  { href: "/catalog/reviews", label: "Reviews" },
  { href: "/catalog/faq", label: "FAQ" },
  { href: "/catalog/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="font-accent text-3xl text-primary">
              SteKir Cakes
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed text-text-muted">
              Homemade Eastern European cakes in Sacramento — baked fresh to order
              for every celebration.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-text">Quick Links</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-primary-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-text">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-text-muted">
              <li>
                <a
                  href="tel:+19165550192"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary-dark"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  (916) 555-0192
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@stekircakes.com"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary-dark"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  hello@stekircakes.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/stekircakes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary-dark"
                >
                  <AtSign className="h-4 w-4 shrink-0" aria-hidden="true" />
                  @stekircakes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm leading-relaxed text-text-muted">
            Serving Sacramento, Carmichael, Folsom, Roseville, El Dorado Hills,
            Elk Grove &amp; Rancho Cordova
          </p>
          <p className="mt-3 text-center text-sm text-text-muted">
            <span suppressHydrationWarning>
              © {new Date().getFullYear()} SteKir Cakes. All rights reserved.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
