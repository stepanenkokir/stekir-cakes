import { afterEach, describe, expect, it } from "vitest";
import {
  getOAuthProviders,
  getOAuthSignInOptions,
  getSupabaseAppleCallbackUrl,
} from "@/lib/account/oauth-providers";

const originalApple = process.env.NEXT_PUBLIC_OAUTH_APPLE;
const originalFacebook = process.env.NEXT_PUBLIC_OAUTH_FACEBOOK;

afterEach(() => {
  if (originalApple === undefined) {
    delete process.env.NEXT_PUBLIC_OAUTH_APPLE;
  } else {
    process.env.NEXT_PUBLIC_OAUTH_APPLE = originalApple;
  }

  if (originalFacebook === undefined) {
    delete process.env.NEXT_PUBLIC_OAUTH_FACEBOOK;
  } else {
    process.env.NEXT_PUBLIC_OAUTH_FACEBOOK = originalFacebook;
  }
});

describe("getOAuthProviders", () => {
  it("always includes google", () => {
    delete process.env.NEXT_PUBLIC_OAUTH_APPLE;
    delete process.env.NEXT_PUBLIC_OAUTH_FACEBOOK;

    expect(getOAuthProviders().map((provider) => provider.id)).toEqual(["google"]);
  });

  it("includes apple when NEXT_PUBLIC_OAUTH_APPLE is true", () => {
    process.env.NEXT_PUBLIC_OAUTH_APPLE = "true";
    delete process.env.NEXT_PUBLIC_OAUTH_FACEBOOK;

    expect(getOAuthProviders().map((provider) => provider.id)).toEqual(["google", "apple"]);
  });
});

describe("getOAuthSignInOptions", () => {
  it("requests name and email scopes for apple", () => {
    expect(getOAuthSignInOptions("apple", "http://localhost:3000/auth/callback")).toEqual({
      redirectTo: "http://localhost:3000/auth/callback",
      scopes: "name email",
    });
  });

  it("uses redirectTo only for google", () => {
    expect(getOAuthSignInOptions("google", "http://localhost:3000/auth/callback")).toEqual({
      redirectTo: "http://localhost:3000/auth/callback",
    });
  });
});

describe("getSupabaseAppleCallbackUrl", () => {
  it("builds the Supabase auth callback URL from project URL", () => {
    expect(getSupabaseAppleCallbackUrl("https://caohdmbwgkqebjocxisc.supabase.co")).toBe(
      "https://caohdmbwgkqebjocxisc.supabase.co/auth/v1/callback",
    );
  });

  it("returns null for invalid URLs", () => {
    expect(getSupabaseAppleCallbackUrl("not-a-url")).toBeNull();
  });
});
