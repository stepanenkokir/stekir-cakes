"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TelegramLoginButton } from "@/components/account/TelegramLoginButton";
import { useAuthNextPath } from "@/components/account/useAuthNextPath";
import { buildAuthCallbackUrl } from "@/lib/account/auth-callback";
import { toLocale } from "@/lib/i18n/locale";
import {
  getOAuthProviders,
  getOAuthSignInOptions,
  type OAuthProviderId,
} from "@/lib/account/oauth-providers";
import { isTelegramLoginAvailable } from "@/lib/account/telegram-config";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

const providerStyles: Record<OAuthProviderId, string> = {
  google:
    "border-border bg-surface hover:-translate-y-0.5 hover:border-[#4285F4] hover:bg-[#4285F4]/10 hover:shadow-[0_8px_24px_rgba(66,133,244,0.22)] active:translate-y-0",
  apple:
    "border-border bg-surface hover:-translate-y-0.5 hover:border-black/50 hover:bg-black/[0.06] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] active:translate-y-0",
  facebook:
    "border-[#1877F2]/35 bg-[#1877F2]/5 hover:-translate-y-0.5 hover:border-[#1877F2] hover:bg-[#1877F2]/15 hover:shadow-[0_8px_24px_rgba(24,119,242,0.28)] active:translate-y-0",
};

export function AccountOAuthButtons() {
  const t = useTranslations("account.oauth");
  const tLogin = useTranslations("account.login");
  const locale = useLocale();
  const nextPath = useAuthNextPath();
  const providers = getOAuthProviders();
  const telegramEnabled = isTelegramLoginAvailable();
  const [loadingProvider, setLoadingProvider] = useState<OAuthProviderId | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (providers.length === 0 && !telegramEnabled) {
    return null;
  }

  async function handleOAuthSignIn(provider: OAuthProviderId) {
    setErrorMessage(null);
    setLoadingProvider(provider);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setLoadingProvider(null);
      setErrorMessage(tLogin("supabaseMissing"));
      return;
    }

    const redirectTo = buildAuthCallbackUrl(nextPath, undefined, toLocale(locale));
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: getOAuthSignInOptions(provider, redirectTo),
    });

    setLoadingProvider(null);

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <p className="relative mx-auto w-fit bg-surface px-3 text-xs uppercase tracking-wide text-text-muted">
          {t("divider")}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium text-text transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none ${providerStyles[provider.id]}`}
            disabled={loadingProvider !== null}
            onClick={() => void handleOAuthSignIn(provider.id)}
          >
            {loadingProvider === provider.id ? t("connecting") : t(provider.labelKey)}
          </button>
        ))}

        {telegramEnabled ? <TelegramLoginButton /> : null}
      </div>

      <p className="mt-3 text-center text-xs leading-relaxed text-text-muted">{t("hint")}</p>
      {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
