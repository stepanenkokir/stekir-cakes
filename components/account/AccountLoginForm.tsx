"use client";

import { useMemo, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AccountAuthCard } from "@/components/account/AccountAuthCard";
import { AccountOAuthButtons } from "@/components/account/AccountOAuthButtons";
import { useAuthNextPath } from "@/components/account/useAuthNextPath";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { OTP_TOKEN_LENGTH } from "@/lib/account/auth-callback";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

type LoginMode = "password" | "magic-link";
type OtpStep = "email" | "code";

export function AccountLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("account.login");
  const tc = useTranslations("common");
  const nextPath = useAuthNextPath();
  const callbackError = useMemo(() => searchParams.get("error"), [searchParams]);

  const [mode, setMode] = useState<LoginMode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function resetOtpFlow() {
    setOtpStep("email");
    setOtpCode("");
  }

  function handleModeChange(nextMode: LoginMode) {
    setMode(nextMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (nextMode === "password") {
      resetOtpFlow();
    }
  }

  async function handlePasswordSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setIsLoading(false);
      setErrorMessage(t("supabaseMissing"));
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  async function sendOtpCode() {
    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setErrorMessage(t("supabaseMissing"));
      return false;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });

    if (error) {
      setErrorMessage(error.message);
      return false;
    }

    return true;
  }

  async function handleSendOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const sent = await sendOtpCode();
    setIsLoading(false);

    if (!sent) {
      return;
    }

    setOtpStep("code");
    setSuccessMessage(t("magicSent"));
  }

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setIsLoading(false);
      setErrorMessage(t("supabaseMissing"));
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otpCode.trim(),
      type: "email",
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message || t("otpInvalid"));
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  async function handleResendOtp() {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const sent = await sendOtpCode();
    setIsLoading(false);

    if (sent) {
      setSuccessMessage(t("magicSent"));
    }
  }

  return (
    <AccountAuthCard
      title={t("title")}
      intro={t("intro")}
      footer={
        <p className="text-sm text-text-muted">
          {t("noAccount")}{" "}
          <Link
            href={`/account/register?next=${encodeURIComponent(nextPath)}`}
            className="font-medium text-primary-dark hover:underline"
          >
            {tc("createAccount")}
          </Link>
        </p>
      }
    >
      <AccountOAuthButtons />

      <div className="mt-6 grid grid-cols-2 rounded-full border border-border bg-bg p-1">
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "password"
              ? "bg-primary text-white"
              : "text-text-muted hover:text-primary-dark"
          }`}
          onClick={() => handleModeChange("password")}
        >
          {t("passwordTab")}
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "magic-link"
              ? "bg-primary text-white"
              : "text-text-muted hover:text-primary-dark"
          }`}
          onClick={() => handleModeChange("magic-link")}
        >
          {t("magicTab")}
        </button>
      </div>

      {callbackError === "auth_callback_failed" ? (
        <p className="mt-4 text-sm text-red-600">{t("callbackFailed")}</p>
      ) : null}

      {mode === "password" ? (
        <form onSubmit={handlePasswordSignIn} className="mt-6 space-y-5">
          <FormField label={t("email")} htmlFor="email" hint={t("emailHintOrder")}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={formInputClassName()}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              required
            />
          </FormField>

          <FormField label={t("password")} htmlFor="password">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={formInputClassName()}
              autoComplete="current-password"
              required
            />
          </FormField>

          <div className="text-right">
            <Link href="/account/forgot-password" className="text-sm font-medium text-primary-dark hover:underline">
              {tc("forgotPassword")}
            </Link>
          </div>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-primary-dark">{successMessage}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("signingIn") : tc("signIn")}
          </Button>
        </form>
      ) : otpStep === "email" ? (
        <form onSubmit={handleSendOtp} className="mt-6 space-y-5">
          <FormField label={t("email")} htmlFor="magic-email" hint={t("emailHintMagic")}>
            <input
              id="magic-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={formInputClassName()}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              required
            />
          </FormField>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-primary-dark">{successMessage}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? tc("sending") : t("sendMagic")}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
          <FormField label={t("email")} htmlFor="magic-email-readonly">
            <input
              id="magic-email-readonly"
              type="email"
              value={email}
              className={formInputClassName()}
              readOnly
            />
          </FormField>

          <FormField label={t("otpCode")} htmlFor="otp-code" hint={t("emailHintMagic")}>
            <input
              id="otp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otpCode}
              onChange={(event) =>
                setOtpCode(event.target.value.replace(/\D/g, "").slice(0, OTP_TOKEN_LENGTH))
              }
              className={formInputClassName()}
              placeholder={t("otpPlaceholder")}
              pattern={`\\d{${OTP_TOKEN_LENGTH}}`}
              maxLength={OTP_TOKEN_LENGTH}
              required
            />
          </FormField>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-primary-dark">{successMessage}</p> : null}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otpCode.length !== OTP_TOKEN_LENGTH}
          >
            {isLoading ? t("verifying") : t("verifyCode")}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="font-medium text-primary-dark hover:underline disabled:opacity-60"
              disabled={isLoading}
              onClick={() => {
                resetOtpFlow();
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              {t("changeEmail")}
            </button>
            <button
              type="button"
              className="font-medium text-primary-dark hover:underline disabled:opacity-60"
              disabled={isLoading}
              onClick={() => void handleResendOtp()}
            >
              {t("resendCode")}
            </button>
          </div>
        </form>
      )}
    </AccountAuthCard>
  );
}
