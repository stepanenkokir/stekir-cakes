import type { NextRequest } from "next/server";
import { stripLocalePrefix } from "@/lib/i18n/locale";
import type { AppLocale } from "@/i18n/routing";

const MIN_PASSWORD_LENGTH = 8;
const OTP_TOKEN_LENGTH = 8;

export { MIN_PASSWORD_LENGTH, OTP_TOKEN_LENGTH };

function normalizeSiteOrigin(origin: string): string {
  return origin.replace(/\/$/, "");
}

export function getPublicSiteOrigin(fallbackOrigin = ""): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return normalizeSiteOrigin(fromEnv);
  }

  if (fallbackOrigin) {
    return normalizeSiteOrigin(fallbackOrigin);
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

export function getRequestOrigin(request: NextRequest): string {
  if (process.env.NODE_ENV === "development") {
    return request.nextUrl.origin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const fromEnv = getPublicSiteOrigin();
  if (fromEnv) {
    return fromEnv;
  }

  return request.nextUrl.origin;
}

export function toLocalePath(path: string, locale: AppLocale): string {
  const stripped = stripLocalePrefix(path);
  return `/${locale}${stripped === "/" ? "" : stripped}`;
}

export function getSafeNextPath(next: string | null, locale: AppLocale = "en"): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return toLocalePath(next, locale);
  }
  return `/${locale}/account`;
}

export function buildAuthCallbackUrl(
  nextPath: string,
  origin?: string,
  locale: AppLocale = "en",
): string {
  const base = getPublicSiteOrigin(
    origin ?? (typeof window !== "undefined" ? window.location.origin : ""),
  );

  if (!base) {
    throw new Error(
      "Cannot build auth callback URL. Set NEXT_PUBLIC_SITE_URL or call from the browser.",
    );
  }

  const url = new URL("/auth/callback", base);
  url.searchParams.set(
    "next",
    nextPath.startsWith("/") ? toLocalePath(nextPath, locale) : `/${locale}/account`,
  );
  return url.toString();
}

export function isPasswordStrongEnough(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}
