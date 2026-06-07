export type OAuthProviderId = "google" | "apple" | "facebook";

export type OAuthProviderConfig = {
  id: OAuthProviderId;
  labelKey: OAuthProviderId;
};

export type OAuthSignInOptions = {
  redirectTo: string;
  scopes?: string;
};

export function getOAuthProviders(): OAuthProviderConfig[] {
  const providers: OAuthProviderConfig[] = [{ id: "google", labelKey: "google" }];

  if (process.env.NEXT_PUBLIC_OAUTH_APPLE === "true") {
    providers.push({ id: "apple", labelKey: "apple" });
  }

  if (process.env.NEXT_PUBLIC_OAUTH_FACEBOOK === "true") {
    providers.push({ id: "facebook", labelKey: "facebook" });
  }

  return providers;
}

export function getOAuthSignInOptions(
  provider: OAuthProviderId,
  redirectTo: string,
): OAuthSignInOptions {
  const options: OAuthSignInOptions = { redirectTo };

  if (provider === "apple") {
    options.scopes = "name email";
  }

  return options;
}

export function getSupabaseAppleCallbackUrl(supabaseUrl: string): string | null {
  try {
    const { hostname } = new URL(supabaseUrl);
    const projectRef = hostname.split(".")[0];
    if (!projectRef) {
      return null;
    }
    return `https://${projectRef}.supabase.co/auth/v1/callback`;
  } catch {
    return null;
  }
}
