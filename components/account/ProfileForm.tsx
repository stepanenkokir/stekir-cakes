"use client";

import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

type ProfileFormProps = {
  userId: string;
  email: string;
  initialFullName: string;
  initialPhone: string;
  initialDefaultAddress: string;
};

export function ProfileForm({
  userId,
  email,
  initialFullName,
  initialPhone,
  initialDefaultAddress,
}: ProfileFormProps) {
  const router = useRouter();
  const t = useTranslations("account.profile");
  const tLogin = useTranslations("account.login");
  const tc = useTranslations("common");
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [defaultAddress, setDefaultAddress] = useState(initialDefaultAddress);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSavingProfile(true);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setIsSavingProfile(false);
      setErrorMessage(t("messages.notConfigured"));
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        default_address: defaultAddress.trim() || null,
      })
      .eq("id", userId);

    setIsSavingProfile(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setStatusMessage(t("messages.profileUpdated"));
    router.refresh();
  }

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage(t("messages.passwordLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t("messages.passwordMismatch"));
      return;
    }

    setIsSavingPassword(true);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setIsSavingPassword(false);
      setErrorMessage(t("messages.notConfigured"));
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setIsSavingPassword(false);
      setErrorMessage(t("messages.wrongPassword"));
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setIsSavingPassword(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatusMessage(t("messages.passwordUpdated"));
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(t("deleteConfirm"));

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);
    setIsDeleting(true);

    try {
      const response = await fetch("/api/account/delete", { method: "POST" });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(data.error ?? t("messages.deleteFailed"));
        return;
      }

      const supabase = getSupabaseBrowserClientOrNull();
      if (supabase) {
        await supabase.auth.signOut();
      }

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage(t("messages.deleteFailed"));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {statusMessage ? (
        <p className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm text-primary-dark">
          {statusMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
      >
        <h2 className="font-display text-2xl text-text">{t("title")}</h2>
        <p className="mt-1 text-sm text-text-muted">{t("intro")}</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField label={tLogin("email")} htmlFor="profile-email">
            <input
              id="profile-email"
              type="email"
              value={email}
              disabled
              className={formInputClassName("opacity-70")}
            />
          </FormField>

          <FormField label={t("fullName")} htmlFor="profile-full-name">
            <input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={formInputClassName()}
              autoComplete="name"
            />
          </FormField>

          <FormField label={t("phone")} htmlFor="profile-phone">
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={formInputClassName()}
              autoComplete="tel"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField
              label={t("defaultAddress")}
              htmlFor="profile-default-address"
              hint={t("addressHint")}
            >
              <textarea
                id="profile-default-address"
                rows={3}
                value={defaultAddress}
                onChange={(event) => setDefaultAddress(event.target.value)}
                className={formInputClassName("resize-y")}
              />
            </FormField>
          </div>
        </div>

        <Button type="submit" className="mt-6" disabled={isSavingProfile}>
          {isSavingProfile ? tc("saving") : tc("saveProfile")}
        </Button>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
      >
        <h2 className="font-display text-2xl text-text">{t("changePassword")}</h2>
        <p className="mt-1 text-sm text-text-muted">{t("passwordHint")}</p>

        <div className="mt-6 grid max-w-md gap-5">
          <FormField label={t("currentPassword")} htmlFor="profile-current-password">
            <input
              id="profile-current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={formInputClassName()}
              autoComplete="current-password"
              required
            />
          </FormField>

          <FormField label={t("newPassword")} htmlFor="profile-new-password">
            <input
              id="profile-new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={formInputClassName()}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </FormField>

          <FormField label={t("confirmPassword")} htmlFor="profile-confirm-password">
            <input
              id="profile-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={formInputClassName()}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </FormField>
        </div>

        <Button type="submit" className="mt-6" disabled={isSavingPassword}>
          {isSavingPassword ? tc("updating") : tc("updatePassword")}
        </Button>
      </form>

      <section className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
        <h2 className="font-display text-2xl text-text">{t("deleteTitle")}</h2>
        <p className="mt-2 text-sm text-text-muted">{t("deleteText")}</p>
        <Button
          type="button"
          variant="ghost"
          className="mt-4 border-red-300 text-red-700 hover:border-red-400 hover:bg-red-100"
          onClick={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? tc("deleting") : tc("deleteAccount")}
        </Button>
      </section>
    </div>
  );
}
