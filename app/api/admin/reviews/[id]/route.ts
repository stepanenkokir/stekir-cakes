import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables for admin API route.");
  }

  return { url, anonKey, serviceRoleKey };
}

async function getRequestUser() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
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

  return user;
}

function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function ensureAdmin(userId: string) {
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle<{ role: string | null }>();

  return profile?.role === "admin";
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const user = await getRequestUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const isAdmin = await ensureAdmin(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;

  let body: { approved?: boolean };
  try {
    body = (await request.json()) as { approved?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.approved !== "boolean") {
    return NextResponse.json({ error: "Invalid approved value." }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("reviews").update({ approved: body.approved }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update review." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await getRequestUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const isAdmin = await ensureAdmin(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const adminClient = createAdminClient();
  const { error } = await adminClient.from("reviews").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete review." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
