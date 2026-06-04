import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function AboutRedirectPage() {
  redirect({ href: "/catalog/about", locale: routing.defaultLocale });
}
