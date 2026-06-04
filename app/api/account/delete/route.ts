import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    return null;
  }

  return { url, anonKey, serviceRoleKey };
}

export async function POST() {
  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.json(
      { error: "Account service is not configured." },
      { status: 503 },
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const adminClient = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await adminClient.from("orders").update({ user_id: null }).eq("user_id", user.id);
  await adminClient.from("reviews").update({ user_id: null }).eq("user_id", user.id);
  await adminClient.from("profiles").delete().eq("id", user.id);

  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Delete user failed:", error);
    return NextResponse.json(
      { error: "Unable to delete account. Please contact us for help." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
