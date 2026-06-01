import Link from "next/link";
import { AtSign, Mail, Phone } from "lucide-react";
import type { TermsSection } from "@/lib/data/terms";
import { termsContact } from "@/lib/data/terms";

type TermsContentProps = {
  sections: TermsSection[];
};

export function TermsContent({ sections }: TermsContentProps) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-12">
      <nav
        aria-label="Terms sections"
        className="mb-10 hidden lg:sticky lg:top-28 lg:mb-0 lg:block lg:self-start"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          On this page
        </p>
        <ul className="mt-4 space-y-2 border-l border-border pl-4">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm text-text-muted transition-colors hover:text-primary-dark"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-8">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8"
          >
            <h2
              id={`${section.id}-heading`}
              className="font-display text-2xl font-semibold text-text sm:text-3xl"
            >
              {section.title}
            </h2>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-text-muted">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {section.listItems?.length ? (
              <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-text-muted marker:text-primary">
                {section.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}

            {section.id === "contact" ? (
              <ul className="mt-6 space-y-3 text-sm text-text-muted">
                <li>
                  <a
                    href={termsContact.phoneHref}
                    className="inline-flex items-center gap-2 transition-colors hover:text-primary-dark"
                  >
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {termsContact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={termsContact.emailHref}
                    className="inline-flex items-center gap-2 transition-colors hover:text-primary-dark"
                  >
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {termsContact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={termsContact.instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-primary-dark"
                  >
                    <AtSign className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {termsContact.instagram}
                  </a>
                </li>
                <li>
                  <Link
                    href="/contacts"
                    className="inline-flex font-medium text-primary transition-colors hover:text-primary-dark"
                  >
                    Contact form →
                  </Link>
                </li>
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
