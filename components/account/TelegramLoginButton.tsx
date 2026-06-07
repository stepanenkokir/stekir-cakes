"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuthNextPath } from "@/components/account/useAuthNextPath";
import { getTelegramBotUsername } from "@/lib/account/telegram-config";

type TelegramAuthPayload = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthPayload) => void;
  }
}

export function TelegramLoginButton() {
  const router = useRouter();
  const t = useTranslations("account.oauth");
  const nextPath = useAuthNextPath();
  const botUsername = getTelegramBotUsername();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!botUsername || !containerRef.current) {
      return;
    }

    async function handleTelegramAuth(user: TelegramAuthPayload) {
      setErrorMessage(null);
      setIsLoading(true);

      try {
        const response = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...user, next: nextPath }),
        });

        const data = (await response.json()) as {
          success?: boolean;
          redirect?: string;
          error?: string;
        };

        if (!response.ok || !data.success) {
          setErrorMessage(data.error ?? t("telegramFailed"));
          setIsLoading(false);
          return;
        }

        router.replace(data.redirect ?? nextPath);
        router.refresh();
      } catch {
        setErrorMessage(t("telegramFailed"));
        setIsLoading(false);
      }
    }

    window.onTelegramAuth = handleTelegramAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "16");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    const container = containerRef.current;
    container.innerHTML = "";
    container.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
      container.innerHTML = "";
    };
  }, [botUsername, nextPath, router, t]);

  if (!botUsername) {
    return null;
  }

  return (
    <div>
      <div
        className={`flex min-h-[48px] items-center justify-center overflow-hidden rounded-2xl border border-[#2AABEE]/35 bg-[#2AABEE]/5 px-2 py-1 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2AABEE] hover:bg-[#2AABEE]/15 hover:shadow-[0_8px_24px_rgba(42,171,238,0.28)] active:translate-y-0 ${
          isLoading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <div ref={containerRef} className="flex w-full justify-center [&>iframe]:!w-full" />
      </div>
      {isLoading ? <p className="mt-2 text-center text-xs text-text-muted">{t("connecting")}</p> : null}
      {errorMessage ? <p className="mt-2 text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
