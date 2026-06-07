const MIN_PASSWORD_LENGTH = 8;

export { MIN_PASSWORD_LENGTH };

export function buildAuthCallbackUrl(nextPath: string, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  const url = new URL("/auth/callback", base);
  url.searchParams.set("next", nextPath.startsWith("/") ? nextPath : "/en/account");
  return url.toString();
}

export function isPasswordStrongEnough(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}
