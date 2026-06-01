"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

type LoginMode = "password" | "magic-link";

export default function AccountLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      setErrorMessage(
        "Supabase is not configured yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
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
      setErrorMessage(
        "Supabase is not configured yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
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

    setSuccessMessage("Magic link sent. Check your inbox to continue.");
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 shadow-card">
        <h1 className="font-display text-3xl text-text">My Account</h1>
        <p className="mt-2 text-sm text-text-muted">
          Sign in to view your orders and track your cake status.
        </p>

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
            Password
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
            Magic Link
          </button>
        </div>

        {mode === "password" ? (
          <form onSubmit={handlePasswordSignIn} className="mt-6 space-y-5">
            <FormField label="Email" htmlFor="email" hint="Use the email you ordered with.">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={formInputClassName()}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </FormField>

            <FormField label="Password" htmlFor="password">
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
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-6 space-y-5">
            <FormField
              label="Email"
              htmlFor="magic-email"
              hint="We will send a secure sign-in link to this email."
            >
              <input
                id="magic-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={formInputClassName()}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </FormField>

            {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm text-primary-dark">{successMessage}</p> : null}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
