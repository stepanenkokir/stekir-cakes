import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function FaqRedirectPage() {
  redirect({ href: "/catalog/faq", locale: routing.defaultLocale });
}
