import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: loc, namespace: "account.sidebar" });

  return {
    title: t("dashboard"),
  };
}

export default async function AccountDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "account.dashboard" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const { count: totalOrders = 0 } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: activeOrders = 0 } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .in("status", ["pending", "confirmed", "baking", "out_for_delivery"]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">{t("totalOrders")}</p>
          <p className="mt-2 font-display text-3xl text-text">{totalOrders}</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">{t("activeOrders")}</p>
          <p className="mt-2 font-display text-3xl text-text">{activeOrders}</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm text-text-muted">{t("loyalty")}</p>
          <p className="mt-2 font-display text-3xl text-text">{tc("soon")}</p>
        </article>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-text">{t("quickLinks")}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/account/orders"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            {tc("viewOrders")}
          </Link>
          <Link
            href="/account/profile"
            className="rounded-full border border-border bg-bg px-5 py-2.5 text-sm font-medium text-text hover:border-primary hover:text-primary-dark"
          >
            {tc("updateProfile")}
          </Link>
        </div>
      </div>
    </div>
  );
}
