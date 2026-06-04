import { getMessages } from "@/lib/i18n/messages";
import { toLocale } from "@/lib/i18n/locale";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

export function getFaqCategories(locale: string): FaqCategory[] {
  return getMessages(toLocale(locale)).faq.categories;
}

/** @deprecated Use getFaqCategories(locale) */
export const faqCategories = getFaqCategories("en");
