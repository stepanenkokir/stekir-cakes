import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.full_name?.trim() || user.email || "Customer";

  return (
    <main className="min-h-screen bg-bg px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <p className="text-sm text-text-muted">Welcome back</p>
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
