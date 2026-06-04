import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function GalleryRedirectPage() {
  redirect({ href: "/catalog/gallery", locale: routing.defaultLocale });
}
