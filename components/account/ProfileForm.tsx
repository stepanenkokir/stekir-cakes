"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
      setErrorMessage("Account service is not configured.");
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

    setStatusMessage("Profile updated successfully.");
    router.refresh();
  }

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);

    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      setIsSavingPassword(false);
      setErrorMessage("Account service is not configured.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setIsSavingPassword(false);
      setErrorMessage("Current password is incorrect.");
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
    setStatusMessage("Password updated successfully.");
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Delete your account permanently? This cannot be undone. Active orders may still be fulfilled per our terms.",
    );

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
        setErrorMessage(data.error ?? "Unable to delete account.");
        return;
      }

      const supabase = getSupabaseBrowserClientOrNull();
      if (supabase) {
        await supabase.auth.signOut();
      }

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("Unable to delete account. Please try again.");
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
        <h2 className="font-display text-2xl text-text">Profile details</h2>
        <p className="mt-1 text-sm text-text-muted">Update your contact and default delivery info.</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField label="Email" htmlFor="profile-email">
            <input
              id="profile-email"
              type="email"
              value={email}
              disabled
              className={formInputClassName("opacity-70")}
            />
          </FormField>

          <FormField label="Full name" htmlFor="profile-full-name">
            <input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={formInputClassName()}
              autoComplete="name"
            />
          </FormField>

          <FormField label="Phone" htmlFor="profile-phone">
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
              label="Default delivery address"
              htmlFor="profile-default-address"
              hint="Optional — pre-fills checkout when you order delivery."
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
          {isSavingProfile ? "Saving..." : "Save Profile"}
        </Button>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
      >
        <h2 className="font-display text-2xl text-text">Change password</h2>
        <p className="mt-1 text-sm text-text-muted">
          Password sign-in only. Magic-link users can set a password here.
        </p>

        <div className="mt-6 grid max-w-md gap-5">
          <FormField label="Current password" htmlFor="profile-current-password">
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

          <FormField label="New password" htmlFor="profile-new-password">
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

          <FormField label="Confirm new password" htmlFor="profile-confirm-password">
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
          {isSavingPassword ? "Updating..." : "Update Password"}
        </Button>
      </form>

      <section className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
        <h2 className="font-display text-2xl text-text">Delete account</h2>
        <p className="mt-2 text-sm text-text-muted">
          Permanently remove your account and profile. Order history may be retained for bakery records.
        </p>
        <Button
          type="button"
          variant="ghost"
          className="mt-4 border-red-300 text-red-700 hover:border-red-400 hover:bg-red-100"
          onClick={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </Button>
      </section>
    </div>
  );
}
