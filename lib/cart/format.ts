import { intlLocale, isLocale, type Locale } from "@/lib/i18n/locale";

function resolveFormatLocale(locale?: string): Locale {
  return locale && isLocale(locale) ? locale : "en";
}

export function formatDeliveryDate(isoDate: string, locale?: string): string {
  const loc = resolveFormatLocale(locale);
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString(intlLocale[loc], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number, locale?: string): string {
  const loc = resolveFormatLocale(locale);
  return new Intl.NumberFormat(intlLocale[loc], {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
