"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AccountAuthCard } from "@/components/account/AccountAuthCard";
import { AccountOAuthButtons } from "@/components/account/AccountOAuthButtons";
import { useAuthNextPath } from "@/components/account/useAuthNextPath";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { buildAuthCallbackUrl, isPasswordStrongEnough } from "@/lib/account/auth-callback";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

export function AccountRegisterForm() {
  const router = useRouter();
  const t = useTranslations("account.register");
  const tLogin = useTranslations("account.login");
  const tc = useTranslations("common");
  const nextPath = useAuthNextPath();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isPasswordStrongEnough(password)) {
      setErrorMessage(t("passwordLength"));
      return;
    }

    if (password !== confirmPassword) {
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

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: buildAuthCallbackUrl(nextPath),
      },
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      router.replace(nextPath);
      router.refresh();
      return;
    }

    setSuccessMessage(t("confirmEmail"));
  }

  return (
    <AccountAuthCard
      title={t("title")}
      intro={t("intro")}
      footer={
        <p className="text-sm text-text-muted">
          {t("hasAccount")}{" "}
          <Link href={`/account/login?next=${encodeURIComponent(nextPath)}`} className="font-medium text-primary-dark hover:underline">
            {tc("signIn")}
          </Link>
        </p>
      }
    >
      <AccountOAuthButtons />

      <form onSubmit={handleRegister} className="mt-6 space-y-5">
        <FormField label={t("fullName")} htmlFor="register-full-name">
          <input
            id="register-full-name"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={formInputClassName()}
            autoComplete="name"
            required
          />
        </FormField>

        <FormField label={tLogin("email")} htmlFor="register-email" hint={t("emailHint")}>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={formInputClassName()}
            placeholder={tLogin("emailPlaceholder")}
            autoComplete="email"
            required
          />
        </FormField>

        <FormField label={tLogin("password")} htmlFor="register-password" hint={t("passwordHint")}>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={formInputClassName()}
            autoComplete="new-password"
            required
          />
        </FormField>

        <FormField label={t("confirmPassword")} htmlFor="register-confirm-password">
          <input
            id="register-confirm-password"
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
          {isLoading ? t("creating") : tc("createAccount")}
        </Button>
      </form>
    </AccountAuthCard>
  );
}
