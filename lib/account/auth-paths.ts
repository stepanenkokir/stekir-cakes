export const PUBLIC_ACCOUNT_PATHS = [
  "/account/login",
  "/account/register",
  "/account/forgot-password",
  "/account/reset-password",
] as const;

export function isPublicAccountPath(pathWithoutLocale: string): boolean {
  return (PUBLIC_ACCOUNT_PATHS as readonly string[]).includes(pathWithoutLocale);
}

export const AUTH_ENTRY_ACCOUNT_PATHS = [
  "/account/login",
  "/account/register",
  "/account/forgot-password",
] as const;

export function isAuthEntryAccountPath(pathWithoutLocale: string): boolean {
  return (AUTH_ENTRY_ACCOUNT_PATHS as readonly string[]).includes(pathWithoutLocale);
}
