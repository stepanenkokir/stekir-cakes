import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle<{ role: string | null; full_name: string | null }>();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const displayName = profile?.full_name?.trim() || user.email || "Admin";

  return (
    <main className="min-h-screen bg-bg px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <p className="text-sm text-text-muted">Admin panel</p>
          <h1 className="mt-1 font-display text-3xl text-text">{displayName}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
          <AdminNav />
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
