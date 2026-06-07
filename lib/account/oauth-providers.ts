export type OAuthProviderId = "google" | "apple" | "facebook";

export type OAuthProviderConfig = {
  id: OAuthProviderId;
  labelKey: OAuthProviderId;
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
