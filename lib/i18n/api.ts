import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/locale";

export function resolveLocale(value: string | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }
  return "en";
}

export function getApiMessages(locale: string | undefined) {
  return getMessages(resolveLocale(locale)).api;
}

export function getEmailMessages(locale: string | undefined) {
  return getMessages(resolveLocale(locale)).emails;
}
