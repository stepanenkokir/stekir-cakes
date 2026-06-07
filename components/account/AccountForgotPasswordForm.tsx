"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AccountAuthCard } from "@/components/account/AccountAuthCard";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { buildAuthCallbackUrl } from "@/lib/account/auth-callback";
import { toLocale } from "@/lib/i18n/locale";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

export function AccountForgotPasswordForm() {
  const t = useTranslations("account.forgotPassword");
  const tLogin = useTranslations("account.login");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setIsLoading(false);
      setErrorMessage(tLogin("supabaseMissing"));
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: buildAuthCallbackUrl("/account/reset-password", undefined, toLocale(locale)),
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage(t("emailSent"));
  }

  return (
    <AccountAuthCard
      title={t("title")}
      intro={t("intro")}
      footer={
        <Link href="/account/login" className="text-sm font-medium text-primary-dark hover:underline">
          {t("backToLogin")}
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <FormField label={tLogin("email")} htmlFor="forgot-email" hint={t("emailHint")}>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={formInputClassName()}
            placeholder={tLogin("emailPlaceholder")}
            autoComplete="email"
            required
          />
        </FormField>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        {successMessage ? <p className="text-sm text-primary-dark">{successMessage}</p> : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? tc("sending") : t("sendLink")}
        </Button>
      </form>
    </AccountAuthCard>
  );
}
