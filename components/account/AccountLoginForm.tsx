"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

type LoginMode = "password" | "magic-link";

export function AccountLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("account.login");
  const tc = useTranslations("common");
  const nextPath = useMemo(() => {
    const param = searchParams.get("next");
    return param && param.startsWith("/") ? param : "/account";
  }, [searchParams]);

  const [mode, setMode] = useState<LoginMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  async function handleMagicLink(event: React.FormEvent<HTMLFormElement>) {
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
    const redirectTo = new URL(nextPath, window.location.origin).toString();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage(t("magicSent"));
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 shadow-card">
        <h1 className="font-display text-3xl text-text">{t("title")}</h1>
        <p className="mt-2 text-sm text-text-muted">{t("intro")}</p>

        <div className="mt-6 grid grid-cols-2 rounded-full border border-border bg-bg p-1">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === "password"
                ? "bg-primary text-white"
                : "text-text-muted hover:text-primary-dark"
            }`}
            onClick={() => setMode("password")}
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
            onClick={() => setMode("magic-link")}
          >
            {t("magicTab")}
          </button>
        </div>

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

            {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm text-primary-dark">{successMessage}</p> : null}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("signingIn") : tc("signIn")}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-6 space-y-5">
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
        )}
      </div>
    </main>
  );
}
