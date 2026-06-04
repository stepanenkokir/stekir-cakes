import { toLocale, type Locale } from "@/lib/i18n/locale";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ru from "@/messages/ru.json";
import uk from "@/messages/uk.json";

export type Messages = typeof en;

const catalogs: Record<Locale, Messages> = { en, es, ru, uk };

export function getMessages(locale: Locale | string): Messages {
  return catalogs[toLocale(String(locale))] ?? catalogs.en;
}
