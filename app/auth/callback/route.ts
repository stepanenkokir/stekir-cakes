import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRequestOrigin, getSafeNextPath } from "@/lib/account/auth-callback";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

function buildLoginRedirect(request: NextRequest, errorCode: string) {
  const origin = getRequestOrigin(request);
  const loginUrl = new URL("/en/account/login", origin);
  loginUrl.searchParams.set("error", errorCode);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest) {
  const env = getSupabaseEnv();
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const origin = getRequestOrigin(request);

  if (oauthError) {
    return buildLoginRedirect(request, oauthError);
  }

  if (!env || !code) {
    return buildLoginRedirect(request, "auth_callback_failed");
  }

  const redirectUrl = new URL(nextPath, origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return buildLoginRedirect(request, "auth_callback_failed");
  }

  return response;
}
