import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function TermsRedirectPage() {
  redirect({ href: "/catalog/terms", locale: routing.defaultLocale });
}
