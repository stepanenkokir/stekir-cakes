"use client";

import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AccountAuthCard } from "@/components/account/AccountAuthCard";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { isPasswordStrongEnough } from "@/lib/account/auth-callback";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

export function AccountResetPasswordForm() {
  const router = useRouter();
  const t = useTranslations("account.resetPassword");
  const tLogin = useTranslations("account.login");
  const tc = useTranslations("common");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setIsCheckingSession(false);
      return;
    }

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(Boolean(session));
      setIsCheckingSession(false);
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isPasswordStrongEnough(newPassword)) {
      setErrorMessage(t("passwordLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t("passwordMismatch"));
      return;
    }

    setIsLoading(true);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setIsLoading(false);
      setErrorMessage(tLogin("supabaseMissing"));
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage(t("success"));
    setTimeout(() => {
      router.replace("/account");
      router.refresh();
    }, 1200);
  }

  if (isCheckingSession) {
    return (
      <AccountAuthCard title={t("title")} intro={t("checking")}>
        <p className="mt-6 text-sm text-text-muted">{tc("updating")}</p>
      </AccountAuthCard>
    );
  }

  if (!hasSession) {
    return (
      <AccountAuthCard
        title={t("title")}
        intro={t("expiredIntro")}
        footer={
          <Link href="/account/forgot-password" className="text-sm font-medium text-primary-dark hover:underline">
            {t("requestNewLink")}
          </Link>
        }
      >
        <p className="mt-6 text-sm text-red-600">{t("expired")}</p>
      </AccountAuthCard>
    );
  }

  return (
    <AccountAuthCard title={t("title")} intro={t("intro")}>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <FormField label={t("newPassword")} htmlFor="reset-password" hint={t("passwordHint")}>
          <input
            id="reset-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className={formInputClassName()}
            autoComplete="new-password"
            required
          />
        </FormField>

        <FormField label={t("confirmPassword")} htmlFor="reset-confirm-password">
          <input
            id="reset-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={formInputClassName()}
            autoComplete="new-password"
            required
          />
        </FormField>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        {successMessage ? <p className="text-sm text-primary-dark">{successMessage}</p> : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? tc("updating") : t("savePassword")}
        </Button>
      </form>
    </AccountAuthCard>
  );
}
