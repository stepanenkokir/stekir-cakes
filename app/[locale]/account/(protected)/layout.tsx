import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { linkGuestOrders } from "@/lib/account/linkGuestOrders";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n/locale";
import { notFound } from "next/navigation";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AccountLayout({ children, params }: LayoutProps) {
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
    redirect({ href: "/account/login", locale: locale as Locale });
    notFound();
  }

  if (user.email) {
    await linkGuestOrders(supabase, user.id, user.email);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const t = await getTranslations({ locale, namespace: "account" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const displayName = profile?.full_name?.trim() || user.email || tc("customer");

  return (
    <main className="min-h-screen bg-bg px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <p className="text-sm text-text-muted">{t("welcome")}</p>
          <h1 className="mt-1 font-display text-3xl text-text">{displayName}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
          <AccountSidebar />
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
