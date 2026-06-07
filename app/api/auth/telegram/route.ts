import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getTelegramBotToken,
  isTelegramAuthConfigured,
  parseTelegramAuthPayload,
  telegramAuthEmail,
  telegramDisplayName,
  verifyTelegramAuth,
} from "@/lib/account/telegram-auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

function getSafeNextPath(next: unknown): string {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/en/account";
}

export async function POST(request: Request) {
  if (!isTelegramAuthConfigured()) {
    return NextResponse.json({ error: "Telegram sign-in is not configured." }, { status: 503 });
  }

  const env = getSupabaseEnv();
  const botToken = getTelegramBotToken();
  const adminClient = createSupabaseServiceClient();

  if (!env || !botToken || !adminClient) {
    return NextResponse.json({ error: "Account service is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = parseTelegramAuthPayload(body);
  if (!payload || !verifyTelegramAuth(payload, botToken)) {
    return NextResponse.json({ error: "Telegram authorization failed." }, { status: 401 });
  }

  const email = telegramAuthEmail(payload.id);
  const userMetadata = {
    auth_provider: "telegram",
    telegram_id: payload.id,
    full_name: telegramDisplayName(payload),
    telegram_username: payload.username ?? null,
    avatar_url: payload.photo_url ?? null,
  };

  const { error: createError } = await adminClient.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: userMetadata,
  });

  const userAlreadyExists =
    createError &&
    (createError.code === "email_exists" ||
      createError.message.toLowerCase().includes("already"));

  if (createError && !userAlreadyExists) {
    console.error("Telegram createUser failed:", createError);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }

  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !linkData.properties?.hashed_token) {
    console.error("Telegram generateLink failed:", linkError);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }

  const nextPath = getSafeNextPath(
    typeof body === "object" && body !== null && "next" in body
      ? (body as Record<string, unknown>).next
      : null,
  );

  const cookieStore = await cookies();
  let response = NextResponse.json({ success: true, redirect: nextPath });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });

  const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });

  if (sessionError || !sessionData.user) {
    console.error("Telegram verifyOtp failed:", sessionError);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }

  await adminClient.auth.admin.updateUserById(sessionData.user.id, {
    user_metadata: userMetadata,
  });

  return response;
}
