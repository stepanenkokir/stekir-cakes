import { getMessages } from "@/lib/i18n/messages";
import { toLocale } from "@/lib/i18n/locale";

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
};

export function getPrivacyContent(locale: string) {
  return getMessages(toLocale(locale)).privacy;
}

export const privacyContact = {
  phone: "(916) 555-0192",
  phoneHref: "tel:+19165550192",
  email: "hello@stekircakes.com",
  emailHref: "mailto:hello@stekircakes.com",
  instagram: "@stekircakes",
  instagramHref: "https://instagram.com/stekircakes",
};

/** @deprecated Use getPrivacyContent(locale) */
export const privacySections: PrivacySection[] = getPrivacyContent("en").sections;
