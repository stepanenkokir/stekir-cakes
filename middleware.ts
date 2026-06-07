import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import {
  isAuthEntryAccountPath,
  isPublicAccountPath,
} from "@/lib/account/auth-paths";
import { toLocalePath } from "@/lib/account/auth-callback";
import { stripLocalePrefix, toLocale } from "@/lib/i18n/locale";

const intlMiddleware = createIntlMiddleware(routing);

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = stripLocalePrefix(pathname);

  if (!pathWithoutLocale.startsWith("/account")) {
    return intlResponse;
  }

  const supabaseEnv = getSupabaseEnv();
  if (!supabaseEnv) {
    return intlResponse;
  }

  const { url, anonKey } = supabaseEnv;
  let response = intlResponse;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          request.cookies.set(cookie.name, cookie.value);
        }

        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });

        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = pathname.split("/")[1] ?? routing.defaultLocale;
  const loginPath = `/${locale}/account/login`;
  const isPublicAccountPage = isPublicAccountPath(pathWithoutLocale);

  if (!user && !isPublicAccountPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = loginPath;
    redirectUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthEntryAccountPath(pathWithoutLocale)) {
    const redirectUrl = request.nextUrl.clone();
    const nextPath = request.nextUrl.searchParams.get("next");
    redirectUrl.pathname =
      nextPath && nextPath.startsWith("/")
        ? toLocalePath(nextPath, toLocale(locale))
        : `/${locale}/account`;
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/(en|es|ru|uk)/:path*",
    "/about",
    "/faq",
    "/terms",
    "/reviews",
    "/gallery",
  ],
};
