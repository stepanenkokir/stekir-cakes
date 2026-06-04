import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiMessages, resolveLocale } from "@/lib/i18n/api";
import { getMessages } from "@/lib/i18n/messages";

const ALLOWED_CAKE_SLUGS = ["napoleon", "medovik", "smetannik", "mannik"] as const;

type ReviewPayload = {
  locale?: string;
  reviewerName?: string;
  reviewerEmail?: string;
  cakeSlug?: string;
  rating?: number;
  occasion?: string;
  body?: string;
};

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    return null;
  }

  return { url, anonKey, serviceRoleKey };
}

async function getUserId() {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
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

  return user?.id ?? null;
}

export async function POST(request: Request) {
  let body: ReviewPayload;

  try {
    body = (await request.json()) as ReviewPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const locale = resolveLocale(body.locale);
  const messages = getMessages(locale);
  const api = getApiMessages(body.locale);

  const reviewerName = body.reviewerName?.trim() ?? "";
  const reviewerEmail = body.reviewerEmail?.trim() ?? "";
  const cakeSlug = body.cakeSlug?.trim() ?? "";
  const occasion = body.occasion?.trim() ?? "";
  const reviewBody = body.body?.trim() ?? "";
  const rating = Number(body.rating ?? 0);
  const userId = await getUserId();

  if (reviewerName.length < 2) {
    return NextResponse.json({ error: api.reviewName }, { status: 400 });
  }

  if (!userId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewerEmail)) {
    return NextResponse.json({ error: api.reviewEmail }, { status: 400 });
  }

  if (!ALLOWED_CAKE_SLUGS.includes(cakeSlug as (typeof ALLOWED_CAKE_SLUGS)[number])) {
    return NextResponse.json({ error: api.reviewCake }, { status: 400 });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: api.reviewRating }, { status: 400 });
  }

  if (reviewBody.length < 20) {
    return NextResponse.json({ error: api.reviewText }, { status: 400 });
  }

  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.json({ error: api.supabase }, { status: 503 });
  }

  const adminClient = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await adminClient.from("reviews").insert({
    user_id: userId,
    reviewer_name: reviewerName,
    cake_slug: cakeSlug,
    rating,
    occasion: occasion || null,
    body: reviewBody,
    approved: false,
  });

  if (error) {
    console.error("Review insert failed:", error);
    return NextResponse.json(
      { error: messages.reviewsForm.submitFailed },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: messages.reviewsForm.thankYou,
  });
}
