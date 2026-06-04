import { routing, type AppLocale } from "@/i18n/routing";

export type Locale = AppLocale;

export const locales = routing.locales;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function toLocale(value: string): Locale {
  return isLocale(value) ? value : "en";
}

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  ru: "RU",
  uk: "UA",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ru: "Русский",
  uk: "Українська",
};

export const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  ru: "ru_RU",
  uk: "uk_UA",
};

export const htmlLang: Record<Locale, string> = {
  en: "en",
  es: "es",
  ru: "ru",
  uk: "uk",
};

export const intlLocale: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
  ru: "ru-RU",
  uk: "uk-UA",
};

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (maybeLocale && isLocale(maybeLocale)) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}
