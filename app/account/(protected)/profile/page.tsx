import { ProfileForm } from "@/components/account/ProfileForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile",
};

export default async function AccountProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, default_address")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <ProfileForm
      userId={user.id}
      email={user.email ?? ""}
      initialFullName={profile?.full_name ?? ""}
      initialPhone={profile?.phone ?? ""}
      initialDefaultAddress={profile?.default_address ?? ""}
    />
  );
}
