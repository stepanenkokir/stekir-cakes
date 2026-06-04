import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function ReviewsRedirectPage() {
  redirect({ href: "/catalog/reviews", locale: routing.defaultLocale });
}
