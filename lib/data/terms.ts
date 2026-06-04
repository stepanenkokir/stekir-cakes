import { getMessages } from "@/lib/i18n/messages";
import { toLocale } from "@/lib/i18n/locale";

export type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
};

export function getTermsContent(locale: string) {
  return getMessages(toLocale(locale)).terms;
}

export const termsContact = {
  phone: "(916) 555-0192",
  phoneHref: "tel:+19165550192",
  email: "hello@stekircakes.com",
  emailHref: "mailto:hello@stekircakes.com",
  instagram: "@stekircakes",
  instagramHref: "https://instagram.com/stekircakes",
};

/** @deprecated Use getTermsContent(locale) */
export const termsSections: TermsSection[] = getTermsContent("en").sections;
