"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, locales, type Locale } from "@/lib/i18n/locale";
import { useTranslations } from "next-intl";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  function onChange(nextLocale: Locale) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className={className} role="group" aria-label={t("languageSwitcher")}>
      <div className="flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5">
        {locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => onChange(loc)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              loc === locale
                ? "bg-primary text-white"
                : "text-text-muted hover:text-primary-dark"
            }`}
            aria-pressed={loc === locale}
            aria-label={loc}
          >
            {localeLabels[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}
